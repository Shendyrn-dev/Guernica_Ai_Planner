"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Download, Loader2, Sparkles, Check, Square } from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Nav, Footer } from "@/components/landing/sections";
import { SonarGrid } from "@/components/ui/sonar-grid";
import { Reveal } from "@/components/ui/reveal";
import type { Question } from "@/lib/ai/schemas";

type Step = "input" | "questions" | "result";

export default function CreatePage() {
  const [step, setStep] = useState<Step>("input");
  const [projectName, setProjectName] = useState("");
  const [idea, setIdea] = useState("");
  const [tech, setTech] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const canClarify = idea.trim().length >= 10 && !loading;

  async function handleClarify() {
    setError(null);
    setLoading(true);
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 28_000);
      const res = await fetch("/api/clarify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, projectName: projectName || undefined, tech: tech || undefined }),
        signal: controller.signal,
      });
      clearTimeout(t);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal generate pertanyaan");
      setQuestions(data.questions || []);
      setStep("questions");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? (e.name === "AbortError" ? "Timeout — coba lagi (model lambat)" : e.message) : "Gagal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function setAnswer(id: string, value: string | string[], type: string) {
    setAnswers((prev) => {
      if (type === "multiple_choice") {
        const cur = (prev[id] as string[]) || [];
        const next = cur.includes(value as string) ? cur.filter((v) => v !== value) : [...cur, value as string];
        return { ...prev, [id]: next };
      }
      return { ...prev, [id]: value };
    });
  }

  async function streamPlan(payloadAnswers: { id: string; answer: string | string[] }[]) {
    setError(null);
    setLoading(true);
    setMarkdown("");
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      const res = await fetch("/api/plan/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ idea, projectName: projectName || undefined, tech: tech || undefined, answers: payloadAnswers }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        try {
          const j = JSON.parse(text);
          throw new Error(j.error || text || `Stream gagal ${res.status}`);
        } catch {
          if (text) throw new Error(text.slice(0, 400));
          throw new Error(`Stream gagal ${res.status}`);
        }
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { value, done: rDone } = await reader.read();
        if (rDone) break;
        buf += decoder.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() || "";
        for (const part of parts) {
          if (!part.trim()) continue;
          const lines = part.split("\n");
          let event = "message";
          let data = "";
          for (const line of lines) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) data = line.slice(5).trim();
          }
          if (!data) continue;
          let obj: Record<string, unknown> = {};
          try { obj = JSON.parse(data) as Record<string, unknown>; } catch { continue; }
          if (event === "token" && typeof obj.token === "string") {
            setMarkdown((p) => p + (obj.token as string));
          } else if (event === "error") {
            throw new Error((obj.error as string) || "Stream error");
          } else if (event === "done") {
            done = true;
          }
        }
      }
      if (buf.trim()) {
        const m = buf.match(/\{[\s\S]*\}/);
        if (m) {
          try {
            const obj = JSON.parse(m[0]) as Record<string, unknown>;
            if (typeof obj.token === "string") setMarkdown((p) => p + (obj.token as string));
          } catch {}
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? (e.name === "AbortError" ? "Dibatalkan" : e.message) : "Gagal";
      if (markdown.length < 20) {
        try {
          const fallback = await fetch("/api/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea, projectName: projectName || undefined, tech: tech || undefined, answers: payloadAnswers }),
          });
          const data = await fallback.json();
          if (!fallback.ok) throw new Error(data.error || msg);
          setMarkdown(data.markdown || "");
          return;
        } catch {
          setError(msg);
          setStep("questions");
        }
      } else {
        setError(msg.includes("TIMEOUT") ? "Timeout model — sebagian hasil sudah muncul, coba Generate lagi" : msg);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  async function handleGenerate() {
    const payloadAnswers = Object.entries(answers).map(([id, answer]) => ({ id, answer }));
    await streamPlan(payloadAnswers);
  }

  async function handleGenerateWith(override: Record<string, string | string[]>) {
    const payloadAnswers = Object.entries(override).map(([id, answer]) => ({ id, answer }));
    await streamPlan(payloadAnswers);
  }

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(projectName || "plan").replace(/\s+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden">
      <Nav />

      <SonarGrid className="bg-transparent overflow-hidden" spacing={28} baseOpacity={0.1} pingEvery={3.4} interactive pingArea={[0.18, 0.12, 0.82, 0.88]}>
        <section className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-[72px] sm:px-6 sm:pb-10 sm:pt-24 md:pb-14 md:pt-36">
          <div className="mx-auto max-w-[860px]">
            <Reveal y={14}>
              <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke beranda
              </Link>
            </Reveal>
            <Reveal delay={0.06} y={16}>
              <div className="mt-4 inline-flex max-w-full items-center gap-2 bg-black px-3 py-1.5 text-xs font-medium text-white sm:mt-6 dark:bg-white dark:text-black">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse bg-white dark:bg-black" /> IDE → CLARIFY → PRD → SPEC → TASK
              </div>
            </Reveal>
            <motion.h1
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="mt-5 text-[28px] font-semibold leading-[0.95] tracking-[-0.03em] sm:mt-8 sm:text-4xl md:text-5xl"
            >
              {step === "input" && "Apa yang ingin kamu bangun?"}
              {step === "questions" && "Klarifikasi cepat"}
              {step === "result" && (loading ? "Menulis blueprint…" : "Blueprint siap")}
            </motion.h1>
            <Reveal delay={0.18} y={14}>
              <p className="mt-3 max-w-[56ch] text-sm leading-[1.7] text-neutral-600 sm:mt-4 sm:text-[15px] dark:text-neutral-400">
                {step === "input" && "Tulis ide mentah — 5 baris cukup. AI akan analisis dan bertanya sebelum bikin PRD & tasks."}
                {step === "questions" && "Jawab seperlunya — kosongkan yang belum yakin. Ini yang bikin PRD tidak ngarang."}
                {step === "result" && (loading ? "Streaming langsung — hasil muncul kata per kata, tidak perlu tunggu 60s." : "Copy, export .md, dan tempel langsung ke Cursor / Claude Code / Codex.")}
              </p>
            </Reveal>

            <Reveal delay={0.24} y={12}>
              <div className="mt-6 flex flex-wrap items-center gap-1.5 font-mono text-[11px] sm:gap-2 sm:text-xs">
                <span className={`shrink-0 px-2.5 py-1.5 text-[11px] font-medium tracking-wide sm:px-3 sm:text-xs ${step === "input" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-neutral-600 dark:bg-black dark:text-neutral-400 border"}`}>01 — Ide</span>
                <span className="text-neutral-400">→</span>
                <span className={`shrink-0 px-2.5 py-1.5 text-[11px] font-medium tracking-wide sm:px-3 sm:text-xs ${step === "questions" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-neutral-600 dark:bg-black dark:text-neutral-400 border"}`}>02 — Clarify</span>
                <span className="text-neutral-400">→</span>
                <span className={`shrink-0 px-2.5 py-1.5 text-[11px] font-medium tracking-wide sm:px-3 sm:text-xs ${step === "result" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-neutral-600 dark:bg-black dark:text-neutral-400 border"}`}>03 — Blueprint</span>
              </div>
            </Reveal>
          </div>
        </section>
      </SonarGrid>

      <main className="mx-auto w-full max-w-[1280px] min-w-0 px-4 pb-16 sm:px-6 sm:pb-20 md:pb-28">
        <div className="mx-auto max-w-[860px] min-w-0">
          {error && (
            <Reveal y={12}>
              <div className="mb-4 overflow-hidden border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 sm:mb-6 sm:px-5 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                <div className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 shrink-0 bg-red-600 dark:bg-red-400" /> Gagal</div>
                <div className="mt-2 break-words font-mono text-xs leading-relaxed">{error}</div>
                {error.includes("OPENAI_API_KEY") && (
                  <div className="mt-3 bg-white p-4 font-mono text-xs leading-relaxed dark:bg-black">
                    Buat file <b>.env.local</b> di root project:
                    <pre className="mt-2 overflow-auto whitespace-pre-wrap break-words bg-black p-3 text-white dark:bg-white dark:text-black">OPENAI_API_KEY=sk-...{`\n`}OPENAI_MODEL=gpt-4o-mini</pre>
                    Lalu restart: <span className="font-semibold">npm run dev</span>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {step === "input" && (
            <Reveal y={16} delay={0.08}>
              <div className="bg-white p-4 sm:p-6 dark:bg-black md:p-8">
                <p className="font-mono text-xs tracking-widest text-neutral-500">01 — INPUT</p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight sm:mt-3 sm:text-xl">Detail ide</h2>
                <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6">
                  <label className="grid min-w-0 gap-2">
                    <span className="text-sm font-medium">Nama project <span className="font-mono text-xs font-normal text-neutral-500">— opsional</span></span>
                    <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Futsal Booking" className="h-11 min-w-0 border bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus-visible:border-black dark:bg-black dark:focus-visible:border-white" />
                  </label>
                  <label className="grid min-w-0 gap-2">
                    <span className="text-sm font-medium">Ide mentah *</span>
                    <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={6} placeholder="Saya ingin membuat aplikasi booking lapangan futsal. User bisa cari lapangan berdasarkan lokasi, lihat jadwal kosong, booking, dan bayar. Pemilik punya dashboard untuk atur jadwal." className="min-h-[140px] min-w-0 border bg-white p-3 text-sm leading-relaxed outline-none placeholder:text-neutral-400 focus-visible:border-black dark:bg-black dark:focus-visible:border-white" />
                    <span className="font-mono text-xs text-neutral-500">{idea.length} karakter • minimal 10</span>
                  </label>
                  <label className="grid min-w-0 gap-2">
                    <span className="text-sm font-medium">Tech preference <span className="font-mono text-xs font-normal text-neutral-500">— opsional</span></span>
                    <input value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Next.js + FastAPI + Postgres" className="h-11 min-w-0 border bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus-visible:border-black dark:bg-black dark:focus-visible:border-white" />
                    <span className="font-mono text-xs text-neutral-500">Kosongkan jika ingin AI merekomendasikan</span>
                  </label>
                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button onClick={handleClarify} disabled={!canClarify} size="lg" className="w-full sm:w-auto">
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</> : <><Sparkles className="h-4 w-4" /> Generate Plan</>}
                    </Button>
                    <span className="text-center font-mono text-xs text-neutral-500 sm:text-left">→ AI akan tanya 5–10 hal dulu (~3–5s)</span>
                  </div>
                </div>
                <div className="mt-6 overflow-hidden bg-neutral-100 p-3 dark:bg-neutral-900">
                  <div className="flex flex-col gap-2 font-mono text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"><span className="break-words">Pipeline: IDE → CLARIFY → PRD → SPEC → TASK</span><Badge className="hidden shrink-0 md:inline-flex">Sharp • Editorial</Badge></div>
                </div>
              </div>
            </Reveal>
          )}

          {step === "questions" && (
            <div className="space-y-3 sm:space-y-4">
              <Reveal y={14}>
                <div className="bg-white p-4 sm:p-6 dark:bg-black md:p-8">
                  <p className="font-mono text-xs tracking-widest text-neutral-500">02 — CLARIFY</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight sm:mt-3 sm:text-xl">Jawab seperlunya</h2>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">Kosongkan yang belum yakin — AI akan tandai sebagai assumption.</p>
                </div>
              </Reveal>
              <div className="grid gap-3">
                {questions.map((q, idx) => (
                  <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ delay: idx * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="bg-neutral-100 p-4 sm:p-5 dark:bg-neutral-900 md:p-6">
                    <div className="flex min-w-0 gap-2.5 sm:gap-3">
                      <span className="shrink-0 font-mono text-xs font-semibold tracking-widest text-neutral-500">0{idx + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="break-words text-sm font-medium leading-relaxed">{q.question}</div>
                        <div className="mt-3 grid gap-2">
                          {q.type === "text" && (
                            <input onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Tulis jawaban..." className="h-11 min-w-0 border bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus-visible:border-black dark:bg-black dark:focus-visible:border-white" />
                          )}
                          {q.type === "single_choice" && (q.options || []).map((opt) => (
                            <label key={opt} className={`flex cursor-pointer items-center gap-2.5 border px-3 py-2.5 text-sm transition-colors ${answers[q.id] === opt ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-black hover:border-black/20 dark:hover:border-white/20"}`}>
                              <input type="radio" name={q.id} checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt, "single_choice")} className="shrink-0 accent-black dark:accent-white" />
                              <span className="min-w-0 break-words">{opt}</span>
                            </label>
                          ))}
                          {q.type === "multiple_choice" && (q.options || []).map((opt) => (
                            <label key={opt} className={`flex cursor-pointer items-center gap-2.5 border px-3 py-2.5 text-sm transition-colors ${((answers[q.id] as string[]) || []).includes(opt) ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-black hover:border-black/20 dark:hover:border-white/20"}`}>
                              <input type="checkbox" checked={((answers[q.id] as string[]) || []).includes(opt)} onChange={() => setAnswer(q.id, opt, "multiple_choice")} className="shrink-0 accent-black dark:accent-white" />
                              <span className="min-w-0 break-words">{opt}</span>
                            </label>
                          ))}
                          {q.type === "boolean" && (
                            <div className="flex gap-2">
                              {["Ya", "Tidak"].map((opt) => (
                                <button key={opt} onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt }))} className={`flex-1 border py-2.5 text-sm font-medium transition-colors sm:flex-none sm:px-8 ${answers[q.id] === opt ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-black hover:border-black/20 dark:hover:border-white/20"}`}>{opt}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Reveal y={12}>
                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:gap-3">
                  <Button onClick={handleGenerate} disabled={loading} size="lg" className="w-full sm:w-auto">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Streaming...</> : <>Lanjut Generate Blueprint</>}
                  </Button>
                  <Button variant="outline" onClick={() => handleGenerateWith({})} disabled={loading} className="w-full sm:w-auto">Lewati & Generate</Button>
                  <Button variant="ghost" onClick={() => setStep("input")} disabled={loading} className="w-full sm:w-auto"><ArrowLeft className="h-4 w-4" /> Kembali</Button>
                </div>
              </Reveal>
            </div>
          )}

          {step === "result" && (
            <div className="min-w-0 space-y-3 sm:space-y-4">
              <Reveal y={12}>
                <div className="flex flex-col gap-3 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between dark:bg-black md:p-5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2 w-2 shrink-0 ${loading ? "animate-pulse bg-amber-500" : "bg-black dark:bg-white"}`} />
                    <h2 className="truncate text-sm font-semibold tracking-tight">{loading ? "Streaming blueprint…" : "Blueprint siap"}</h2>
                    <span className="hidden shrink-0 font-mono text-xs text-neutral-500 sm:inline">{loading ? `— ${markdown.length} chars` : "— siap tempel ke agent"}</span>
                  </div>
                  <div className="flex gap-2">
                    {loading ? (
                      <Button variant="outline" size="sm" onClick={() => abortRef.current?.abort()} className="flex-1 sm:flex-none"><Square className="h-4 w-4" /> Stop</Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={copy} className="flex-1 sm:flex-none"><Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}</Button>
                        <Button size="sm" onClick={download} className="flex-1 sm:flex-none"><Download className="h-4 w-4" /> Export .md</Button>
                      </>
                    )}
                  </div>
                </div>
              </Reveal>
              <Reveal y={14} delay={0.06}>
                <div className="overflow-hidden bg-white dark:bg-black">
                  <div className="flex items-center justify-between gap-2 bg-black px-3 py-2.5 text-white sm:px-4 dark:bg-white dark:text-black">
                    <span className="truncate font-mono text-xs">blueprint.md {loading && "• streaming"}</span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs">{loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menulis…</> : <><Check className="h-3.5 w-3.5" /> Validated</>}</span>
                  </div>
                  <div className="max-h-[62vh] min-w-0 overflow-auto bg-white p-4 text-sm leading-[1.7] sm:max-h-[64vh] sm:p-6 sm:leading-[1.75] md:p-8 md:text-[15px] dark:bg-black">
                    {markdown ? (
                      <article className="min-w-0 max-w-none break-words [&_h1]:mt-8 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:first:mt-0 sm:[&_h1]:text-2xl [&_h2]:mt-6 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-5 [&_h3]:text-base [&_h3]:font-semibold [&_p]:mt-3 [&_p]:break-words [&_p]:text-neutral-700 [&_p]:dark:text-neutral-300 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_li]:break-words [&_li]:leading-relaxed [&_table]:mt-4 [&_table]:block [&_table]:w-full [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:text-sm [&_th]:border [&_th]:bg-neutral-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:dark:bg-neutral-900 [&_td]:break-words [&_td]:border [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_code]:break-words [&_code]:bg-neutral-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:dark:bg-neutral-900 [&_pre]:mt-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:bg-neutral-100 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-relaxed [&_pre]:dark:bg-neutral-900 [&_pre_code]:whitespace-pre [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_hr]:my-6 [&_blockquote]:mt-4 [&_blockquote]:break-words [&_blockquote]:border-l-2 [&_blockquote]:border-black [&_blockquote]:pl-4 [&_blockquote]:italic [&_strong]:font-semibold [&_a]:break-words [&_a]:underline [&_a]:underline-offset-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                        {loading && <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-black align-middle dark:bg-white" />}
                      </article>
                    ) : (
                      loading && <span className="inline-block h-4 w-2 animate-pulse bg-black dark:bg-white" />
                    )}
                  </div>
                </div>
              </Reveal>
              <Reveal y={10}>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {!loading && <Button variant="outline" onClick={() => setStep("input")} className="w-full sm:w-auto">Buat plan baru</Button>}
                  {!loading && <Button variant="ghost" asChild className="w-full sm:w-auto"><Link href="/">Ke landing</Link></Button>}
                  {loading && <span className="font-mono text-xs leading-relaxed text-neutral-500">Tip: hasil muncul realtime — tidak perlu tunggu selesai untuk mulai baca.</span>}
                </div>
              </Reveal>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
