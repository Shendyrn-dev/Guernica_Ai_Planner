# PRD --- AI Product Planner

## Ide → PRD → Feature Spec → Coding Tasks

**Status:** Draft v1.0\
**Target:** MVP\
**Document language:** Bahasa Indonesia\
**Primary goal:** Membantu user mengubah ide aplikasi/website yang masih
mentah menjadi dokumen perencanaan teknis yang siap dipakai AI coding
agent.

------------------------------------------------------------------------

## 1. Ringkasan Produk

### 1.1 Nama sementara

**AI Product Planner**

Nama dapat diganti sebelum development/launch.

### 1.2 Problem

Banyak developer, mahasiswa, indie hacker, dan founder sudah memiliki
ide produk, tetapi kesulitan mengubah ide tersebut menjadi spesifikasi
yang cukup jelas untuk coding agent.

Prompt seperti:

> "Buatkan aplikasi kasir untuk UMKM"

terlalu ambigu. Coding agent harus menebak: - siapa user aplikasi; -
fitur utama; - role dan permission; - alur user; - struktur database; -
API; - business rules; - edge cases; - acceptance criteria; - urutan
implementasi.

Akibatnya hasil coding dapat tidak konsisten dan membutuhkan banyak
prompting ulang.

### 1.3 Solution

Produk ini menerima **ide mentah** dari user, kemudian menggunakan AI
untuk:

1.  memahami ide;
2.  menemukan informasi yang masih ambigu;
3.  mengajukan pertanyaan klarifikasi;
4.  mengubah jawaban menjadi requirement;
5.  menghasilkan PRD;
6.  menghasilkan feature specification;
7.  menghasilkan technical implementation plan;
8.  memecah pekerjaan menjadi coding tasks yang terurut;
9.  menghasilkan prompt/task yang dapat langsung diberikan ke AI coding
    agent.

Produk **tidak membuat source code aplikasi user**. Fokus produk adalah
**planning dan specification** sebelum coding.

------------------------------------------------------------------------

# 2. Tujuan Produk

## 2.1 Primary Goals

-   Mengubah ide mentah menjadi PRD terstruktur.
-   Mengurangi ambiguitas sebelum coding.
-   Membantu user menentukan scope MVP.
-   Menghasilkan feature specification yang actionable.
-   Menghasilkan task coding yang dapat dieksekusi secara bertahap.
-   Menghasilkan output Markdown yang mudah dipakai di Cursor, Claude
    Code, Codex, Gemini, Windsurf, atau coding agent lain.
-   Membuat proses planning terasa seperti berdiskusi dengan AI Product
    Manager/Software Architect.

## 2.2 Secondary Goals

-   Menyimpan project dan hasil planning.
-   Memungkinkan user merevisi PRD menggunakan AI.
-   Menyediakan version history.
-   Menyediakan export `.md`.
-   Menyediakan copy-to-clipboard untuk setiap bagian.
-   Menampilkan estimasi kompleksitas project.

## 2.3 Non-Goals MVP

MVP tidak mencakup: - AI menulis source code aplikasi. - Deployment
otomatis. - GitHub repository management. - Visual website builder. -
Marketplace prompt. - Community. - Payment/subscription kompleks. -
Multi-agent autonomous coding. - Real-time collaborative editing.

------------------------------------------------------------------------

# 3. Target User

## 3.1 Primary Persona --- Indie Developer

Developer yang memiliki ide SaaS/web app tetapi ingin AI coding agent
mengerjakan implementasinya dengan struktur yang jelas.

## 3.2 Secondary Persona --- Mahasiswa

Mahasiswa informatika yang memiliki ide tugas akhir, project kuliah,
portfolio, atau startup kecil tetapi belum terbiasa membuat requirement
dan technical specification.

## 3.3 Secondary Persona --- Founder / Product Builder

Orang yang memahami masalah bisnis tetapi tidak ingin memulai
development tanpa planning yang jelas.

------------------------------------------------------------------------

