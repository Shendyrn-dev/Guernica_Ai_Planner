"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Copy, FileText, Database, ShieldCheck, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SonarGrid } from "@/components/ui/sonar-grid";
import { Cta69 } from "@/components/ui/cta69";
import { Reveal } from "@/components/ui/reveal";
import { useState, useEffect } from "react";

export { AnimatedNavFramer as Nav } from "@/components/ui/navigation-menu";

const HERO_ROTATE = ["blueprint siap coding", "PRD dalam menit", "spec tanpa tebak", "tasks siap tempel"] as const;

function useHeroTypewriter(words: readonly string[], typeMs = 72, holdMs = 1600, eraseMs = 34) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState(words[0] ?? "");
  const [phase, setPhase] = useState<"typing" | "hold" | "erasing">("hold");
  const [mounted, setMounted] = useState(false);
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    setMounted(true);
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(m.matches);
    const h = () => setReduce(m.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);
  useEffect(() => {
    if (!mounted || reduce) return;
    const w = words[idx] ?? "";
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (text.length < w.length) t = setTimeout(() => setText(w.slice(0, text.length + 1)), typeMs + (Math.random() * 24 - 12));
      else { t = setTimeout(() => setPhase("hold"), holdMs); }
    } else if (phase === "hold") {
      t = setTimeout(() => setPhase("erasing"), holdMs);
    } else {
      if (text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), eraseMs);
      else { const n = (idx + 1) % words.length; setIdx(n); setPhase("typing"); }
    }
    return () => clearTimeout(t);
  }, [mounted, reduce, text, phase, idx, words, typeMs, holdMs, eraseMs]);
  useEffect(() => {
    if (!mounted || !reduce) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % words.length), 3200);
    return () => clearInterval(id);
  }, [mounted, reduce, words.length]);
  useEffect(() => { if (mounted && reduce) setText(words[idx] ?? ""); }, [mounted, reduce, idx, words]);
  const display = !mounted ? words[0] ?? "" : reduce ? (words[idx] ?? "") : text;
  return { display, reduce, mounted, idx };
}

