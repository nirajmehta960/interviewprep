# Phase 5 Implementation Plan — Spaced Repetition Revision Platform

## 🎯 Goal
Build an active-recall spaced repetition revision queue using the SuperMemo SM-2 algorithm across all interview topics (Java, Python, System Design, DSA) with high-yield 30-second summary cards.

---

## ⚙️ Backend Deliverables (Phase B5)

### 1. Spaced Repetition Engine (`src/lib/sm2.ts` / `src/server/services/revision.service.ts`)
- **SuperMemo SM-2 Formula**:
  - Quality ratings: `0` (Forgot), `1` (Partially Remembered), `2` (Remembered), `3` (Very Easy).
  - Next review interval calculation:
    $EF' = EF + (0.1 - (3 - rating) \times (0.08 + (3 - rating) \times 0.02))$
- `getDueReviews(userId)`: Returns questions due for review today.
- `recordReview(userId, questionId, qualityRating)`: Updates next review date.

---

## 🎨 Frontend Deliverables (Phase F5)

### 1. Active-Recall Session View (`src/components/revision/RevisionScreen.tsx`)
- Conceals answer initially and prompts active retrieval:
  - *Can you state the 30-second short answer?*
  - *What is the key internal mechanism / trade-off?*
  - *What interview tip applies?*
- Toggle button reveals Short Answer, Detailed Explanation, and Code Examples.
- Rating buttons (`Forgot`, `Partial`, `Remembered`, `Very Easy`) show real projected review intervals.

---

## 🧪 Phase 5 Verification Checklist
- [ ] Active recall revision queue pulls due questions across Java, Python, and DSA.
- [ ] Self-rating updates review interval cleanly.
