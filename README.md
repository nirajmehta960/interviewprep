# InterviewPrep — Visual DSA Notebook & Software Engineering & Technical Interview Prep Platform

> **InterviewPrep** is a production-grade, GitBook/Notion-style technical study notebook, technical question bank (**586 total interview questions**), interactive visual algorithm trace engine, and SM-2 spaced repetition revision system built for software engineers and technical professionals preparing for technical interviews.

---

## 🚀 What We Are Doing In This Project

Preparing for technical interviews across FAANG, Big Tech, and top tech companies requires more than just memorizing code snippets. Candidates need to:
1. **Master Core Language Internals & CS Fundamentals**: Deeply understand memory models, garbage collection, concurrency primitives, event loops, index structures, operating system kernels, and API design patterns.
2. **Visualize Algorithmic Execution**: See exactly how data structures (arrays, intervals, linked lists, binary trees) mutate line-by-line in Java and Python during algorithmic execution.
3. **Retain Knowledge with Active Recall**: Maintain personal mental models, record common traps, and review high-yield concepts on an SM-2 spaced-repetition schedule.

**InterviewPrep** brings all three capabilities together into a single, cohesive, light-only editorial web application.

---

## ✨ Core Features & Key Capabilities

### 1. 📖 High-Yield Question Bank (586 Total Questions)
- **426 Conceptual & Deep-Dive Technical Questions** across 8 core software engineering domain modules:
  - ☕ **Java**: JVM internals, memory model, GC algorithms (G1, ZGC), `HashMap` bucket mechanics, `ConcurrentHashMap` CAS locks, Virtual Threads.
  - 🐍 **Python**: LEGB scope, Decorators, Generators, Asyncio event loop, Python GIL, Reference Counting & GC cycles, Metaclasses, C Extensions.
  - ⚡ **JavaScript**: Scope & Closures, Event Loop & Microtasks, Promises/Async-Await, Prototypes & Prototypal Chain, V8 engine internals, ES6+ modules.
  - 🍃 **Spring Boot**: IoC Container & Dependency Injection, Spring MVC lifecycle, Data JPA & Hibernate L1/L2 caching, Spring Security (JWT/OAuth2), Microservices, WebFlux.
  - 🌐 **REST APIs**: HTTP Method semantics & status codes, Idempotency, JWT & OAuth2, Rate limiting algorithms, CORS preflight, HTTP Caching (`Cache-Control`, `ETag`), OpenAPI.
  - 🗄️ **DBMS & SQL**: Relational algebra, B-Tree & Hash indexing, ACID guarantees, Transaction isolation levels, Normalization (1NF–5NF), Query optimization (`EXPLAIN`), Sharding.
  - 💻 **Operating Systems**: Process vs Thread, Virtual memory & Paging, Page fault handling, CPU scheduling, Synchronization (Mutex/Semaphore), Deadlocks, Syscalls.
  - 📡 **Computer Networks**: OSI & TCP/IP stack, TCP 3-Way Handshake & Teardown, UDP, DNS Resolution, HTTP/1.1 vs HTTP/2 vs HTTP/3, TLS 1.3 Handshake, Subnetting.
- **150 LeetCode Top Interview Algorithmic Questions**: Full DSA catalog across 23 subtopics with Java and Python reference solutions, worked approach steps, complexity analysis, and common traps.

### 2. ⚡ Interactive Visual Trace Engine
- **Synced Code Execution**: Step line-by-line through Java and Python solutions with synchronized code line highlighting.
- **SVG / Canvas Animation Engines**: Visualizers for Arrays (`ArrayVisualizer`), Linked Lists (`LinkedListVisualizer`), and Intervals (`IntervalVisualizer`).
- **Variable Mutation Table**: Real-time snapshotting of variable values and algorithm execution phases at every step.
- **Client-Side Auto-Trace Engine** (`src/lib/autotrace/`):
  - In-browser AST instrumentation via Acorn parser (`instrument.ts`).
  - Deep-cloned variable snapshots (`run.ts`) executed inside a safe browser sandbox (`new Function`).
  - Runtime structure classifier (`classify.ts`) that automatically converts arbitrary JavaScript code inputs into animated visual step traces.

### 3. 📝 Structured Personal Technical Notebook
Each question includes a dedicated 7-field structured notebook:
- 🧠 **Mental Model**: Core intuition and conceptual mental model.
- 💡 **Key Insight**: Crucial technical takeaway or architecture trade-off.
- ⚠️ **My Mistake / Common Trap**: Mistakes made during practice or common candidate pitfalls.
- 🎯 **Interview Tip**: How to frame and state the response effectively to an interviewer.
- 📌 **Keep Forgetting**: Syntax edge cases or frequently forgotten details.
- 📝 **Freeform Notes**: Rich markdown personal scratchpad.
- *Debounced autosave* with visual status indicators ("Saved ✓", "Saving...").