# 4. Core User Journey

``` text
Landing Page
     ↓
Create Plan
     ↓
Input Ide
     ↓
AI Analysis
     ↓
Clarification Questions
     ↓
User Answers
     ↓
Generate Plan
     ↓
PRD
     ↓
Feature Specifications
     ↓
Technical Specification
     ↓
Coding Tasks
     ↓
Review / Edit
     ↓
Export Markdown
     ↓
Paste into AI Coding Agent
```

------------------------------------------------------------------------

# 5. Functional Requirements

## FR-001 --- Create New Project

User dapat membuat project planning baru.

### Input

-   Project name
-   Raw idea
-   Optional target users
-   Optional preferred technology
-   Optional constraints

### Acceptance Criteria

-   User dapat membuat project tanpa harus mengisi seluruh field
    optional.
-   Raw idea wajib diisi.
-   Sistem memberikan project ID unik.
-   Setelah submit, user masuk ke AI planning flow.

------------------------------------------------------------------------

# 6. FR-002 --- Raw Idea Input

Halaman awal harus menyediakan text editor besar untuk ide.

### Example

``` text
Saya ingin membuat aplikasi booking lapangan futsal.
User bisa mencari lapangan berdasarkan lokasi,
melihat jadwal kosong, melakukan booking, dan membayar.
Pemilik lapangan memiliki dashboard untuk mengatur jadwal.
```

### Requirements

-   Textarea/editor minimal 5 baris.
-   Character counter.
-   Support Bahasa Indonesia.
-   Support English.
-   Tombol `Generate Plan`.
-   Loading state ketika AI memproses.

------------------------------------------------------------------------

# 7. FR-003 --- AI Idea Analysis

Setelah user submit ide, backend mengirim ide ke AI planning agent.

AI harus mengidentifikasi:

-   Product type
-   Target users
-   User roles
-   Core problem
-   Proposed solution
-   Core features
-   Potential entities
-   Potential integrations
-   Ambiguities
-   Missing requirements
-   Technical uncertainties

AI tidak langsung menghasilkan PRD final apabila informasi penting masih
belum jelas.

------------------------------------------------------------------------

# 8. FR-004 --- Adaptive Clarification Questions

AI menghasilkan pertanyaan klarifikasi berdasarkan hasil analisis.

### Prinsip

Pertanyaan harus: - relevan dengan project; - mempengaruhi
architecture/feature/scope; - singkat; - mudah dijawab; - tidak
menanyakan informasi yang sudah tersedia.

### Contoh

**AI:**

> Siapa yang dapat membuat dan mengelola lapangan?

Options: - Admin platform - Pemilik lapangan - Keduanya

**AI:**

> Bagaimana user melakukan pembayaran?

Options: - Transfer manual - Payment gateway - Belum ditentukan

### Requirements

-   Pertanyaan dapat berupa single choice.
-   Multiple choice.
-   Text input.
-   Number.
-   Yes/No.
-   AI boleh membuat pertanyaan tambahan jika jawaban sebelumnya membuka
    ambiguity baru.
-   Sistem memiliki batas maksimum jumlah pertanyaan agar flow tidak
    terlalu panjang.

### MVP recommendation

Maksimum: - 5--10 pertanyaan utama per planning session. - 2 ronde
clarification maksimum.

------------------------------------------------------------------------

# 9. FR-005 --- Generate PRD

Setelah clarification selesai, AI menghasilkan PRD.

## Struktur PRD

``` markdown
# Product Requirements Document

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

## 13. Acceptance Criteria

## 14. Non-Functional Requirements

## 15. Assumptions

## 16. Open Questions
```

------------------------------------------------------------------------

# 10. FR-006 --- Feature Specification

Setiap core feature harus memiliki specification.

### Format

``` markdown
# Feature: Authentication

## Objective

## User Story

## User Flow

## Functional Requirements

## Business Rules

## Validation

## Error States

## Edge Cases

## Acceptance Criteria

## Dependencies
```

