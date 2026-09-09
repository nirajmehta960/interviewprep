# InterviewPrep — Product Architecture & Roadmap Index

A production-grade, modular engineering roadmap and system index for **InterviewPrep**: a structured software engineering & technical interview-preparation notebook, comprehensive question bank (586 total questions), interactive visual algorithm execution workbench, and spaced repetition revision platform.

---

## 💡 Product Vision & Core Mission

> **InterviewPrep** is a structured, GitBook/Notion-style technical study platform for Software Engineering & Technical Interview Preparation.

### Core Capabilities (V1 Implemented)
The platform delivers an uncompromised, distraction-free reading, visual tracing, and active-recall preparation environment:
- **Technical Roles Supported**: Software Engineer, Data Analyst, Data Engineer, AI Engineer, Product Manager, Business Analyst.
- **Hierarchical Learning**: `Role` ➔ `Category` ➔ `Topic` ➔ `Difficulty (Beginner → Intermediate → Advanced)` ➔ `Question`.
- **High-Yield Question Detail Pages**: 30-Second Short Answer, Detailed Explanation, Reference Code Snippets (Java & Python), Interview Tips, Common Traps, Follow-up Questions, and Related Topics.
- **Interactive Visual Trace Workbench**: Dual-mode algorithm trace engine featuring hand-crafted step generators with synced code highlighting & SVG animation canvases, plus an in-browser AST auto-trace sandbox (`src/lib/autotrace/`).
- **Structured Technical Notebook**: 7-field structured notebook (Mental Model, Key Insight, Common Trap, Interview Tip, My Mistake, Keep Forgetting, Freeform) with debounced autosave.
- **SM-2 Spaced Repetition Platform**: Flashcard active-recall session queue (`/review`) driven by the SuperMemo SM-2 interval scheduling algorithm.
- **Aesthetic & UX**: Minimal, GitBook-inspired light paper/ink theme (`#faf9f5` paper, `#1b1b18` ink), typography (Newsreader, Inter, JetBrains Mono), instant search command palette (`⌘K`), and breadcrumb navigation.

---

## 📚 Question Dataset Breakdown (586 Questions Total)

The question dataset is split into two primary paradigms:

### 1. High-Yield Conceptual Question Library (473 Questions)
Modular topic collections defined in `src/lib/data/topics/` covering core software engineering internals and interview questions:
- **OOP & Design** (`oop.ts` — 62 Questions): 4 Pillars, Abstraction vs Encapsulation, Diamond Problem, Virtual Tables & vptr, Covariant Return Types, SOLID Principles (SRP, OCP, LSP, ISP, DIP), Design Patterns (Singleton, Factory, Builder, Strategy, Observer, Adapter, Decorator, Proxy), Law of Demeter, Value Objects vs Entities.
- **Java** (`java.ts` — 62 Questions): Core Java, Collections internal mechanics (`HashMap`, `ConcurrentHashMap`), Multithreading & Synchronization, JVM Memory Model, Garbage Collectors (G1, ZGC), Java 8-21 Features (`CompletableFuture`, Sealed Classes, Virtual Threads).
- **Python** (`python.ts` — 62 Questions): Data Types & Immutability, LEGB Scoping, Decorators, Generators & Iterators, Asyncio & Event Loop, GIL (Global Interpreter Lock), Memory Management & Reference Counting, Metaclasses, PyPy & C Extensions.
- **JavaScript** (`javascript.ts` — 62 Questions): Scope & Closures, Event Loop & Microtask Queue, Promises & Async/Await, Prototypes & Prototypal Chain, V8 Engine internals (Hidden classes, JIT compilation, GC), ES6+ modules.
- **Spring Boot** (`spring_boot.ts` — 62 Questions): IoC Container & Dependency Injection, Spring MVC Lifecycle, Data JPA & Hibernate L1/L2 Caching, Spring Security (JWT/OAuth2), Microservices Patterns, Actuator, WebFlux.
- **REST APIs** (`rest-apis.ts` — 62 Questions): HTTP Method Semantics & Status Codes, Idempotency, Authentication & Authorization (JWT, OAuth2, Bearer Tokens), Rate Limiting Algorithms, CORS, HTTP Caching (ETags, Cache-Control), OpenAPI, API Versioning.
- **DBMS & SQL** (`dbms.ts` — 62 Questions): Relational Algebra, B-Tree & Hash Indexing, ACID Properties, Transaction Isolation Levels, Normalization (1NF to 5NF), Query Optimization & EXPLAIN, Database Sharding & Replication.
- **Operating Systems** (`os.ts` — 62 Questions): Process vs Thread, Virtual Memory & Paging, Page Fault Handling, CPU Scheduling Algorithms, Synchronization Primitives (Mutex, Semaphore), Deadlock Detection & Avoidance, Kernel Syscalls.
- **Computer Networks** (`networks.ts` — 62 Questions): OSI & TCP/IP Stack, TCP 3-Way Handshake & Teardown, UDP, DNS Resolution Flow, HTTP/1.1 vs HTTP/2 vs HTTP/3, SSL/TLS 1.3 Handshake, Subnetting, Load Balancing.
- **Additional Domains**: System Design, Git, Software Testing, Behavioral, AI Engineering, Data Engineering, Data Analytics, Business Analysis, Product Management, Frameworks.