### 4. 🧠 SuperMemo SM-2 Spaced Repetition Engine
- **Active-Recall Session View** (`/review`): Question prompts conceal answers initially to test active retrieval.
- **30-Second Summary Cards**: High-yield cards summarizing the core 30-second answer and key tip.
- **SM-2 Interval Scheduling** (`src/lib/sm2.ts`): Self-rating buttons (`Forgot`, `Partial`, `Remembered`, `Very Easy`) calculate ease factors, review counts, and exact next review interval dates.

### 5. 🎨 GitBook/Notion-Style Editorial Design System
- **Theme**: Warm, light-only editorial paper surface (`#faf9f5` paper, `#1b1b18` ink, `#245844` green accent, `#b3472a` clay attention, `#a9791c` amber due).
- **Typography**: **Newsreader** (Display headers), **Inter** (UI body), **JetBrains Mono** (Code, variables, eyebrows).
- **Navigation**: Instant search command palette (`⌘K`), hierarchical documentation sidebar, and breadcrumb bar.

---

## 📊 Dataset & Topic Summary

| Domain / Topic | Question Count | Type | Key Topics Covered |
| --- | --- | --- | --- |
| **Java** | 62 Questions | Conceptual | JVM, Memory Model, GC, `HashMap`, `ConcurrentHashMap`, Concurrency, Threads |
| **Python** | 62 Questions | Conceptual | LEGB scope, Decorators, Generators, Asyncio, GIL, Ref Counting, GC, Metaclasses |
| **JavaScript** | 62 Questions | Conceptual | Closures, Event Loop, Promises, Prototypes, V8 Engine, Hidden Classes, GC |
| **Spring Boot** | 62 Questions | Conceptual | IoC/DI, Spring MVC, Data JPA, Hibernate Caching, Security, Microservices |
| **REST APIs** | 62 Questions | Conceptual | HTTP Methods, Status Codes, OAuth2/JWT, Rate Limiting, CORS, Caching, OpenAPI |
| **DBMS & SQL** | 62 Questions | Conceptual | Indexing (B-Tree/Hash), ACID, Isolation Levels, Normalization, Query Tuning |
| **Operating Systems** | 62 Questions | Conceptual | Process/Thread, Virtual Memory, Paging, Page Faults, CPU Scheduling, Syscalls |
| **Computer Networks** | 62 Questions | Conceptual | TCP/IP, TCP Handshake, DNS Flow, HTTP/1.1 vs HTTP/2 vs HTTP/3, TLS 1.3 |
| **LeetCode Top 150** | 150 Problems | Algorithmic | Two Pointers, Sliding Window, Linked List, Trees, DP, Graph, Heap, Trie |
| **Additional Roles** | 100+ Questions | Conceptual | System Design, AI Engineering, Data Engineering, Analytics, Behavioral |

---

## 🏛️ System Architecture

