# Phase 3 Implementation Plan — Interactive Visual Trace Engine (DSA Module)

## 🎯 Goal
Integrate the interactive visual algorithm tracing workbench into DSA algorithmic interview questions under `Software Engineer` ➔ `CS Fundamentals` ➔ `Data Structures & Algorithms`.

---

## ⚙️ Backend & Engine Integration (Phase B3)

### 1. Dual-Tab Question Integration (`src/components/questions/QuestionDetailPage.tsx`)
- Algorithmic DSA questions (`type === 'ALGORITHMIC'`) feature a top tab switcher:
  - 📖 **[Interview Answer View]**: Short Answer, Time/Space Complexity, Approach, Common Trap.
  - ⚡ **[Visual Trace Workbench]**: Interactive line-by-line algorithm visualizer.

### 2. Standardized Trace Protocol (`src/types/trace.ts`)
```typescript
export interface TraceStep {
  stepIndex: number;
  lineHighlight: Record<Language, number>;
  explanation: string;
  state: string;
  phase: string;
  kind: EventKind;
  variables: Record<string, string>;
  structures: {
    array?: ArrayStructure;
    intervals?: IntervalStructure;
    linkedList?: LinkedListStructure;
  };
  events: SemanticEvent[];
}
```

### 3. Client-Side Auto-Trace Engine (`src/lib/autotrace/`)
- In-browser AST instrumentation via Acorn parser (`instrument.ts`) + deep-cloned variable snapshots (`run.ts`) + structure classification (`classify.ts`).
- Executes custom JavaScript input in browser sandbox (`new Function`) for zero-server-overhead auto-tracing.

---

## 🎨 Frontend Deliverables (Phase F3)

### 1. Visual Trace Workspace (`src/components/trace/TraceWorkbench.tsx`)
- Desktop 3-panel resizable workspace:
  - **Panel 1 (Left)**: Monaco / CodeBlock syntax-highlighted code editor with Java/Python line highlights.
  - **Panel 2 (Center)**: Animated SVG/Canvas Data Structure Visualizers (`ArrayVisualizer`, `LinkedListVisualizer`, `IntervalVisualizer`).
  - **Panel 3 (Right)**: Variable state table and step explanation callout.
  - **Bottom Control Bar**: Play/Pause, Step Prev/Next, Playback Speed (0.5x, 1x, 2x, 4x), Timeline scrubber, Jump to step.

---

## 🧪 Phase 3 Verification Checklist
- [ ] Clicking `[Visual Trace Workbench]` on a DSA question seamlessly loads the execution canvas.
- [ ] Stepping forward/backward highlights active lines in Java/Python code viewer and updates data structure canvas.
- [ ] Auto-trace sandbox runs custom inputs safely in browser tab.
