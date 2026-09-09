"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Download, Loader2, Sparkles, Check, Square } from "lucide-react";
import { motion } from "motion/react";
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
    <div className="flex flex-col">
      <Nav />

      <SonarGrid className="bg-transparent" spacing={28} baseOpacity={0.13} pingEvery={3.4} interactive pingArea={[0.18, 0.12, 0.82, 0.88]}>
        <section className="mx-auto max-w-[1280px] px-6 pb-10 pt-24 md:pb-14 md:pt-36">
          <div className="mx-auto max-w-[860px]">
            <Reveal y={14}>
              <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-neutral-500 hover:text-foreground transition-colors">
                <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke beranda
              </Link>
            </Reveal>
            <Reveal delay={0.06} y={16}>
              <div className="mt-6 inline-flex items-center gap-2 bg-black px-3 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">
                <span className="h-1.5 w-1.5 animate-pulse bg-white dark:bg-black" /> IDE → CLARIFY → PRD → SPEC → TASK
              </div>
            </Reveal>
            <motion.h1
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="mt-8 text-4xl font-semibold leading-[0.9] tracking-[-0.04em] md:text-5xl"
            >
              {step === "input" && "Apa yang ingin kamu bangun?"}
              {step === "questions" && "Klarifikasi cepat"}
              {step === "result" && (loading ? "Menulis blueprint…" : "Blueprint siap")}
            </motion.h1>
            <Reveal delay={0.18} y={14}>
              <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.7] text-neutral-600 dark:text-neutral-400">
                {step === "input" && "Tulis ide mentah — 5 baris cukup. AI akan analisis dan bertanya sebelum bikin PRD & tasks."}
                {step === "questions" && "Jawab seperlunya — kosongkan yang belum yakin. Ini yang bikin PRD tidak ngarang."}
                {step === "result" && (loading ? "Streaming langsung — hasil muncul kata per kata, tidak perlu tunggu 60s." : "Copy, export .md, dan tempel langsung ke Cursor / Claude Code / Codex.")}
              </p>
            </Reveal>

            <Reveal delay={0.24} y={12}>
              <div className="mt-8 flex items-center gap-2 font-mono text-xs">
                <span className={`px-3 py-1.5 text-xs font-medium tracking-wide ${step === "input" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-neutral-600 dark:bg-black dark:text-neutral-400 border"}`}>01 — Ide</span>
                <span className="text-neutral-400">→</span>
                <span className={`px-3 py-1.5 text-xs font-medium tracking-wide ${step === "questions" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-neutral-600 dark:bg-black dark:text-neutral-400 border"}`}>02 — Clarify</span>
                <span className="text-neutral-400">→</span>
                <span className={`px-3 py-1.5 text-xs font-medium tracking-wide ${step === "result" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white text-neutral-600 dark:bg-black dark:text-neutral-400 border"}`}>03 — Blueprint</span>
              </div>
            </Reveal>
          </div>
        </section>
      </SonarGrid>

      <main className="mx-auto w-full max-w-[1280px] px-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-[860px]">
          {error && (
            <Reveal y={12}>
              <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                <div className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 bg-red-600 dark:bg-red-400" /> Gagal</div>
                <div className="mt-2 font-mono text-xs leading-relaxed">{error}</div>
                {error.includes("OPENAI_API_KEY") && (
                  <div className="mt-3 bg-white p-4 font-mono text-xs leading-relaxed dark:bg-black">
                    Buat file <b>.env.local</b> di root project:
                    <pre className="mt-2 overflow-auto bg-black p-3 text-white dark:bg-white dark:text-black">OPENAI_API_KEY=sk-...{`\n`}OPENAI_MODEL=gpt-4o-mini</pre>
                    Lalu restart: <span className="font-semibold">npm run dev</span>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {step === "input" && (
            <Reveal y={16} delay={0.08}>
              <div className="bg-white p-6 dark:bg-black md:p-8">
                <p className="font-mono text-xs tracking-widest text-neutral-500">01 — INPUT</p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">Detail ide</h2>
                <div className="mt-6 grid gap-6">
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Nama project <span className="font-mono text-xs font-normal text-neutral-500">— opsional</span></span>
                    <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Futsal Booking" className="h-11 border bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus-visible:border-black dark:bg-black dark:focus-visible:border-white" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Ide mentah *</span>
                    <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={6} placeholder="Saya ingin membuat aplikasi booking lapangan futsal. User bisa cari lapangan berdasarkan lokasi, lihat jadwal kosong, booking, dan bayar. Pemilik punya dashboard untuk atur jadwal." className="border bg-white p-3 text-sm leading-relaxed outline-none placeholder:text-neutral-400 focus-visible:border-black dark:bg-black dark:focus-visible:border-white" />
                    <span className="font-mono text-xs text-neutral-500">{idea.length} karakter • minimal 10</span>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium">Tech preference <span className="font-mono text-xs font-normal text-neutral-500">— opsional</span></span>
                    <input value={tech} onChange={(e) => setTech(e.target.value)} placeholder="Next.js + FastAPI + Postgres" className="h-11 border bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus-visible:border-black dark:bg-black dark:focus-visible:border-white" />
                    <span className="font-mono text-xs text-neutral-500">Kosongkan jika ingin AI merekomendasikan</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button onClick={handleClarify} disabled={!canClarify} size="lg">
                      {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Memproses...</> : <><Sparkles className="h-4 w-4" /> Generate Plan</>}
                    </Button>
                    <span className="font-mono text-xs text-neutral-500">→ AI akan tanya 5–10 hal dulu (~3–5s)</span>
                  </div>
                </div>
                <div className="mt-6 bg-neutral-100 p-3 dark:bg-neutral-900">
                  <div className="flex items-center justify-between font-mono text-xs text-neutral-500"><span>Pipeline: IDE → CLARIFY → PRD → SPEC → TASK</span><Badge className="hidden md:inline-flex">Sharp • Editorial</Badge></div>
                </div>
              </div>
            </Reveal>
          )}

          {step === "questions" && (
            <div className="space-y-4">
              <Reveal y={14}>
                <div className="bg-white p-6 dark:bg-black md:p-8">
                  <p className="font-mono text-xs tracking-widest text-neutral-500">02 — CLARIFY</p>
                  <h2 className="mt-3 text-xl font-semibold tracking-tight">Jawab seperlunya</h2>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">Kosongkan yang belum yakin — AI akan tandai sebagai assumption.</p>
                </div>
              </Reveal>
              <div className="grid gap-3">
                {questions.map((q, idx) => (
                  <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ delay: idx * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="bg-neutral-100 p-5 dark:bg-neutral-900 md:p-6">
                    <div className="flex gap-3">
                      <span className="font-mono text-xs font-semibold tracking-widest text-neutral-500">0{idx + 1}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium leading-relaxed">{q.question}</div>
                        <div className="mt-3 grid gap-2">
                          {q.type === "text" && (
                            <input onChange={(e) => setAnswers((p) => ({ ...p, [q.id]: e.target.value }))} placeholder="Tulis jawaban..." className="h-11 border bg-white px-3 text-sm outline-none placeholder:text-neutral-400 focus-visible:border-black dark:bg-black dark:focus-visible:border-white" />
                          )}
                          {q.type === "single_choice" && (q.options || []).map((opt) => (
                            <label key={opt} className={`flex cursor-pointer items-center gap-2.5 border px-3 py-2.5 text-sm transition-colors ${answers[q.id] === opt ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-black hover:border-black/20 dark:hover:border-white/20"}`}>
                              <input type="radio" name={q.id} checked={answers[q.id] === opt} onChange={() => setAnswer(q.id, opt, "single_choice")} className="accent-black dark:accent-white" />
                              {opt}
                            </label>
                          ))}
                          {q.type === "multiple_choice" && (q.options || []).map((opt) => (
                            <label key={opt} className={`flex cursor-pointer items-center gap-2.5 border px-3 py-2.5 text-sm transition-colors ${((answers[q.id] as string[]) || []).includes(opt) ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-black hover:border-black/20 dark:hover:border-white/20"}`}>
                              <input type="checkbox" checked={((answers[q.id] as string[]) || []).includes(opt)} onChange={() => setAnswer(q.id, opt, "multiple_choice")} className="accent-black dark:accent-white" />
                              {opt}
                            </label>
                          ))}
                          {q.type === "boolean" && (
                            <div className="flex gap-2">
                              {["Ya", "Tidak"].map((opt) => (
                                <button key={opt} onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt }))} className={`border px-5 py-2.5 text-sm font-medium transition-colors ${answers[q.id] === opt ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-black hover:border-black/20 dark:hover:border-white/20"}`}>{opt}</button>
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
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button onClick={handleGenerate} disabled={loading} size="lg">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Streaming...</> : <>Lanjut Generate Blueprint</>}
                  </Button>
                  <Button variant="outline" onClick={() => handleGenerateWith({})} disabled={loading}>Lewati & Generate</Button>
                  <Button variant="ghost" onClick={() => setStep("input")} disabled={loading}><ArrowLeft className="h-4 w-4" /> Kembali</Button>
                </div>
              </Reveal>
            </div>
          )}

          {step === "result" && (
            <div className="space-y-4">
              <Reveal y={12}>
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 dark:bg-black md:p-5">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 ${loading ? "animate-pulse bg-amber-500" : "bg-black dark:bg-white"}`} />
                    <h2 className="text-sm font-semibold tracking-tight">{loading ? "Streaming blueprint…" : "Blueprint siap"}</h2>
                    <span className="hidden font-mono text-xs text-neutral-500 md:inline">{loading ? `— ${markdown.length} chars` : "— siap tempel ke agent"}</span>
                  </div>
                  <div className="flex gap-2">
                    {loading ? (
                      <Button variant="outline" size="sm" onClick={() => abortRef.current?.abort()}><Square className="h-4 w-4" /> Stop</Button>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={copy}><Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}</Button>
                        <Button size="sm" onClick={download}><Download className="h-4 w-4" /> Export .md</Button>
                      </>
                    )}
                  </div>
                </div>
              </Reveal>
              <Reveal y={14} delay={0.06}>
                <div className="overflow-hidden bg-white dark:bg-black">
                  <div className="flex items-center justify-between bg-black px-4 py-2.5 text-white dark:bg-white dark:text-black">
                    <span className="font-mono text-xs">blueprint.md {loading && "• streaming"}</span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs">{loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Menulis…</> : <><Check className="h-3.5 w-3.5" /> Validated</>}</span>
                  </div>
                  <pre className="max-h-[64vh] overflow-auto bg-neutral-100 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap md:p-6 md:text-[13px] dark:bg-neutral-900">{markdown || (loading ? "▌" : "")}{loading && "▌"}</pre>
                </div>
              </Reveal>
              <Reveal y={10}>
                <div className="flex flex-wrap gap-2">
                  {!loading && <Button variant="outline" onClick={() => setStep("input")}>Buat plan baru</Button>}
                  {!loading && <Button variant="ghost" asChild><Link href="/">Ke landing</Link></Button>}
                  {loading && <span className="font-mono text-xs text-neutral-500">Tip: hasil muncul realtime — tidak perlu tunggu selesai untuk mulai baca.</span>}
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