### Acceptance Criteria

Acceptance criteria sebaiknya ditulis menggunakan format Given/When/Then
ketika cocok.

Example:

``` text
Given user memiliki akun valid
When user memasukkan email dan password yang benar
Then user berhasil login dan mendapatkan session.
```

------------------------------------------------------------------------

# 11. FR-007 --- Technical Specification

AI membuat technical planning berdasarkan requirements.

Output minimum:

-   Recommended architecture
-   Frontend
-   Backend
-   Database
-   Authentication
-   API strategy
-   External services
-   File/storage strategy jika diperlukan
-   Security considerations
-   Environment variables
-   Error handling
-   Logging
-   Testing strategy

### Important Rule

AI harus membedakan:

**User-selected technology**

dan

**AI recommendation**

Jika user telah memilih stack, AI tidak boleh mengganti stack tanpa
alasan dan persetujuan user.

------------------------------------------------------------------------

# 12. FR-008 --- Database Design

Jika project membutuhkan database, AI menghasilkan:

-   entities;
-   fields;
-   data types;
-   primary keys;
-   foreign keys;
-   indexes;
-   relationships;
-   constraints.

Output dapat berupa:

``` text
User
 ├── id
 ├── email
 ├── name
 └── created_at

Booking
 ├── id
 ├── user_id → User.id
 ├── venue_id → Venue.id
 ├── start_time
 ├── end_time
 └── status
```

Optional MVP enhancement: - ERD menggunakan Mermaid.

------------------------------------------------------------------------

# 13. FR-009 --- API Specification

Jika project memiliki backend API, AI menghasilkan endpoint plan.

Example:

``` text
POST /api/auth/login
GET /api/venues
GET /api/venues/:id
POST /api/bookings
GET /api/bookings
PATCH /api/bookings/:id
DELETE /api/bookings/:id
```

Setiap endpoint dapat memiliki:

-   Method
-   Path
-   Purpose
-   Authentication
-   Request
-   Response
-   Validation
-   Error responses

------------------------------------------------------------------------

# 14. FR-010 --- Coding Task Generator

AI memecah project menjadi tasks.

### Task structure

``` markdown
## TASK-001 — Setup project

### Goal

Initialize the project.

### Dependencies

None

### Files/Areas

- frontend/
- backend/
- database/

### Implementation

1. Initialize project
2. Configure environment
3. Configure linting
4. Configure testing

### Acceptance Criteria

- Project runs locally.
- Tests can execute.
- Environment configuration works.
```

### Task requirements

Setiap task harus: - memiliki ID unik; - memiliki tujuan; - memiliki
dependencies; - memiliki acceptance criteria; - cukup kecil untuk
dikerjakan coding agent; - memiliki urutan eksekusi.

------------------------------------------------------------------------

# 15. FR-011 --- Task Dependency Graph

Sistem menampilkan dependency antar task.

Example:

``` text
TASK-001 Setup
      ↓
TASK-002 Database
      ↓
TASK-003 Authentication
      ↓
TASK-004 User Profile
      ↓
TASK-005 Core Feature
```

Optional visualization menggunakan Mermaid.

------------------------------------------------------------------------

# 16. FR-012 --- AI Agent Prompt

Setiap task dapat menghasilkan prompt siap tempel.

Example:

``` text
You are implementing TASK-004.

Read the project specification before making changes.

Goal:
Implement user authentication.

Requirements:
...

Acceptance Criteria:
...

Do not modify unrelated features.

When finished:
1. Run tests.
2. Report changed files.
3. Report remaining issues.
```

------------------------------------------------------------------------

# 17. FR-013 --- Review & Edit

User dapat:

-   edit generated document;
-   regenerate section;
-   ask AI to improve section;
-   accept/reject AI suggestion;
-   manually edit content.

MVP dapat menggunakan simple Markdown editor + preview.

------------------------------------------------------------------------

# 18. FR-014 --- Version History

