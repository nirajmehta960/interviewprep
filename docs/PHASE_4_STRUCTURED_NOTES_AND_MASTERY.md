# Phase 4 Implementation Plan — Personal Notebook & Mastery System

## 🎯 Goal
Provide structured notebook fields for every technical interview question (Java, Python, System Design, DSA) and track user mastery using a 6-stage progression state machine.

---

## ⚙️ Backend Deliverables (Phase B4)

### 1. Notes API Service (`src/server/services/note.service.ts`)
- `getNote(userId, questionId)`: Retrieves personal notes for a question.
- `upsertNote(userId, questionId, data)`: Debounced update for structured fields:
  - 🧠 `mentalModel`: Personal mental model / core intuition.
  - 💡 `keyInsight`: Crucial technical insight.
  - ⚠️ `myMistake`: Mistakes made during practice.
  - 🎯 `interviewTips`: Notes on how to present the answer in an interview.
  - 📌 `keepForgetting`: Frequently forgotten syntax or edge cases.
  - 📝 `freeform`: Markdown notes.

### 2. Mastery Progression Machine (`src/server/services/mastery.service.ts`)
- 6-Stage Mastery Level state machine:
  `NOT_STUDIED` ➔ `STUDIED` ➔ `TRACED` ➔ `CAN_EXPLAIN` ➔ `SOLVED_INDEPENDENTLY` ➔ `INTERVIEW_READY`.

---

## 🎨 Frontend Deliverables (Phase F4)

### 1. Structured Note Editor (`src/components/notes/ProblemNotes.tsx`)
- Accordion & tabbed structured input sections available on every question page.
- Auto-save status hook (`useAutoSaveNote`) with visual badge ("Saved ✓", "Saving...").

---

## 🧪 Phase 4 Verification Checklist
- [ ] Personal notes auto-save seamlessly on Java, Python, System Design, and DSA question pages.
- [ ] Reloading question page restores saved personal notes.
