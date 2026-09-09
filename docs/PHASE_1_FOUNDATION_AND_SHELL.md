# Phase 1 Implementation Plan — Foundation, Database Schema & Documentation Shell

## 🎯 Goal
Establish the Next.js App Router project architecture, configure Prisma ORM with Supabase PostgreSQL, set up the hierarchical database model supporting IT roles, topics, and question types, and build the GitBook/Notion-style documentation shell.

---

## ⚙️ Backend Deliverables (Phase B1)

### 1. Database Entity Specifications (`prisma/schema.prisma`)

```prisma
enum Difficulty {
  EASY     // Beginner
  MEDIUM   // Intermediate
  HARD     // Advanced
}

enum Language {
  JAVA
  PYTHON
}

enum QuestionType {
  CONCEPTUAL  // e.g. "How does HashMap work internally?"
  ALGORITHMIC // e.g. "Reverse Linked List" (Has Visual Trace Workbench)
  BEHAVIORAL  // e.g. "STAR method project questions"
}

enum MasteryLevel {
  NOT_STUDIED
  STUDIED
  TRACED
  CAN_EXPLAIN
  SOLVED_INDEPENDENTLY
  INTERVIEW_READY
}

model Role {
  id          String     @id @default(uuid())
  slug        String     @unique // "software-engineer", "data-analyst", etc.
  name        String
  description String
  order       Int
  categories  Category[]

  @@map("roles")
}

model Category {
  id          String     @id @default(uuid())
  roleId      String
  role        Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  slug        String     @unique // "languages", "cs-fundamentals", "development", "advanced"
  name        String
  order       Int
  topics      Topic[]

  @@map("categories")
}

model Topic {
  id          String     @id @default(uuid())
  categoryId  String
  category    Category   @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  slug        String     @unique // "java", "python", "dsa", "dbms", "system-design"
  name        String
  monogram    String
  order       Int
  questions   Question[]

  @@map("topics")
}

model Question {
  id                  String       @id @default(uuid())
  slug                String       @unique
  number              Int
  title               String
  difficulty          Difficulty   // Beginner (EASY), Intermediate (MEDIUM), Advanced (HARD)
  type                QuestionType @default(CONCEPTUAL)
  topicId             String
  topic               Topic        @relation(fields: [topicId], references: [id], onDelete: Cascade)
  subtopic            String?      // e.g. "Collections", "Multithreading", "Memory Model"
  synopsis            String
  leetcodeUrl         String?
  
  // High-Yield Question Content
  shortAnswer         String?
  detailedExplanation String[]     @default([])
  examples            Json?        // [{ language, input, output, explanation }]
  codeExamples        Json?        // [{ language: "JAVA", code: "..." }]
  interviewTip        String?
  followUpQuestions   String[]     @default([])
  relatedTopics       String[]     @default([])

  solutions           Solution[]
  traces              TraceData[]
  notes               UserNote[]
  progress            UserProgress[]
  revisions           RevisionSchedule[]
  bookmarks           Bookmark[]

  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  @@index([topicId])
  @@index([difficulty])
  @@map("questions")
}
```

---

## 🎨 Frontend Deliverables (Phase F1)

### 1. Design Tokens & Styling (`src/app/globals.css`)
- **Theme**: Light-only paper/ink editorial theme (`#faf9f5` paper, `#1b1b18` ink, `#245844` green accent, `#b3472a` clay attention, `#a9791c` amber due).
- **Typography**: Newsreader (headings), Inter (UI), JetBrains Mono (code, variables, eyebrows).

### 2. Documentation Shell (`src/components/layout/AppShell.tsx`)
- **Role Switcher Header**: Software Engineer, Data Analyst, Data Engineer, Business Analyst.
- **Collapsible Documentation Sidebar**:
  - `Programming Languages` (Java, Python)
  - `CS Fundamentals` (OOP, DSA, DBMS, OS, Networks)
  - `Development` (REST APIs, Backend, Git, Testing)
  - `Advanced` (System Design, Distributed Systems)
  - `Interview` (Behavioral, Resume, Projects)
- **Breadcrumbs Navigation**: e.g., `Software Engineer / Java / Collections / HashMap / Intermediate`.
- **Command Palette (`Cmd + K`)**: Global instant search across all questions, topics, and concepts.

---

## 🧪 Phase 1 Verification Checklist
- [ ] Run `npx prisma db push` cleanly.
- [ ] Next.js app builds cleanly (`npm run build`).
- [ ] Documentation sidebar renders topics hierarchically with breadcrumbs.