Setiap perubahan besar menghasilkan version.

Example:

``` text
Version 1
Initial PRD

Version 2
Added payment gateway

Version 3
Changed authentication from email/password to Google OAuth
```

User dapat: - melihat version; - membandingkan version; - restore
version.

MVP minimum: - save snapshots; - restore snapshot.

------------------------------------------------------------------------

# 19. FR-015 --- Export

User dapat export:

### MVP

-   `.md`

### Future

-   `.zip`
-   `.pdf`
-   `.docx`
-   JSON
-   AI coding agent specific formats.

Recommended `.zip` structure:

``` text
project-plan/
├── README.md
├── PRD.md
├── FEATURES.md
├── TECHNICAL-SPEC.md
├── DATABASE.md
├── API.md
└── TASKS.md
```

------------------------------------------------------------------------

# 20. FR-016 --- Copy to Clipboard

User dapat copy:

-   seluruh PRD;
-   feature specification;
-   individual task;
-   AI coding prompt.

System harus memberikan visual feedback:

``` text
Copied!
```

------------------------------------------------------------------------

# 21. FR-017 --- Project Dashboard

Dashboard menampilkan:

-   Project name
-   Project status
-   Last updated
-   PRD completion
-   Number of features
-   Number of tasks
-   Current version

Example:

``` text
My SaaS

PRD             ✓
Features        ✓
Technical Spec  ✓
Database        ✓
Tasks           18

Last updated: 5 minutes ago
```

------------------------------------------------------------------------

# 22. FR-018 --- Authentication

MVP dapat mendukung:

-   Google OAuth
-   Email/password

Guest mode dapat dipertimbangkan.

### Recommended MVP

Guest: - boleh mencoba planning; - hasil sementara disimpan di
browser/session; - login diperlukan untuk permanent save/export history
jika ingin mengontrol biaya.

------------------------------------------------------------------------

# 23. FR-019 --- AI Provider Abstraction

Backend tidak boleh mengikat seluruh business logic ke satu provider.

Gunakan abstraction:

``` text
AIProvider
├── OpenAIProvider
├── AnthropicProvider
├── GeminiProvider
└── MockProvider
```

Interface contoh:

``` python
class AIProvider:
    async def generate(self, messages, response_schema):
        ...
```

Tujuannya agar provider dapat diganti tanpa mengubah application layer.

------------------------------------------------------------------------

# 24. AI Agent Architecture

AI workflow direkomendasikan menggunakan beberapa tahap.

``` text
Raw Idea
   ↓
Context Analyzer
   ↓
Requirement Extractor
   ↓
Ambiguity Detector
   ↓
Question Generator
   ↓
User Answers
   ↓
PRD Generator
   ↓
Feature Spec Generator
   ↓
Technical Planner
   ↓
Task Planner
   ↓
Consistency Checker
   ↓
Final Project Plan
```

## 24.1 Context Analyzer

Input: - raw idea - optional preferences

Output structured JSON:

``` json
{
  "product_type": "",
  "problem": "",
  "target_users": [],
  "roles": [],
  "features": [],
  "constraints": [],
  "unknowns": []
}
```

## 24.2 Question Generator

Output harus structured.

``` json
{
  "questions": [
    {
      "id": "q1",
      "question": "",
      "type": "single_choice",
      "options": []
    }
  ]
}
```

## 24.3 PRD Generator

Input: - analyzed context - answers

Output structured document sections.

## 24.4 Consistency Checker

Sebelum hasil ditampilkan, AI melakukan validation:

-   feature disebut tetapi tidak memiliki requirement;
-   entity digunakan tetapi tidak ada database definition;
-   API membutuhkan entity yang belum dibuat;
-   task dependency circular;
-   acceptance criteria tidak sesuai feature;
-   requirement conflict;
-   user role tidak konsisten.

Jika ditemukan masalah, sistem memperbaiki atau memberi warning.

------------------------------------------------------------------------

# 25. AI Output Contract

