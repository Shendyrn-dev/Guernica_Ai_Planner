import { PlanRequestSchema } from "@/lib/ai/schemas";
import { streamMarkdown } from "@/lib/ai/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sseHeaders() {
  return {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  } as Record<string, string>;
}

function sse(data: string, event?: string): string {
  const e = event ? `event: ${event}\n` : "";
  return e + `data: ${data}\n\n`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = PlanRequestSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(sse(JSON.stringify({ error: "Ide minimal 10 karakter.", details: parsed.error.flatten() }), "error"), { status: 400, headers: sseHeaders() });
    }
    const { idea, projectName, tech, answers } = parsed.data;
    const qa = (answers || []).map((a) => `- ${a.id}: ${Array.isArray(a.answer) ? a.answer.join(", ") : a.answer}`).join("\n") || "(tanpa klarifikasi tambahan)";
    const system = `You are AI Product Planner — PRD + Feature Spec + Technical Planner + Task Generator + Consistency Checker.
Goal: turn raw idea + clarifications into blueprint ready to paste into Cursor/Claude Code/Codex.
Rules: prioritize MVP, mark assumptions, do not change user tech stack without reason, do not invent popular features without need, tasks must be small + ordered + have acceptance criteria, dependencies valid, output must be consistent.
Language: match user's idea language (if Indonesian then Indonesian).
Output Markdown ONLY, no JSON, with this exact structure:

# PRD — {project name}
## 1. Product Overview
## 2. Problem Statement
## 3. Goals
## 4. Non-Goals
## 5. Target Users
## 6. User Roles
## 7. User Stories
## 8. Core Features
## 9. Functional Requirements
## 10. Business Rules
## 11. User Flow
## 12. Edge Cases
## 13. Acceptance Criteria (Given/When/Then where fits)
## 14. Non-Functional Requirements
## 15. Assumptions
## 16. Open Questions

# Feature Specifications
For each core feature, include Objective, User Story, User Flow, Functional Requirements, Business Rules, Validation, Error States, Edge Cases, Acceptance Criteria, Dependencies.

# Technical Specification
Recommended architecture, Frontend, Backend, Database, Auth, API strategy, External services, Storage, Security, Env vars, Error handling, Logging, Testing strategy. Explicitly state User-selected tech vs AI recommendation.

# Database Design
Entities, fields, types, PK/FK, indexes, relationships, constraints. ASCII tree + optional Mermaid ERD.

# API Specification
Method Path Purpose Auth Request Response Validation Error responses.

# Coding Tasks
TASK-001 ... with Goal, Dependencies, Files/Areas, Implementation steps, Acceptance Criteria. Keep tasks small, ordered. Add dependency graph in ASCII/Mermaid.

# AI Agent Prompts
One copy-paste prompt per task: goal, requirements, acceptance criteria, do not modify unrelated features, run tests when done.

Keep it dense but readable. No hallucinating numbers. Be concise — total target ~4500-5500 tokens max. Avoid repetition.`;

    const user = `Project: ${projectName || "(tanpa nama)"}
Preferred tech: ${tech || "(bebas — rekomendasikan)"}
Raw idea:
${idea}

Clarifications:
${qa}

Generate complete blueprint now.`;

    let stream: AsyncGenerator<string>;
    try {
      stream = streamMarkdown({ system, user });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generate gagal";
      return new Response(sse(JSON.stringify({ error: msg }), "error"), { status: 500, headers: sseHeaders() });
    }

    const readable = new ReadableStream<string>({
      async start(controller) {
        let ok = true;
        const timeout = setTimeout(() => {
          if (ok) {
            try { controller.enqueue(sse(JSON.stringify({ error: "TIMEOUT" }), "error")); } catch {}
            try { controller.close(); } catch {}
            ok = false;
          }
        }, 58_000);
        try {
          for await (const chunk of stream) {
            if (!ok) break;
            controller.enqueue(sse(JSON.stringify({ token: chunk }), "token"));
          }
          if (ok) controller.enqueue(sse(JSON.stringify({ done: true }), "done"));
        } catch (e) {
          if (ok) {
            const msg = e instanceof Error ? e.message : "Stream gagal";
            controller.enqueue(sse(JSON.stringify({ error: msg }), "error"));
          }
        } finally {
          clearTimeout(timeout);
          try { controller.close(); } catch {}
        }
      },
    });

    return new Response(readable as unknown as BodyInit, { headers: sseHeaders() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generate gagal";
    return new Response(sse(JSON.stringify({ error: msg }), "error"), { status: 500, headers: sseHeaders() });
  }
}