### 2. LeetCode Top Interview 150 Catalog (150 Algorithmic Questions)
Full algorithmic problem catalog across 23 subtopic groups (Array/String, Two Pointers, Sliding Window, Linked List, Trees, Graphs, Dynamic Programming, Heap, Trie, etc.), seeded with Java and Python reference implementations.

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

## 📂 Phase-by-Phase Plan Index & Status

1. 📘 **[Phase 1: Foundation, Role Schema & Documentation Shell](file:///Users/nirajmehta/DSA%20Website/docs/PHASE_1_FOUNDATION_AND_SHELL.md)** — ✅ **Completed**
   - Database schema for Roles, Categories, Topics, and Questions. Prisma ORM setup. Editorial paper/ink design tokens in `globals.css`. GitBook-style sidebar, breadcrumbs, and command palette (`⌘K`).

2. 📗 **[Phase 2: Question Bank, Role Content Pipeline & Navigation](file:///Users/nirajmehta/DSA%20Website/docs/PHASE_2_PROBLEM_LIBRARY_AND_SEEDING.md)** — ✅ **Completed**
   - Software Engineer & IT role hierarchy. 426 high-yield conceptual questions across Java, Python, JS, Spring Boot, REST APIs, DBMS, OS, Networks, plus 150 DSA Top Interview questions seeded with `prisma/seed.ts`.

3. 📙 **[Phase 3: Interactive Visual Trace Engine (DSA Module)](file:///Users/nirajmehta/DSA%20Website/docs/PHASE_3_VISUAL_TRACE_ENGINE.md)** — ✅ **Completed**
   - Dual-tab question view (`📖 Interview View` vs `⚡ Visual Trace Workbench`). Step-by-step code highlighting in Java and Python, variable mutation snapshots, SVG animation canvases, and in-browser JS AST auto-trace sandbox (`src/lib/autotrace/`).

4. 📕 **[Phase 4: Personal Structured Notebook & Mastery System](file:///Users/nirajmehta/DSA%20Website/docs/PHASE_4_STRUCTURED_NOTES_AND_MASTERY.md)** — ✅ **Completed**
   - 7-field structured technical notebook (Mental Model, Key Insight, Common Trap, Interview Tip, My Mistake, Keep Forgetting, Freeform) with debounced autosave and 6-stage mastery progression machine (`NOT_STUDIED` ➔ `INTERVIEW_READY`).

5. 📓 **[Phase 5: Active-Recall Revision Cards](file:///Users/nirajmehta/DSA%20Website/docs/PHASE_5_SPACED_REPETITION_REVISION.md)** — ✅ **Completed**
   - Flashcard active recall revision queue (`/review`) driven by the SuperMemo SM-2 interval scheduling algorithm, self-rating controls, and 30-second high-yield summary cards.

6. 📊 **[Phase 6: Dashboard, Analytics & Production Deployment](file:///Users/nirajmehta/DSA%20Website/docs/PHASE_6_DASHBOARD_ANALYTICS_AND_DEPLOYMENT.md)** — ✅ **Completed**
   - Study desk dashboard (`/`), capability matrix (`/progress`), typecheck verification (`npm run typecheck`), and production build pipeline (`npm run build`).