AI sebaiknya tidak hanya menghasilkan free-form Markdown dari awal.

Pipeline:

``` text
AI
 ↓
Structured JSON
 ↓
Validation
 ↓
Document Renderer
 ↓
Markdown
```

Alasan:

-   lebih mudah divalidasi;
-   lebih mudah versioning;
-   lebih mudah membuat UI;
-   lebih mudah export;
-   lebih mudah mengubah format output;
-   mengurangi output AI yang rusak.

------------------------------------------------------------------------

# 26. Recommended Backend Architecture

Untuk MVP:

``` text
Frontend
   ↓
REST API
   ↓
Application Service
   ↓
AI Planning Service
   ↓
AI Provider
```

Recommended stack:

### Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS
-   shadcn/ui

### Backend

Option A: - FastAPI - Python - Pydantic - SQLAlchemy

Option B: - Next.js API routes

### Recommended for this product

**FastAPI + PostgreSQL**

Alasan: - AI workflow cocok dengan Python; - Pydantic cocok untuk
structured AI output; - mudah membuat service abstraction; - cocok
dengan tujuan pengembangan backend Python.

------------------------------------------------------------------------

# 27. Database

Recommended PostgreSQL.

Core tables:

``` text
users
projects
project_versions
project_questions
project_answers
project_documents
project_features
project_tasks
ai_generations
```

## users

``` text
id
email
name
created_at
updated_at
```

## projects

``` text
id
user_id
name
raw_idea
status
created_at
updated_at
```

## project_versions

``` text
id
project_id
version_number
snapshot
created_at
created_by
```

## project_questions

``` text
id
project_id
question
type
options
order_index
created_at
```

## project_answers

``` text
id
question_id
answer
created_at
```

## project_documents

``` text
id
project_id
document_type
content
version
created_at
updated_at
```

## project_tasks

``` text
id
project_id
task_key
title
description
dependencies
status
order_index
created_at
```

## ai_generations

``` text
id
project_id
provider
model
purpose
input_tokens
output_tokens
latency_ms
status
created_at
```

------------------------------------------------------------------------

# 28. API Specification

## POST /api/projects

Create project.

## POST /api/projects/{id}/analyze

Analyze raw idea.

## POST /api/projects/{id}/questions

Generate clarification questions.

## POST /api/projects/{id}/answers

Save answers.

## POST /api/projects/{id}/generate

Generate complete planning documents.

## GET /api/projects/{id}

Get project.

## GET /api/projects/{id}/documents

Get documents.

## PATCH /api/projects/{id}/documents/{document_id}

Update document.

## POST /api/projects/{id}/regenerate

Regenerate selected section.

## GET /api/projects/{id}/tasks

Get coding tasks.

## GET /api/projects/{id}/export

Export Markdown.

------------------------------------------------------------------------

# 29. UI / UX Requirements

## 29.1 Design Direction

Produk harus terasa seperti:

-   modern developer tool;
-   minimal;
-   fokus pada content;
-   tidak terlalu banyak visual decoration;
-   dark mode friendly;
-   responsive.

## 29.2 Main Pages

``` text
/
├── Landing
├── /create
├── /project/:id
├── /project/:id/questions
├── /project/:id/plan
├── /project/:id/tasks
├── /project/:id/settings
├── /dashboard
├── /login
└── /pricing (future)
```

## 29.3 Create Page

Layout:

``` text
+--------------------------------------+
| What are you building?               |
|                                      |
| [ Tell us your idea...             ] |
| [                                  ] |
| [                                  ] |
|                                      |
| Technology (optional)                |
| [ Next.js / FastAPI / ... ]          |
|                                      |
|              [ Generate Plan ]       |
+--------------------------------------+
```

## 29.4 Planning Page

