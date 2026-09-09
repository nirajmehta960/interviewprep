# Phase 2 Implementation Plan — Question Bank, Role Content Pipeline & Navigation

## 🎯 Goal
Build the API service layer, repository data access layer, search/filtering logic, 50+ core interview question content dataset across Java, Python, CS Fundamentals, and System Design, and the documentation-style question browser UI.

---

## ⚙️ Backend Deliverables (Phase B2)

### 1. Repository Layer (`src/server/repositories/question.repository.ts`)
- `findAll(options)`: Filter by role, category, topic, difficulty (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`), search query.
- `findBySlug(slug)`: Returns question detail with short answer, detailed explanation, code examples, interview tips, follow-up questions, and related topics.
- `findByTopic(topicSlug)`: Retrieves all questions grouped by difficulty (Beginner ➔ Intermediate ➔ Advanced).

### 2. DTO & Validation (`src/server/dtos/question.dto.ts`)
- Zod validation for query filters:
  ```typescript
  const QuestionQuerySchema = z.object({
    role: z.string().optional(),
    topic: z.string().optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    search: z.string().optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(20),
  });
  ```

### 3. Comprehensive Software Engineering & Technical Interview Dataset (`src/lib/data/topics/` & `prisma/seed.ts`)
Seed 426 high-yield conceptual questions across 8 core software engineering interview domains + 150 LeetCode Top Interview catalog problems:
1. **Java** (`java.ts` — 62 Questions): JDK/JRE/JVM, `HashMap` internal array & tree bucket mechanics, `ConcurrentHashMap` CAS & synchronized locks, Garbage Collectors (G1, ZGC), Java Memory Model, `CompletableFuture`, Virtual Threads.
2. **Python** (`python.ts` — 62 Questions): LEGB scope, Decorators & Closures, Generators & Iterators, Asyncio event loop, Python GIL, Reference Counting & GC cycles, Metaclasses, C extensions.
3. **JavaScript** (`javascript.ts` — 62 Questions): Scope & Closures, Event Loop & Microtask queue, Promises & Async/Await, Prototypes & Inheritance, V8 engine internals (Hidden classes, ICs, Garbage Collection), ES6+ modules.
4. **Spring Boot** (`spring_boot.ts` — 62 Questions): Dependency Injection & IoC, Spring MVC lifecycle, Data JPA & Hibernate L1/L2 caching, Spring Security (JWT/OAuth2), Microservices, Actuator, WebFlux reactive streams.
5. **REST APIs** (`rest-apis.ts` — 62 Questions): HTTP Method semantics & status codes, Idempotency, JWT & OAuth2, Rate limiting algorithms (Token bucket/Leaky bucket), CORS preflight, HTTP Caching headers (`Cache-Control`, `ETag`), OpenAPI/Swagger.
6. **DBMS & SQL** (`dbms.ts` — 62 Questions): B-Tree & Hash indexing, ACID properties, Transaction isolation levels (Read Committed to Serializable), Normalization (1NF–5NF), SQL query optimization (`EXPLAIN`), Database Sharding & Replication.
7. **Operating Systems** (`os.ts` — 62 Questions): Process vs Thread, Virtual memory & Paging, Page fault handling, CPU scheduling, Synchronization (Mutex, Semaphore), Deadlock handling, Kernel syscalls.
8. **Computer Networks** (`networks.ts` — 62 Questions): OSI & TCP/IP stack, TCP 3-Way Handshake & Teardown, UDP, DNS Resolution flow, HTTP/1.1 vs HTTP/2 vs HTTP/3, TLS 1.3 Handshake, Subnetting, Load Balancing.
9. **LeetCode Top Interview 150** (`catalog.ts` — 150 Problems): Algorithmic DSA problem catalog across 23 subtopics with Java and Python reference solutions.

---

## 🎨 Frontend Deliverables (Phase F2)

### 1. Component Hierarchy (`src/components/questions/`)
- `RoleHub`: Displays preparation categories (Languages, CS Fundamentals, Development, Advanced) with topic cards.
- `TopicPage`: Topic header, category navigator, and 3 difficulty sections:
  - 🟢 **Beginner**: Fundamental questions.
  - 🟡 **Intermediate**: Practical application & internal mechanics.
  - 🔴 **Advanced**: Architecture, concurrency, and deep internals.
- `QuestionDetailPage`: Distraction-free reading page featuring:
  - Breadcrumb (`Software Engineer / Java / Collections / Intermediate`)
  - Title
  - 📌 Short Answer card (30-second interview response)
  - 📖 Detailed Explanation
  - 💻 Code Example (Java/Python syntax highlighted)
  - 💡 Interview Tip (What the interviewer is testing)
  - ⚠️ Common Trap
  - ❓ Common Follow-Up Questions
  - 🔗 Related Topics

---

## 🧪 Phase 2 Verification Checklist
- [x] `npm run db:seed` populates 426 conceptual questions across Java, Python, JS, Spring Boot, REST APIs, DBMS, OS, Networks, and 150 DSA catalog problems.
- [x] `GET /api/questions?topic=java&difficulty=EASY` returns filtered JSON.
- [x] Question Detail Page renders Short Answer, Code Snippets, and Interview Tips with high readability.
- [x] `npm run typecheck` passes with zero errors.

