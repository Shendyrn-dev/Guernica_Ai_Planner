import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

type Provider = "openrouter" | "gemini" | "openai";

function activeProvider(): Provider {
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  throw new Error("Missing API key. Isi OPENROUTER_API_KEY (OpenRouter) atau GOOGLE_API_KEY atau OPENAI_API_KEY di .env.local");
}

const OPENROUTER_FALLBACKS = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
];

const FAST_DEFAULTS: Record<Provider, string> = {
  openrouter: "google/gemma-4-31b-it:free",
  gemini: "gemini-2.0-flash",
  openai: "gpt-4o-mini",
};

function geminiModel(name?: string) {
  return name || process.env.GEMINI_MODEL || process.env.GOOGLE_MODEL || FAST_DEFAULTS.gemini;
}
function openaiModel(name?: string) {
  return name || process.env.OPENAI_MODEL || FAST_DEFAULTS.openai;
}
function openrouterModel(name?: string) {
  return name || process.env.OPENROUTER_MODEL || FAST_DEFAULTS.openrouter;
}

function openRouterClient() {
  return new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || "",
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_TITLE || "AI Planner",
    },
  });
}

const PLAN_TIMEOUT_MS = Number(process.env.PLAN_TIMEOUT_MS || 55_000);
const CLARIFY_TIMEOUT_MS = Number(process.env.CLARIFY_TIMEOUT_MS || 25_000);

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

async function retry<T>(fn: () => Promise<T>, attempts = 2, label = "ai"): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i === attempts - 1) break;
      await new Promise((r) => setTimeout(r, 250 * (i + 1)));
    }
  }
  throw lastErr;
}

function clampStr(s: string, max = 24_000): string {
  if (s.length <= max) return s;
  return s.slice(0, max) + "\n...[truncated]";
}

function geminiJSON<T>(system: string, user: string, modelName?: string): Promise<T> {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: geminiModel(modelName),
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.5,
      maxOutputTokens: 1500,
    } as never,
  });
  return withTimeout(
    retry(async () => {
      const res = await model.generateContent(`${clampStr(system)}\n\nUSER:\n${clampStr(user)}\n\nRespond JSON only.`);
      const text = res.response.text() || "{}";
      const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      return JSON.parse(cleaned) as T;
    }, 2, "gemini"),
    CLARIFY_TIMEOUT_MS,
    "gemini"
  );
}

function geminiMarkdown(system: string, user: string, modelName?: string): Promise<string> {
  const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
  const client = new GoogleGenerativeAI(key);
  const model = client.getGenerativeModel({
    model: geminiModel(modelName),
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 6000,
    } as never,
  });
  return withTimeout(
    retry(async () => {
      const res = await model.generateContentStream(`${clampStr(system)}\n\nUSER:\n${clampStr(user)}`);
      let out = "";
      for await (const chunk of res.stream) {
        out += chunk.text();
      }
      return out;
    }, 2, "gemini"),
    PLAN_TIMEOUT_MS,
    "gemini"
  );
}

async function openaiJSON<T>(system: string, user: string, modelName?: string): Promise<T> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  return withTimeout(
    retry(async () => {
      const res = await client.chat.completions.create({
        model: openaiModel(modelName),
        response_format: { type: "json_object" } as never,
        messages: [
          { role: "system", content: clampStr(system) },
          { role: "user", content: clampStr(user) },
        ],
        temperature: 0.5,
        max_tokens: 1500,
      });
      return JSON.parse(res.choices[0]?.message?.content || "{}") as T;
    }, 2, "openai"),
    CLARIFY_TIMEOUT_MS,
    "openai"
  );
}

function openaiMarkdown(system: string, user: string, modelName?: string): Promise<string> {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
  return withTimeout(
    retry(async () => {
      const res = await client.chat.completions.create({
        model: openaiModel(modelName),
        messages: [
          { role: "system", content: clampStr(system) },
          { role: "user", content: clampStr(user) },
        ],
        temperature: 0.5,
        max_tokens: 6000,
        stream: true,
      });
      let out = "";
      for await (const chunk of res as unknown as AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (typeof delta === "string") out += delta;
      }
      return out;
    }, 2, "openai"),
    PLAN_TIMEOUT_MS,
    "openai"
  );
}