``` text
┌─────────────────────────────────────────────┐
│ Project: Futsal Booking                     │
├──────────────┬──────────────────────────────┤
│ Progress     │ AI Question                  │
│              │                              │
│ ✓ Idea       │ Siapa yang dapat mengelola   │
│ ✓ Analysis   │ lapangan?                    │
│ ● Questions  │                              │
│ ○ PRD        │ ○ Admin                      │
│ ○ Features   │ ○ Owner                      │
│ ○ Tasks      │ ○ Both                       │
│              │                              │
│              │ [Continue]                   │
└──────────────┴──────────────────────────────┘
```

## 29.5 Plan Page

Main navigation:

``` text
Overview
PRD
Features
Architecture
Database
API
Tasks
Versions
```

------------------------------------------------------------------------

# 30. UX Principles

1.  User selalu tahu sedang berada di tahap apa.
2.  Jangan menampilkan technical jargon tanpa konteks.
3.  AI harus menjelaskan alasan jika membuat asumsi.
4.  User dapat mengubah keputusan penting.
5.  Jangan membuat user menjawab terlalu banyak pertanyaan.
6.  Jangan menghilangkan original idea user.
7.  Semua AI-generated content harus editable.
8.  Jangan membuat user merasa harus memahami software architecture
    untuk menggunakan produk.

------------------------------------------------------------------------

# 31. Error Handling

## AI timeout

Tampilkan:

> AI membutuhkan waktu lebih lama dari biasanya. Coba lagi.

## AI provider error

Fallback provider jika tersedia.

## Invalid AI output

Backend melakukan validation.

Jika invalid: 1. retry dengan correction prompt; 2. jika tetap invalid,
tampilkan error; 3. jangan menyimpan document corrupt.

## Rate limit

Tampilkan informasi bahwa generation sedang dibatasi.

------------------------------------------------------------------------

# 32. Security Requirements

-   API key AI hanya berada di backend.
-   Jangan expose API key ke browser.
-   User hanya dapat mengakses project miliknya.
-   Validate ownership pada setiap project endpoint.
-   Rate limiting untuk AI generation.
-   Sanitize user input.
-   Jangan menjalankan code dari user.
-   Jangan mempercayai output AI sebagai executable instruction.
-   Encrypt sensitive credentials jika ada.
-   Log AI usage tanpa menyimpan data sensitif secara berlebihan.

------------------------------------------------------------------------

# 33. Cost Control

Karena fitur inti menggunakan AI API, cost harus dikontrol sejak MVP.

Strategi:

-   gunakan model murah untuk analysis;
-   gunakan model reasoning/premium hanya untuk final generation jika
    diperlukan;
-   cache hasil analysis;
-   jangan generate ulang seluruh project ketika user hanya meminta satu
    section;
-   batasi jumlah regeneration;
-   simpan token usage;
-   gunakan structured output untuk mengurangi retry.

------------------------------------------------------------------------

# 34. AI Prompt Architecture

Prompt tidak boleh tersebar di source code.

Recommended:

``` text
/prompts
├── analyzer.md
├── question-generator.md
├── prd-generator.md
├── feature-generator.md
├── technical-planner.md
├── task-generator.md
└── consistency-checker.md
```

Setiap prompt memiliki version:

``` text
prd-generator:v1
prd-generator:v2
```

Hal ini penting untuk debugging dan evaluasi.

------------------------------------------------------------------------

# 35. AI System Rules

AI planner harus mengikuti aturan:

1.  Jangan mengarang requirement yang tidak didukung input.
2.  Tandai assumption.
3.  Jangan mengganti teknologi yang dipilih user tanpa alasan.
4.  Jangan menambahkan fitur hanya karena fitur tersebut populer.
5.  Prioritaskan MVP.
6.  Setiap feature harus memiliki tujuan.
7.  Setiap task harus dapat dikerjakan secara konkret.
8.  Hindari task terlalu besar.
9.  Pastikan dependency task valid.
10. Pastikan seluruh dokumen konsisten.
11. Jika informasi kritis belum tersedia, tanyakan user.
12. Jangan membuat security/payment requirement palsu tanpa konteks.

------------------------------------------------------------------------

