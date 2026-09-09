/**
 * SuperMemo SM-2 scheduling (Phase 5, B5).
 *
 * Kept as a pure module so the same implementation backs the UI's projected
 * intervals and, later, `revision.service.recordReview`.
 */

/** 0 Forgot · 1 Partially remembered · 2 Remembered · 3 Very easy. */
export type RecallQuality = 0 | 1 | 2 | 3;

export const RECALL_OPTIONS: {
  quality: RecallQuality;
  label: string;
  tone: "danger" | "warn" | "brand";
}[] = [
  { quality: 0, label: "Forgot", tone: "danger" },
  { quality: 1, label: "Partially remembered", tone: "warn" },
  { quality: 2, label: "Remembered", tone: "brand" },
  { quality: 3, label: "Very easy", tone: "brand" },
];

export const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

export interface ScheduleState {
  easeFactor: number;
  reviewCount: number;
  intervalDays: number;
}

export interface ScheduleResult extends ScheduleState {
  /** Days until the next review. */
  intervalDays: number;
}

/**
 * Applies a recall rating to a schedule.
 *
 * A failed recall (quality 0) resets the ladder to one day, which is the point
 * of the algorithm — the interval must collapse when the memory does.
 */
export function applyReview(state: ScheduleState, quality: RecallQuality): ScheduleResult {
  const delta = 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02);
  const easeFactor = Math.max(MIN_EASE_FACTOR, state.easeFactor + delta);

  if (quality === 0) {
    return { easeFactor, reviewCount: 0, intervalDays: 1 };
  }

  const reviewCount = state.reviewCount + 1;
  const intervalDays =
    reviewCount === 1 ? 1 : reviewCount === 2 ? 6 : Math.round(state.intervalDays * easeFactor);

  return { easeFactor, reviewCount, intervalDays };
}

/** Projects each rating's outcome, for labelling the rating buttons. */
export function projectIntervals(state: ScheduleState) {
  return RECALL_OPTIONS.map((option) => ({
    ...option,
    intervalDays: applyReview(state, option.quality).intervalDays,
  }));
}

export function formatInterval(days: number) {
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  if (days % 7 === 0 && days < 28) return `${days / 7} ${days === 7 ? "week" : "weeks"}`;
  if (days < 60) return `${days} days`;
  return `${Math.round(days / 30)} months`;
}