```text
                               ┌──────────────────────────────────────────────────┐
                               │             FRONTEND (NEXT.JS APP ROUTER)        │
                               │  - GitBook/Notion Style Doc Sidebar & Breadcrumbs │
                               │  - Clean Question Detail View (Short Ans/Tips)   │
                               │  - Integrated Visual Trace Canvas for DSA        │
                               │  - Active Recall Revision Queue & Mastery Matrix │
                               └────────────────────────┬─────────────────────────┘
                                                        │ HTTPS / REST API
                                                        ▼
                               ┌──────────────────────────────────────────────────┐
                               │                 BACKEND (NEXT.JS API)            │
                               │  - Modular Question & Topic Service Layer        │
                               │  - DTO Validation (Zod Schemas)                  │
                               │  - Trace Engine Serializer & Auto-Trace Sandbox  │
                               │  - SuperMemo SM-2 Interval Calculation Engine   │
                               └────────────────────────┬─────────────────────────┘
                                                        │ Prisma ORM
                                                        ▼
                               ┌──────────────────────────────────────────────────┐
                               │               DATABASE (POSTGRESQL / SQLITE)    │
                               │  - Hierarchical Role / Category / Topic Schema   │
                               │  - 586 Questions (Conceptual & Algorithmic)     │
                               │  - User Notes, Mastery Levels & Revisions        │
                               └──────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript 5 (Strict Mode)
- **Styling & CSS**: Tailwind v4 (`@theme`), CSS Modules, Custom Light Editorial Tokens
- **Database & ORM**: Prisma ORM with PostgreSQL / SQLite support
- **AST Parsing & Sandbox**: Acorn (JavaScript AST parsing for Auto-Trace)
- **Icons & Typography**: Lucide Icons, Google Fonts (Newsreader, Inter, JetBrains Mono)

---

## 📁 Repository Structure

```text
DSA Website/
├── docs/                                # Modular implementation plan & architecture index
│   ├── 00_OVERVIEW.md                   # System architecture & roadmap overview
│   ├── IMPLEMENTATION_PLAN.md           # Plan index & phase breakdown
│   ├── PHASE_1_FOUNDATION_AND_SHELL.md  # Phase 1 plan & verification
│   ├── PHASE_2_PROBLEM_LIBRARY_AND_SEEDING.md # Phase 2 plan & dataset seed details
│   ├── PHASE_3_VISUAL_TRACE_ENGINE.md   # Visual trace engine spec
│   ├── PHASE_4_STRUCTURED_NOTES_AND_MASTERY.md # Personal notebook & mastery levels
│   ├── PHASE_5_SPACED_REPETITION_REVISION.md # SM-2 active recall engine
│   └── PHASE_6_DASHBOARD_ANALYTICS_AND_DEPLOYMENT.md # Dashboard & deployment
├── prisma/
│   ├── schema.prisma                    # Database entity model
│   ├── seed.ts                          # Main database seeding script (586 questions)
│   └── validate.ts                      # Dataset integrity validation script
├── src/
│   ├── app/                             # Next.js App Router pages & layouts
│   │   ├── page.tsx                     # Main Study Desk / Role landing dashboard
│   │   ├── problems/                    # Problem index & question detail views
│   │   ├── review/                      # Active-recall spaced repetition deck
│   │   ├── workbench/                   # Interactive visual trace workbench
│   │   └── progress/                    # Mastery capability matrix
│   ├── components/                      # React UI components
│   │   ├── code/                        # CodeBlock syntax renderer
│   │   ├── layout/                      # AppShell, Sidebar, Header, Breadcrumbs
│   │   ├── notes/                       # ProblemNotes 7-field editor
│   │   ├── questions/                   # QuestionDetailPage, RoleHub, TopicPage
│   │   ├── revision/                    # RevisionScreen active recall cards
│   │   └── trace/                       # TraceWorkbench & SVG Visualizers
│   └── lib/
│       ├── autotrace/                   # Acorn JS AST auto-trace instrumentation engine
│       ├── data/                        # Topic question dataset files
│       │   └── topics/                  # java.ts, python.ts, javascript.ts, dbms.ts, etc.
│       ├── sm2.ts                       # SuperMemo SM-2 algorithm implementation
│       └── types.ts                     # Core domain interfaces & types
└── package.json
```

---

## ⚡ Quickstart & Local Setup

### 1. Installation
Clone the repository and install npm dependencies:
```bash
git clone https://github.com/your-username/dsa-website.git
cd dsa-website
npm install
```

### 2. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
*(Default settings use SQLite or local PostgreSQL database connection)*.

### 3. Database Migration & Seeding
Run the Prisma seed command to validate content integrity and populate the database with all 586 questions across Java, Python, JavaScript, Spring Boot, REST APIs, DBMS, OS, Networks, and DSA:
```bash
npm run db:seed
```

### 4. Launch Development Server
Start the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to start studying!

### 5. Type Checking & Production Build
To verify TypeScript compilation and create a production build:
```bash
# Run strict TypeScript validation
npm run typecheck

# Build production Next.js bundle
npm run build
```

---

## 📖 Key Routes

- `/` — **Study Desk Landing**: Select IT role (Software Engineer, Data Analyst, Data Engineer, AI Engineer, Product Manager, Business Analyst), view due revisions, and resume study sessions.
- `/problems` — **Problem & Topic Index**: Filterable catalog with live search across difficulties, topics, subtopics, and collections.
- `/problems/[slug]` — **Question Detail View**: High-yield 30-second answer, detailed explanation, code snippets, interview tips, common traps, and personal notebook.
- `/workbench` / `/problems/[slug]/trace` — **Visual Trace Workbench**: Interactive line-by-line execution visualizer with data structure animation canvas.
- `/review` — **Spaced Repetition Deck**: Active recall Flashcard session driven by SuperMemo SM-2.
- `/progress` — **Mastery & Capability Matrix**: 6-stage mastery level tracker and weak topic indicator.

---

## 📄 Documentation & Architecture References

For detailed phase breakdown and technical architectural decisions, consult the docs folder:
- [📑 Overview & System Architecture](docs/00_OVERVIEW.md)
- [📘 Modular Implementation Plan Index](docs/IMPLEMENTATION_PLAN.md)
- [📗 Phase 2: Content Dataset & Seeding](docs/PHASE_2_PROBLEM_LIBRARY_AND_SEEDING.md)
- [📙 Phase 3: Visual Trace Engine Protocol](docs/PHASE_3_VISUAL_TRACE_ENGINE.md)
- [📕 Phase 4: Personal Notebook & Mastery System](docs/PHASE_4_STRUCTURED_NOTES_AND_MASTERY.md)
- [📓 Phase 5: SM-2 Spaced Repetition Platform](docs/PHASE_5_SPACED_REPETITION_REVISION.md)