# 36. MVP Scope

## Must Have

-   Landing page
-   Create project
-   Raw idea input
-   AI analysis
-   Adaptive questions
-   PRD generation
-   Feature specification
-   Technical specification
-   Coding task generation
-   Markdown viewer
-   Copy to clipboard
-   Markdown export
-   Project save
-   Basic authentication
-   PostgreSQL
-   AI provider abstraction
-   Basic usage/rate limiting

## Should Have

-   Version history
-   Regenerate section
-   Task dependency graph
-   Mermaid diagrams
-   AI consistency checker

## Could Have

-   ZIP export
-   PDF export
-   Multiple AI provider selection
-   Public share link
-   Project templates

## Won't Have in MVP

-   AI coding agent execution
-   GitHub integration
-   Deployment
-   Team collaboration
-   Marketplace
-   Community
-   Billing system

------------------------------------------------------------------------

# 37. Task Breakdown

## Phase 1 --- Foundation

### TASK-001

Initialize repository.

### TASK-002

Setup frontend.

### TASK-003

Setup FastAPI backend.

### TASK-004

Setup PostgreSQL.

### TASK-005

Setup environment configuration.

### TASK-006

Setup CI/lint/test.

------------------------------------------------------------------------

## Phase 2 --- Authentication & Projects

### TASK-007

Implement authentication.

### TASK-008

Implement project CRUD.

### TASK-009

Implement project dashboard.

------------------------------------------------------------------------

## Phase 3 --- AI Planning

### TASK-010

Create AI provider abstraction.

### TASK-011

Implement idea analyzer.

### TASK-012

Implement clarification question generator.

### TASK-013

Implement answer storage.

### TASK-014

Implement PRD generator.

### TASK-015

Implement feature specification generator.

### TASK-016

Implement technical specification generator.

### TASK-017

Implement task generator.

### TASK-018

Implement consistency checker.

------------------------------------------------------------------------

## Phase 4 --- Documents

### TASK-019

Implement document viewer.

### TASK-020

Implement Markdown editor.

### TASK-021

Implement section regeneration.

### TASK-022

Implement version history.

### TASK-023

Implement Markdown export.

------------------------------------------------------------------------

## Phase 5 --- Polish

### TASK-024

Implement loading/error states.

### TASK-025

Implement usage/rate limiting.

### TASK-026

Security review.

### TASK-027

AI output evaluation.

### TASK-028

End-to-end testing.

### TASK-029

Production deployment.

------------------------------------------------------------------------

# 38. Task Dependency

``` text
001
├── 002
├── 003
├── 004
└── 005

002 + 003 + 004
        ↓
006
        ↓
007
        ↓
008
        ↓
009
        ↓
010
        ↓
011
        ↓
012
        ↓
013
        ↓
014
        ↓
015
        ↓
016
        ↓
017
        ↓
018
        ↓
019
        ↓
020
        ↓
021
        ↓
022
        ↓
023
        ↓
024
        ↓
025
        ↓
026
        ↓
027
        ↓
028
        ↓
029
```

------------------------------------------------------------------------

# 39. Testing Strategy

## Unit Tests

Test: - project service; - AI schema validation; - task dependency
validation; - document rendering; - authentication; - authorization.

## Integration Tests

Test:

``` text
Create Project
→ Analyze
→ Questions
→ Answers
→ Generate PRD
→ Generate Tasks
→ Export Markdown
```

## AI Evaluation

Buat dataset ide contoh.

Minimal 20 project examples:

-   SaaS;
-   ecommerce;
-   booking;
-   social media;
-   education;
-   finance;
-   portfolio;
-   marketplace;
-   internal dashboard;
-   mobile backend.

Evaluasi:

-   completeness;
-   consistency;
-   hallucination;
-   actionable tasks;
-   requirement coverage;
-   technical correctness.

------------------------------------------------------------------------

# 40. Success Metrics

## Product Metrics

