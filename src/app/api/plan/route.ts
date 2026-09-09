import { NextRequest, NextResponse } from "next/server";
import { PlanRequestSchema } from "@/lib/ai/schemas";
import { generateMarkdown } from "@/lib/ai/provider";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PlanRequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Ide minimal 10 karakter.", details: parsed.error.flatten() }, { status: 400 });
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

Keep it dense but readable. No hallucinating numbers.`;

    const user = `Project: ${projectName || "(tanpa nama)"}
Preferred tech: ${tech || "(bebas — rekomendasikan)"}
Raw idea:
${idea}

Clarifications:
${qa}

Generate complete blueprint now.`;

    const markdown = await generateMarkdown({ system, user });
    return NextResponse.json({ markdown });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Generate gagal";
    const status = msg.includes("OPENAI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
