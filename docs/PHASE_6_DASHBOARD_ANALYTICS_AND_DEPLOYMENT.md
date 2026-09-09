# Phase 6 Implementation Plan — Production Deployment & Polish

## 🎯 Goal
Focus on delivering a fast, distraction-free interview preparation platform on Vercel + Supabase, ensuring instant search response, clean navigation, and smooth reading performance.

> **Note on Scope**: Complex analytics dashboards, progress gauges, and radar metrics are deferred to future scope so V1 stays 100% focused on reading, learning, and interview preparation.

---

## ⚙️ Backend Deliverables (Phase B6)

### 1. Database Caching & Search Indexing
- Optimized Prisma queries for fast question and topic retrieval.
- Database index strategy on `[topicId]`, `[difficulty]`, and `[slug]`.

### 2. Environment & Production Config
- Configure Supabase PostgreSQL production connection string.
- Environment variable validation (`DATABASE_URL`, `DIRECT_URL`).

---

## 🎨 Frontend Deliverables (Phase F6)

### 1. Simple Role Study Landing (`src/app/page.tsx`)
- Clean, focused homepage:
  - Header: **InterviewPrep** — *Your structured notebook for IT interview preparation.*
  - **Choose Your Role** selection cards:
    - **Software Engineer** (Java · Python · DSA · OOP · DBMS · System Design)
    - **Data Analyst** (SQL · Statistics · Python · Excel · Visualization)
    - **Data Engineer** (SQL · Python · ETL · Data Warehousing · Spark)
    - **Business Analyst** (Requirements · SQL · Excel · Analytics · Agile)
  - Direct 1-click navigation into role study materials.

### 2. Vercel & Supabase Deployment
- Run type checks: `npm run typecheck`.
- Run production build: `npm run build`.
- Deploy Next.js App Router on Vercel Free Tier with Supabase PostgreSQL connection.

---

## 🧪 Phase 6 Verification Checklist
- [ ] Next.js app builds cleanly with zero TypeScript errors or broken imports.
- [ ] Homepage renders clean Role Selection cards with zero lag.
- [ ] Vercel deployment succeeds with instant page loads and zero server overhead.