-   Idea → completed plan conversion rate.
-   Percentage of users completing clarification.
-   PRD generation success rate.
-   Average time to first PRD.
-   Regeneration rate.
-   Export rate.
-   Returning users.

## Quality Metrics

Target awal:

-   95% generation requests menghasilkan valid structured output.

-   \<5% failed generation.

-   90% task memiliki acceptance criteria.

-   90% task memiliki dependency yang valid.

-   90% core features tercermin dalam task.

------------------------------------------------------------------------

# 41. Future Roadmap

## V1.1

-   ZIP export.
-   Public share.
-   More export formats.
-   Better diagrams.

## V1.2

-   AI chat with project context.
-   PRD refinement.
-   Project templates.
-   Multiple model selection.

## V2

-   GitHub integration.
-   Cursor/Claude Code/Codex integration.
-   Automatic task execution.
-   Agent progress tracking.
-   Team workspace.

------------------------------------------------------------------------

# 42. Definition of Done --- MVP

MVP dianggap selesai ketika user dapat:

1.  Membuka website.
2.  Memasukkan ide aplikasi.
3.  Mendapatkan pertanyaan klarifikasi dari AI.
4.  Menjawab pertanyaan.
5.  Mendapatkan PRD.
6.  Melihat feature specification.
7.  Melihat technical specification.
8.  Melihat database/API planning jika relevan.
9.  Mendapatkan coding tasks.
10. Menyalin task sebagai prompt coding agent.
11. Mengedit hasil.
12. Export hasil menjadi `.md`.
13. Menyimpan project dan membukanya kembali.

------------------------------------------------------------------------

# 43. Example Final Output

Untuk input:

> "Saya ingin membuat aplikasi booking lapangan futsal."

Output minimum:

``` text
PROJECT
└── Futsal Booking

PRD
├── Problem
├── Goals
├── Users
├── Roles
├── User Stories
├── Features
├── Requirements
├── Business Rules
├── User Flow
└── Acceptance Criteria

FEATURES
├── Authentication
├── Venue Discovery
├── Venue Detail
├── Schedule
├── Booking
├── Payment
└── Owner Dashboard

TECHNICAL
├── Architecture
├── Database
├── API
├── Authentication
└── Security

TASKS
├── TASK-001 Setup
├── TASK-002 Database
├── TASK-003 Authentication
├── TASK-004 Venue
├── TASK-005 Schedule
├── TASK-006 Booking
├── TASK-007 Payment
└── TASK-008 Dashboard
```

------------------------------------------------------------------------

# 44. Recommended MVP Product Positioning

Produk sebaiknya tidak diposisikan sebagai:

> "AI yang membuat aplikasi."

Tetapi:

> **"AI Product Planner yang mengubah ide mentah menjadi blueprint
> coding yang siap dieksekusi AI coding agent."**

Core value:

``` text
IDE
 ↓
CLARIFY
 ↓
PRD
 ↓
SPEC
 ↓
TASK
 ↓
AI CODING AGENT
```

Dengan positioning tersebut, produk memiliki scope yang lebih fokus
daripada AI website builder dan dapat menjadi tool yang digunakan
sebelum Cursor, Claude Code, Codex, Gemini, atau coding agent lainnya.

------------------------------------------------------------------------

# 45. Implementation Priority

Urutan implementasi yang direkomendasikan:

``` text
1. Backend foundation
2. Database
3. AI provider abstraction
4. Idea analyzer
5. Question generator
6. PRD generator
7. Feature generator
8. Technical planner
9. Task generator
10. Frontend planning flow
11. Document viewer
12. Markdown export
13. Authentication
14. Version history
15. Consistency checker
16. Rate limiting
17. Testing
18. Deployment
```

**Catatan:** Untuk validasi product-market fit, jangan membangun seluruh
roadmap sekaligus. Versi pertama harus membuktikan satu hal utama:
**apakah user merasa hasil PRD + task yang dibuat AI benar-benar lebih
berguna daripada langsung memberikan ide ke coding agent.**