export function Hero() {
  const { display, reduce, mounted } = useHeroTypewriter(HERO_ROTATE);
  return (
    <SonarGrid className="bg-transparent overflow-hidden" spacing={28} baseOpacity={0.1} pingEvery={3.4} interactive pingArea={[0.18, 0.12, 0.82, 0.88]}>
      <section className="mx-auto max-w-[1280px] px-4 pb-10 pt-20 sm:px-6 sm:pb-16 sm:pt-24 md:pb-32 md:pt-36">
        <div className="flex max-w-[760px] flex-col items-start pt-2 text-left sm:pt-8 md:pt-12">
            <Reveal delay={0} y={16} duration={0.6}>
              <div className="inline-flex max-w-full items-center gap-2 bg-black px-3 py-1.5 text-[11px] font-medium leading-none text-white sm:text-xs dark:bg-white dark:text-black">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse bg-white dark:bg-black" /> v1 — blueprint sebelum coding
              </div>
            </Reveal>
            <motion.h1
               initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
               whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
               viewport={{ once: false, amount: 0.4 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
               className="mt-6 text-left text-[30px] font-semibold leading-[0.95] tracking-[-0.03em] sm:mt-10 sm:text-5xl md:mt-12 md:text-6xl lg:text-[60px]"
            >
              <span className="block">Ide mentah jadi</span>
              <span className="mt-1.5 flex max-w-full flex-wrap items-center gap-1.5 sm:mt-2 sm:gap-2">
                <span className="relative inline-flex max-w-full items-center bg-black px-2.5 py-1.5 text-white sm:px-3 sm:py-1 dark:bg-white dark:text-black">
                  <span className="relative z-10 break-words text-[22px] leading-none sm:text-[32px] md:text-[36px] lg:text-[42px]">{display || "\u00A0"}</span>
                  {mounted && !reduce && <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden"><span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-[shimmer_1.7s_ease-in-out_infinite]" /></span>}
                </span>
                <span aria-hidden className={`inline-block h-[1em] w-[3px] shrink-0 bg-black dark:bg-white ${!mounted || reduce ? "opacity-0" : "animate-[blink_0.9s_steps(1)_infinite]"}`} />
              </span>
            </motion.h1>
            <Reveal delay={0.28} y={18}>
              <p className="mt-5 max-w-[46ch] text-left text-sm leading-[1.7] text-neutral-600 sm:mt-8 sm:text-[15px] dark:text-neutral-400">
                Ubah ide acak jadi PRD, spec, dan tasks terstruktur. Tempel langsung ke Cursor, Claude Code, dan Codex.
              </p>
            </Reveal>
            <Reveal delay={0.36} y={18}>
              <div className="mt-6 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row md:mt-12">
                <Button size="lg" className="w-full sm:w-auto" asChild><Link href="/create">Mulai Gratis <ArrowRight className="h-4 w-4" /></Link></Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => document.getElementById("output")?.scrollIntoView({ behavior: "smooth" })}>Lihat contoh</Button>
              </div>
            </Reveal>
            <Reveal delay={0.44} y={18} className="flex w-full justify-start">
              <div className="mt-6 flex w-full max-w-full items-center gap-2 bg-black p-2 text-left sm:max-w-[560px] dark:bg-white md:mt-12">
               <span className="hidden shrink-0 bg-white px-2 py-1 font-mono text-xs text-black dark:bg-black dark:text-white md:inline-flex">$</span>
               <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-white sm:text-xs dark:text-black">/create → isi ide → jawab klarifikasi → export PRD.md</span>
               <button onClick={() => navigator.clipboard.writeText("/create")} className="shrink-0 bg-white px-2.5 py-1.5 text-xs font-medium text-black sm:px-3 dark:bg-black dark:text-white">Copy</button>
             </div>
           </Reveal>
           <Reveal delay={0.5} y={12} className="flex w-full justify-start">
             <p className="mt-4 text-left font-mono text-[11px] leading-relaxed text-neutral-500 sm:text-xs">Tanpa kartu kredit • Export .md • Version history</p>
           </Reveal>
         </div>
       </section>
     </SonarGrid>
   );
}

export function LogoWall() {
  return (
    <section className="bg-transparent py-8 sm:py-10">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6">
        <p className="text-center font-mono text-[11px] tracking-widest text-neutral-500 sm:text-xs">BEKERJA DENGAN STACK FAVORIT</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 opacity-60 sm:gap-6 md:gap-10">
          <img src="https://cdn.simpleicons.org/vercel/000000" alt="Vercel" className="h-4 sm:h-5 dark:invert" />
          <img src="https://cdn.simpleicons.org/nextdotjs/000000" alt="Next.js" className="h-4 sm:h-5 dark:invert" />
          <img src="https://cdn.simpleicons.org/supabase/000000" alt="Supabase" className="h-4 sm:h-5 dark:invert" />
          <img src="https://cdn.simpleicons.org/postgresql/000000" alt="Postgres" className="h-4 sm:h-5 dark:invert" />
          <img src="https://cdn.simpleicons.org/github/000000" alt="GitHub" className="h-4 sm:h-5 dark:invert" />
          <img src="https://cdn.simpleicons.org/openai/000000" alt="OpenAI" className="h-4 sm:h-5 dark:invert" />
        </div>
      </div>
    </section>
  );
}

export function Agents() {
  const agents = [
    { name: "Cursor", icon: "https://cdn.simpleicons.org/cursor/000000" },
    { name: "Claude Code", icon: "https://cdn.simpleicons.org/anthropic/000000" },
    { name: "Codex", icon: "https://cdn.simpleicons.org/openai/000000" },
    { name: "Windsurf", icon: "https://cdn.simpleicons.org/windsurf/000000" },
    { name: "Gemini", icon: "https://cdn.simpleicons.org/googlegemini/000000" },
    { name: "v0", icon: "https://cdn.simpleicons.org/vercel/000000" },
  ];
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12">
      <div className="bg-neutral-100 p-5 sm:p-6 dark:bg-neutral-900 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">Works with every agent.</h2>
            <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">Satu blueprint. Tempel ke agent apa pun yang paham Markdown — tidak terikat provider.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
            {agents.map((a) => (
              <div key={a.name} className="flex flex-col items-center gap-2 bg-white p-3 sm:p-4 dark:bg-black">
                <img src={a.icon} alt={a.name} className="h-5 w-5 sm:h-6 sm:w-6 dark:invert" />
                <span className="text-center text-[11px] font-medium sm:text-xs">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Problem() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-16">
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs tracking-widest text-neutral-500">01 — THE SLOPE</p>
          <h2 className="mt-3 max-w-[14ch] text-2xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-3xl md:text-4xl">Prompt mentah bikin agent menebak</h2>
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">Tanpa perencanaan, hasil coding tidak konsisten dan butuh prompting ulang berhari-hari. Planner memaksa struktur dulu.</p>
          <div className="mt-6 grid gap-3">
            <div className="bg-white p-4 dark:bg-black">
              <div className="font-mono text-xs text-neutral-500">Tanpa planner</div>
              <div className="mt-2 break-words font-mono text-sm">“Buatkan aplikasi kasir untuk UMKM”</div>
              <div className="mt-1 text-xs text-neutral-500">→ tebak role, fitur, DB, API, rules?</div>
            </div>
            <div className="bg-black p-4 text-white dark:bg-white dark:text-black">
              <div className="font-mono text-xs opacity-60">Dengan planner</div>
              <div className="mt-2 font-mono text-xs">IDE → CLARIFY → PRD → SPEC → TASK</div>
              <div className="mt-2 flex flex-wrap gap-1 font-mono text-xs"><span className="bg-white px-2 py-1 text-black dark:bg-black dark:text-white">PRD.md</span><span className="bg-white/10 px-2 py-1">TASKS.md</span><span className="bg-white/10 px-2 py-1">PROMPT</span></div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden bg-white p-2 dark:bg-neutral-900 lg:col-span-7">
          <img src="https://picsum.photos/seed/taste-escape/1200/900" alt="" className="h-[280px] w-full object-cover grayscale sm:h-[420px] lg:h-[520px]" />
          <div className="bg-neutral-100 p-3 dark:bg-black">
            <div className="flex flex-col gap-1 font-mono text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"><span>Escape the generic</span><span>— blueprint dulu, coding kemudian</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function How() {
  const steps = [
    { n: "01", t: "Ide", d: "Tulis ide mentah, 5 baris cukup" },
    { n: "02", t: "Clarify", d: "Jawab 5–10 pertanyaan adaptif" },
    { n: "03", t: "PRD", d: "16 sections terstruktur" },
    { n: "04", t: "Spec", d: "Fitur, DB, API, arsitektur" },
    { n: "05", t: "Tasks", d: "TASK-001… terurut" },
    { n: "06", t: "Prompt", d: "Siap tempel ke agent" },
  ];
  return (
    <section id="cara-kerja" className="bg-transparent overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-10 sm:px-6 sm:pb-20 sm:pt-20 md:pb-32 md:pt-32">
        <div className="mx-auto flex max-w-[760px] flex-col items-center pt-4 text-center sm:pt-8 md:pt-12">
          <Reveal y={18}><p className="font-mono text-xs tracking-widest text-neutral-500">02 — PIPELINE</p></Reveal>
          <Reveal delay={0.08} y={20}><h2 className="mt-6 text-balance text-3xl font-semibold leading-[0.92] tracking-[-0.03em] sm:mt-10 sm:text-5xl md:text-6xl lg:text-[56px]">Dari ide ke prompt dalam 6 langkah</h2></Reveal>
          <Reveal delay={0.16} y={16}><p className="mx-auto mt-4 max-w-[46ch] text-balance text-sm leading-[1.7] text-neutral-600 sm:mt-8 sm:text-[15px] dark:text-neutral-400">Flow seperti diskusi dengan PM & Architect — bukan form panjang.</p></Reveal>
        </div>
        <Reveal delay={0.22} y={24} className="contents">
          <div className="mt-6 grid grid-cols-1 gap-0 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
          {steps.map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className={`${i % 2 === 0 ? "bg-white dark:bg-black" : "bg-neutral-100 dark:bg-neutral-900"} p-6 sm:p-8`}>
              <span className="font-mono text-2xl font-semibold tracking-tighter sm:text-3xl">{s.n}</span>
              <span className="mt-2 block text-sm font-semibold tracking-tight sm:mt-3">{s.t}</span>
              <span className="mt-1 block text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{s.d}</span>
            </motion.div>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  );
}

export function OutputBento() {
  const [active, setActive] = useState<"prd" | "feature" | "tasks">("prd");
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(active === "prd" ? samplePRD : active === "feature" ? sampleFeature : sampleTask);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <section id="output" className="bg-transparent overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-10 sm:px-6 sm:pb-20 sm:pt-20 md:pb-32 md:pt-32">
        <div className="mx-auto flex max-w-[760px] flex-col items-center pt-4 text-center sm:pt-8 md:pt-12">
          <Reveal y={18}><p className="font-mono text-xs tracking-widest text-neutral-500">03 — OUTPUT</p></Reveal>
          <Reveal delay={0.08} y={20}><h2 className="mt-6 text-balance text-3xl font-semibold leading-[0.92] tracking-[-0.03em] sm:mt-10 sm:text-5xl md:text-6xl lg:text-[56px]">Output yang langsung bisa ditempel</h2></Reveal>
          <Reveal delay={0.16} y={16}><p className="mx-auto mt-4 max-w-[46ch] text-balance text-sm leading-[1.7] text-neutral-600 sm:mt-8 sm:text-[15px] dark:text-neutral-400">PRD, feature spec, technical plan, DB/API, dan tasks — konsisten dan siap pakai.</p></Reveal>
        </div>
        <Reveal delay={0.22} y={24} className="contents">
          <div className="mt-6 grid gap-4 sm:gap-6 lg:grid-cols-12 md:mt-12">
          <div className="min-w-0 bg-white p-4 sm:p-6 dark:bg-black lg:col-span-7">
            <span className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4 shrink-0" /> Live Preview</span>
              <span className="flex gap-1 self-start bg-neutral-100 p-1 dark:bg-neutral-900">
                {(["prd", "feature", "tasks"] as const).map((k) => (
                  <button key={k} onClick={() => setActive(k)} className={`px-3 py-1.5 text-xs font-medium ${active === k ? "bg-black text-white dark:bg-white dark:text-black" : "text-neutral-600 dark:text-neutral-400"}`}>{k === "prd" ? "PRD" : k === "feature" ? "Feature" : "Tasks"}</button>
                ))}
              </span>
            </span>
            <div className="mt-4 overflow-hidden bg-black dark:bg-white">
              <span className="flex items-center justify-between bg-black px-3 py-2 dark:bg-white">
                <span className="truncate font-mono text-xs text-neutral-400">{active === "prd" ? "PRD.md" : active === "feature" ? "FEATURE_Auth.md" : "TASKS.md"}</span>
                <button onClick={copy} className="inline-flex shrink-0 items-center gap-1.5 bg-white px-2.5 py-1 text-xs font-medium text-black dark:bg-black dark:text-white"><Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy"}</button>
              </span>
              <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed text-white sm:max-h-[340px] dark:text-black">{active === "prd" ? samplePRD : active === "feature" ? sampleFeature : sampleTask}</pre>
            </div>
          </div>
          <div className="grid gap-4 sm:gap-6 lg:col-span-5 lg:grid-cols-2">
            <div className="bg-black p-5 text-white sm:p-6 dark:bg-white dark:text-black">
              <span className="flex items-center gap-2 text-sm font-medium"><Database className="h-4 w-4" /> Database</span>
              <span className="mt-3 block whitespace-pre-wrap break-words font-mono text-xs leading-relaxed opacity-80 sm:text-sm">User ──┐{"\n"}Booking ├── user_id → User.id{"\n"}Venue ──┘ venue_id → Venue.id</span>
              <span className="mt-4 inline-flex bg-white px-3 py-1 text-xs font-semibold text-black dark:bg-black dark:text-white">ERD via Mermaid</span>
              <img src="https://picsum.photos/seed/dbgrid2/600/220" alt="" className="mt-4 h-20 w-full object-cover opacity-70 grayscale sm:h-24" />
            </div>
            <div className="bg-white p-5 sm:p-6 dark:bg-black">
              <span className="flex items-center gap-2 text-sm font-medium"><Workflow className="h-4 w-4" /> API Spec</span>
              <span className="mt-3 grid gap-1.5 font-mono text-xs">
                <span className="flex justify-between gap-2"><span className="shrink-0 bg-black px-2 py-0.5 text-white dark:bg-white dark:text-black">POST</span> <span className="truncate">/api/bookings</span></span>
                <span className="flex justify-between gap-2"><span className="shrink-0 bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">GET</span> <span className="truncate">/api/venues</span></span>
                <span className="flex justify-between gap-2"><span className="shrink-0 bg-neutral-100 px-2 py-0.5 dark:bg-neutral-800">PATCH</span> <span className="truncate">/api/bookings/:id</span></span>
              </span>
              <span className="mt-4 block text-xs text-neutral-500">Auth • Validation • Error</span>
            </div>
            <div className="bg-white p-5 sm:p-6 dark:bg-black lg:col-span-2">
              <span className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-medium"><ShieldCheck className="h-4 w-4" /> Technical</span>
                <span className="shrink-0 bg-black px-2.5 py-1 text-xs font-semibold text-white dark:bg-white dark:text-black">Stack respect</span>
              </span>
              <span className="mt-3 grid grid-cols-3 gap-2 text-xs sm:gap-3">
                <span className="bg-neutral-100 px-2 py-3 text-center font-medium sm:px-3 dark:bg-neutral-900">Frontend<br /><span className="font-semibold">Next.js</span></span>
                <span className="bg-neutral-100 px-2 py-3 text-center font-medium sm:px-3 dark:bg-neutral-900">Backend<br /><span className="font-semibold">FastAPI</span></span>
                <span className="bg-neutral-100 px-2 py-3 text-center font-medium sm:px-3 dark:bg-neutral-900">DB<br /><span className="font-semibold">Postgres</span></span>
              </span>
              <span className="mt-3 block text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">AI tidak ganti stack tanpa alasan. Arsitektur, security, testing included.</span>
            </div>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const samplePRD = `# Product Requirements Document
## 1. Product Overview
Futsal Booking — marketplace booking lapangan.

## 2. Problem Statement
User susah cek jadwal kosong & booking real-time.

## 8. Core Features
- Venue Discovery
- Schedule & Booking
- Payment Gateway
- Owner Dashboard

## 13. Acceptance Criteria
Given user memilih jadwal kosong
When user konfirmasi booking
Then booking terbuat & status pending_payment`;

const sampleFeature = `# Feature: Booking

## Objective
Memungkinkan user booking lapangan sesuai jadwal.

## User Flow
Search → Detail → Pilih Slot → Checkout → Bayar

## Acceptance Criteria
Given slot masih kosong
When user submit booking
Then sistem lock slot 10 menit & buat invoice`;

const sampleTask = `## TASK-005 — Booking

### Goal
Implement booking flow dengan validasi slot.

### Files/Areas
- frontend/app/booking
- backend/api/bookings

### Implementation
1. Validasi slot kosong
2. POST /api/bookings
3. Optimistic lock + cron expiry

### Acceptance Criteria
- Booking tidak double-book
- Expired booking balik jadi available`;

export function Audience() {
  return (
    <section id="untuk-siapa" className="mx-auto max-w-[1280px] px-4 pb-10 pt-10 sm:px-6 sm:pb-20 sm:pt-20 md:pb-32 md:pt-32 overflow-hidden">
      <div className="mx-auto flex max-w-[760px] flex-col items-center pt-4 text-center sm:pt-8 md:pt-12">
        <Reveal y={18}><p className="font-mono text-xs tracking-widest text-neutral-500">04 — AUDIENCE</p></Reveal>
        <Reveal delay={0.08} y={20}><h2 className="mt-6 text-balance text-3xl font-semibold leading-[0.92] tracking-[-0.03em] sm:mt-10 sm:text-5xl md:text-6xl lg:text-[56px]">Dibuat untuk siapa yang membangun</h2></Reveal>
        <Reveal delay={0.16} y={16}><p className="mx-auto mt-4 max-w-[46ch] text-balance text-sm leading-[1.7] text-neutral-600 sm:mt-8 sm:text-[15px] dark:text-neutral-400">Tiga persona inti — satu blueprint yang sama rapi untuk semua.</p></Reveal>
      </div>
      <Reveal delay={0.22} y={24} className="contents">
        <div className="mt-6 grid grid-cols-1 gap-0 sm:mt-10 md:mt-12 md:grid-cols-3">
          {[
          { title: "Indie Developer", desc: "Punya ide SaaS, ingin agent eksekusi tanpa tebak-tebakan.", points: ["Scope MVP jelas", "Task terurut", "Prompt per task"] },
          { title: "Mahasiswa", desc: "Tugas akhir & portfolio jadi terstruktur seperti produk nyata.", points: ["PRD lengkap", "ERD & API siap", "Mudah dipresentasikan"] },
          { title: "Founder", desc: "Paham bisnis, butuh planning sebelum dev mulai.", points: ["Kurangi revisi", "Assumption ditandai", "Estimasi kompleksitas"] },
        ].map((c, idx) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.3 }} transition={{ delay: idx * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className={`${idx === 1 ? "bg-black text-white dark:bg-white dark:text-black" : "bg-neutral-100 dark:bg-neutral-900"} p-6 sm:p-8`}>
            <span className="font-mono text-xs opacity-40">0{idx + 1}</span>
            <span className="mt-3 block text-sm font-semibold">{c.title}</span>
            <span className="mt-1 block text-sm leading-relaxed opacity-70">{c.desc}</span>
            <ul className="mt-6 space-y-1.5 text-sm">
              {c.points.map((p) => <li key={p} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0" /> {p}</li>)}
            </ul>
          </motion.div>
        ))}
        </div>
      </Reveal>
    </section>
  );
}

export function CTA() {
  return (
    <Cta69
      className="bg-transparent dark:bg-transparent overflow-hidden"
      badge={{ label: "Blueprint ready" }}
      heading="Ide mentah jadi blueprint siap coding."
      button={{ label: "Mulai Gratis", href: "/create" }}
      labels={{
        marqueePhrase: "Guernica",
        note: "Tempel ide, jawab klarifikasi, export PRD • Spec • Tasks — langsung tempel ke Cursor, Claude Code, dan Codex.",
        footnote: "Tanpa kartu kredit • Export .md • Version history",
      }}
    />
  );
}

export function Footer() {
  return (
    <footer className="overflow-hidden bg-black py-8 dark:bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 sm:gap-6 sm:px-6 md:flex-row md:items-center md:justify-between">
        <span className="flex flex-col gap-2 text-sm text-neutral-400 sm:flex-row sm:items-center dark:text-neutral-600"><span className="flex items-center gap-2 font-semibold tracking-tight text-white dark:text-black"><img src="/guernica.png" alt="Guernica" className="h-5 w-5 object-contain dark:invert" />Guernica</span><span className="text-xs sm:text-sm">© 2026 — Blueprint sebelum coding.</span></span>
        <span className="flex gap-6 text-sm text-neutral-400 dark:text-neutral-600"><a href="#" className="hover:text-white dark:hover:text-black">Docs</a><a href="#" className="hover:text-white dark:hover:text-black">Changelog</a><a href="#" className="hover:text-white dark:hover:text-black">Privacy</a></span>
      </div>
    </footer>
  );
}
