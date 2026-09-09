# Guernica — AI Product Planner

> **Ide mentah jadi blueprint siap coding.** Ubah ide acak jadi PRD, Feature Spec, Technical Spec, Database & API design, dan Coding Tasks yang siap ditempel ke Cursor / Claude Code / Codex.

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live:** `http://localhost:3000` · **Stack:** Next.js 16 (App Router) + Tailwind 4 + shadcn/ui + Motion + OpenRouter / Gemini / OpenAI

---

## ✨ Fitur

- **Landing editorial** — Hero dengan animasi typewriter (`blueprint siap coding` → `PRD dalam menit` → `spec tanpa tebak` → `tasks siap tempel`), Sonar Grid, bento output
- **Flow 3 langkah:** `Ide → Clarify (5–10 pertanyaan adaptif) → Blueprint (streaming)`
- **AI Provider Abstraction** — OpenRouter (default, free) / Gemini / OpenAI, auto-pilih berdasarkan env, ganti tanpa ubah app layer
- **Clarify cepat (~3–5s)** — analisis ide + generate pertanyaan yang benar-benar mempengaruhi arsitektur/scope
- **Blueprint streaming (SSE)** — PRD 16 section + Feature Spec + Technical + Database (ASCII + Mermaid) + API Spec + Tasks + Agent Prompts, muncul kata-per-kata (tidak hang 60s)
- **Performance:** `max_tokens`, timeout 25s/55s, retry x2, clamp input, fallback non-stream
- **Copy & Export .md** — siap tempel ke coding agent
- **Responsive + dark mode + `prefers-reduced-motion`**

## 🧭 User Flow

```
Landing (/) → /create (input ide) → POST /api/clarify → jawab pertanyaan → POST /api/plan/stream (SSE) → Copy / Export .md → paste ke Cursor/Claude/Codex
```

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.3 (App Router, Turbopack) |
| Language | TypeScript 5, React 19 |
| Styling | Tailwind CSS 4, tailwind-merge, tailwindcss-animate |
| UI | shadcn/ui (Radix Tabs/Slot), lucide-react, motion |
| AI | `openai` SDK (OpenRouter + OpenAI), `@google/generative-ai` (Gemini), `zod` validation |
| Font | Geist Sans / Geist Mono |

## 📁 Struktur Project

```
src/
├── app/
│   ├── page.tsx                 # Landing
│   ├── layout.tsx
│   ├── globals.css              # @keyframes blink, shimmer
│   ├── create/page.tsx          # Flow input → clarify → stream blueprint
│   └── api/
│       ├── clarify/route.ts     # POST idea → questions (JSON)
│       ├── plan/route.ts        # POST idea+answers → markdown (non-stream, fallback)
│       └── plan/stream/route.ts # POST idea+answers → SSE streaming
├── components/
│   ├── landing/sections.tsx     # Hero (typewriter + rata kiri), How, OutputBento, Audience, CTA, Footer
│   └── ui/                      # button, badge, tabs, sonar-grid, reveal, navigation-menu, etc.
└── lib/
    ├── utils.ts
    └── ai/
        ├── schemas.ts            # Zod: ClarifyRequest, PlanRequest, Question
        └── provider.ts           # generateJSON / generateMarkdown / streamMarkdown + timeout/retry
```

## 🚀 Getting Started

### Prereqs

- Node.js 18+ (disarankan 20+)
- npm / pnpm / yarn

### Install

```bash
git clone <your-repo-url>
cd webprd
npm install
```

### Environment

Buat `.env.local` di root (jangan commit):

```bash
cp .env.example .env.local
```

Isi salah satu provider (prioritas: OpenRouter → Gemini → OpenAI):

```env
# OpenRouter (recommended, free) — https://openrouter.ai/keys
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=google/gemini-2.0-flash-exp:free
OPENROUTER_SITE_URL=http://localhost:3000
OPENROUTER_TITLE=AI Planner
CLARIFY_TIMEOUT_MS=25000
PLAN_TIMEOUT_MS=55000

# Alternatif: Gemini
# GOOGLE_API_KEY=AIza...
# GEMINI_MODEL=gemini-2.0-flash

# Alternatif: OpenAI
# OPENAI_API_KEY=sk-...
# OPENAI_MODEL=gpt-4o-mini
```

> `.env.example` sudah berisi template lengkap + alternatif model (`anthropic/claude-3.5-haiku`, `deepseek/deepseek-r1:free`).

### Dev

```bash
npm run dev
# → http://localhost:3000
```

### Build & Start

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## 🔌 API

| Method | Route | Input | Output |
|---|---|---|---|
| `POST` | `/api/clarify` | `{ idea, projectName?, tech? }` | `{ questions: Question[], summary? }` |
| `POST` | `/api/plan` | `{ idea, projectName?, tech?, answers? }` | `{ markdown }` |
| `POST` | `/api/plan/stream` | `{ idea, projectName?, tech?, answers? }` | SSE `event: token` / `done` / `error` |

**Question type:** `single_choice` | `multiple_choice` | `text` | `boolean`

## 🧠 Cara Kerja AI

1. **Clarify** (`generateJSON`) — System prompt: Context Analyzer + Question Generator, output JSON `questions` (5–10), `max_tokens: 1500`, timeout 25s
2. **Plan** (`streamMarkdown` via SSE) — System prompt: PRD + Feature + Technical + Task + Consistency Checker, `max_tokens: 6000`, timeout 55s, streaming chunk → frontend append realtime, fallback ke `/api/plan` jika stream gagal di awal
3. **Provider** — `FAST_DEFAULTS` per provider, clamp input 24k chars, retry 2x

File prompt terpusat di `src/lib/ai/provider.ts` (siap dipindah ke `/prompts/*.md` dengan versioning `prd-generator:v1` sesuai PRD §34).

## 🎨 Hero Typewriter

- `src/components/landing/sections.tsx` — `useHeroTypewriter(HERO_ROTATE)` ketik/hapus rotasi 4 frasa, jitter alami, cursor kedip, shimmer di pill hitam
- `src/app/globals.css` — `@keyframes blink` & `shimmer`
- Respect `prefers-reduced-motion` (ganti jadi fade per 3.2s, tanpa ketik)
- Rata kiri: `items-start text-left` untuk heading, deskripsi, tombol, command bar, footnote

## 📦 Deploy

**Vercel (recommended):**

```bash
vercel --prod
# Set env vars di Vercel Dashboard → Settings → Environment Variables
```

**Docker / VPS:** `npm run build` lalu `npm start` (port 3000). Set `OPENROUTER_SITE_URL` ke domain produksi.

## 🗺 Roadmap (dari PRD)

- [x] Landing + /create flow + streaming
- [ ] Auth + Dashboard + Project CRUD (PostgreSQL)
- [ ] Version history & diff
- [ ] ZIP export (`PRD.md`, `FEATURES.md`, `TECHNICAL-SPEC.md`, `DATABASE.md`, `API.md`, `TASKS.md`)
- [ ] Regenerate per-section + consistency checker
- [ ] Rate limiting & usage tracking (`ai_generations`)

Lihat `AI_Product_Planner_PRD.md` untuk PRD lengkap (MVP → V2).

## 🤝 Contributing

PR & issue welcome. Jalankan `npm run lint` & `npm run build` sebelum push.

## 📄 License

MIT — bebas pakai untuk portfolio / komersial.

---

Built with Next.js · Crafted as **blueprint sebelum coding**, bukan AI website builder.