async function tryOpenRouterJSON<T>(client: ReturnType<typeof openRouterClient>, system: string, user: string, modelName?: string): Promise<T> {
  const models = [openrouterModel(modelName), ...OPENROUTER_FALLBACKS.filter((m) => m !== openrouterModel(modelName))];
  let lastErr: unknown;
  for (const model of models) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: clampStr(system) + "\n\nReturn JSON only. No markdown fence." },
          { role: "user", content: clampStr(user) },
        ],
        temperature: 0.5,
        max_tokens: 1500,
      } as never);
      const text = typeof res.choices[0]?.message?.content === "string"
        ? (res.choices[0].message.content as string)
        : JSON.stringify(res.choices[0]?.message?.content || "{}");
      const m = text.match(/\{[\s\S]*\}/);
      const cleaned = (m ? m[0] : text).replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
      return JSON.parse(cleaned) as T;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!/No endpoints|404|not found/i.test(msg)) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}

async function openrouterJSON<T>(system: string, user: string, modelName?: string): Promise<T> {
  const client = openRouterClient();
  return withTimeout(
    retry(() => tryOpenRouterJSON<T>(client, system, user, modelName), 2, "openrouter"),
    CLARIFY_TIMEOUT_MS,
    "openrouter"
  );
}

async function tryOpenRouterMarkdown(client: ReturnType<typeof openRouterClient>, system: string, user: string, modelName?: string): Promise<string> {
  const models = [openrouterModel(modelName), ...OPENROUTER_FALLBACKS.filter((m) => m !== openrouterModel(modelName))];
  let lastErr: unknown;
  for (const model of models) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: clampStr(system) },
          { role: "user", content: clampStr(user) },
        ],
        temperature: 0.5,
        max_tokens: 6000,
        stream: true,
      } as never);
      let out = "";
      for await (const chunk of res as unknown as AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (typeof delta === "string") out += delta;
      }
      return out;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!/No endpoints|404|not found/i.test(msg)) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}

function openrouterMarkdown(system: string, user: string, modelName?: string): Promise<string> {
  const client = openRouterClient();
  return withTimeout(retry(() => tryOpenRouterMarkdown(client, system, user, modelName), 2, "openrouter"), PLAN_TIMEOUT_MS, "openrouter");
}

export async function generateJSON<T>(opts: { system: string; user: string; model?: string }): Promise<T> {
  const p = activeProvider();
  if (p === "openrouter") return openrouterJSON<T>(opts.system, opts.user, opts.model);
  if (p === "gemini") return geminiJSON<T>(opts.system, opts.user, opts.model);
  return openaiJSON<T>(opts.system, opts.user, opts.model);
}

export async function generateMarkdown(opts: { system: string; user: string; model?: string }): Promise<string> {
  const p = activeProvider();
  if (p === "openrouter") return openrouterMarkdown(opts.system, opts.user, opts.model);
  if (p === "gemini") return geminiMarkdown(opts.system, opts.user, opts.model);
  return openaiMarkdown(opts.system, opts.user, opts.model);
}

async function* tryOpenRouterStream(client: ReturnType<typeof openRouterClient>, sys: string, usr: string, modelName?: string): AsyncGenerator<string, void, unknown> {
  const models = [openrouterModel(modelName), ...OPENROUTER_FALLBACKS.filter((m) => m !== openrouterModel(modelName))];
  let lastErr: unknown;
  for (const model of models) {
    try {
      const res = await client.chat.completions.create({
        model,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: usr },
        ],
        temperature: 0.5,
        max_tokens: 6000,
        stream: true,
      } as never);
      for await (const chunk of res as unknown as AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (typeof delta === "string") yield delta;
      }
      return;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!/No endpoints|404|not found/i.test(msg)) throw e;
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function* streamMarkdown(opts: { system: string; user: string; model?: string }): AsyncGenerator<string, void, unknown> {
  const p = activeProvider();
  const sys = clampStr(opts.system);
  const usr = clampStr(opts.user);

  if (p === "openrouter") {
    const client = openRouterClient();
    yield* tryOpenRouterStream(client, sys, usr, opts.model);
    return;
  }

  if (p === "gemini") {
    const key = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "";
    const client = new GoogleGenerativeAI(key);
    const model = client.getGenerativeModel({
      model: geminiModel(opts.model),
      generationConfig: { temperature: 0.5, maxOutputTokens: 6000 } as never,
    });
    const res = await model.generateContentStream(`${sys}\n\nUSER:\n${usr}`);
    for await (const chunk of res.stream) {
      yield chunk.text();
    }
    return;
  }

  {
    const client2 = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
    const res2 = await client2.chat.completions.create({
      model: openaiModel(opts.model),
      messages: [
        { role: "system", content: sys },
        { role: "user", content: usr },
      ],
      temperature: 0.5,
      max_tokens: 6000,
      stream: true,
    });
    for await (const chunk of res2 as unknown as AsyncIterable<{ choices?: Array<{ delta?: { content?: string } }> }>) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (typeof delta === "string") yield delta;
    }
  }
}

export const providerInfo = {
  defaultModel: (p: Provider) => FAST_DEFAULTS[p],
};
