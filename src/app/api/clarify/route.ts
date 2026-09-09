import { NextRequest, NextResponse } from "next/server";
import { ClarifyRequestSchema } from "@/lib/ai/schemas";
import { generateJSON } from "@/lib/ai/provider";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ClarifyRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Ide minimal 10 karakter.", details: parsed.error.flatten() }, { status: 400 });

    const { idea, projectName, tech } = parsed.data;

    const system = `You are AI Product Planner — Context Analyzer + Question Generator.
Analyze raw idea and produce 5-10 clarification questions that materially affect architecture/feature/scope.
Rules: relevant, short, easy to answer, do not ask what is already provided. Max 2 rounds. Language: match user's idea language (ID if Indonesian).
Output JSON ONLY: { "questions": [{ "id":"q1","question":"...","type":"single_choice|multiple_choice|text|boolean","options":["..."] }], "summary":"1-sentence summary" }
Types: single_choice needs 2-4 options, multiple_choice 3-5, text no options, boolean options ["Ya","Tidak"].
Cover: roles/permissions, core flow, payment if needed, scope MVP, integrations, tech constraints.`;

    const user = `Project: ${projectName || "(tanpa nama)"}\nTech preference: ${tech || "(bebas)"}\nRaw idea:\n${idea}`;

    const data = await generateJSON<{ questions: unknown; summary?: string }>({ system, user });
    return NextResponse.json(data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Generate gagal";
    const status = msg.includes("OPENAI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
