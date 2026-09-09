import type { Difficulty, MasteryLevel, Problem, Progress } from "@/lib/types";
import { authoredProblems } from "./problems";
import { catalog } from "./catalog";
import { categories, categoryName, patternName, patterns } from "./taxonomy";

import {
  activity,
  bookmarks,
  categoryStats,
  freeformNotes,
  patternStats,
  progress,
  revisionQueue,
  savedNotes,
  session,
} from "./user";

/**
 * The catalog defines the study plan; authored write-ups supply depth.
 *
 * Metadata always comes from the catalog so the plan stays authoritative — an
 * older write-up's stale category or synopsis never overrides it.
 */
const writeUps = new Map(authoredProblems.map((entry) => [entry.slug, entry]));

const problems: Problem[] = catalog.map((entry) => {
  const writeUp = writeUps.get(entry.slug);
  if (!writeUp) return entry;

  return {
    ...entry,
    description: writeUp.description,
    examples: writeUp.examples,
    constraints: writeUp.constraints,
    intuition: writeUp.intuition,
    approach: writeUp.approach,
    timeComplexity: writeUp.timeComplexity,
    spaceComplexity: writeUp.spaceComplexity,
    keyTakeaway: writeUp.keyTakeaway,
    revisionSummary: writeUp.revisionSummary,
    criticalTrap: writeUp.criticalTrap,
    solutions: writeUp.solutions,
  };
});


export * from "./taxonomy";
export * from "./traces";
export { NOTE_FIELDS, type NoteFieldKey } from "./user";
export { problems, categories, patterns, progress, revisionQueue, activity, categoryStats, patternStats, bookmarks, session, savedNotes, freeformNotes };

/**
 * Read model for the UI.
 *
 * Every screen goes through these accessors rather than touching fixtures
 * directly, so Phase 2 can swap the bodies for `fetch` calls in one place.
 */

const DEFAULT_PROGRESS: Omit<Progress, "problemSlug"> = {
  mastery: "NOT_STUDIED",
  traceCompleted: false,
  bookmarked: false,
  lastStudiedAt: null,
  notesFilled: 0,
  notesTotal: 7,
};

export function getProblem(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

export function getProgress(slug: string): Progress {
  return progress.find((p) => p.problemSlug === slug) ?? { problemSlug: slug, ...DEFAULT_PROGRESS };
}

export interface ProblemRow {
  problem: Problem;
  progress: Progress;
}

export function getProblemRows(): ProblemRow[] {
  return problems.map((problem) => ({ problem, progress: getProgress(problem.slug) }));
}

export interface LibraryFilters {
  search?: string;
  categories?: string[];
  difficulties?: Difficulty[];
  patterns?: string[];
  mastery?: MasteryLevel[];
  bookmarkedOnly?: boolean;
}

/** Mirrors the server-side filter contract in `problem.repository.findAll`. */
export function filterProblemRows(rows: ProblemRow[], filters: LibraryFilters): ProblemRow[] {
  const needle = filters.search?.trim().toLowerCase() ?? "";

  return rows.filter(({ problem, progress: rowProgress }) => {
    if (needle.length > 0) {
      const haystack = [
        problem.title,
        problem.synopsis,
        categoryName(problem.categorySlug),
        ...problem.patternSlugs.map(patternName),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }

    if (filters.categories?.length && !filters.categories.includes(problem.categorySlug)) return false;
    if (filters.difficulties?.length && !filters.difficulties.includes(problem.difficulty)) return false;
    if (filters.patterns?.length && !problem.patternSlugs.some((p) => filters.patterns?.includes(p))) return false;
    if (filters.mastery?.length && !filters.mastery.includes(rowProgress.mastery)) return false;
    if (filters.bookmarkedOnly && !rowProgress.bookmarked) return false;

    return true;
  });
}

export interface RevisionRow {
  problem: Problem;
  entry: (typeof revisionQueue)[number];
  progress: Progress;
}

export function getRevisionRows(): RevisionRow[] {
  return revisionQueue
    .map((entry) => {
      const problem = getProblem(entry.problemSlug);
      return problem ? { problem, entry, progress: getProgress(entry.problemSlug) } : null;
    })
    .filter((row): row is RevisionRow => row !== null);
}

export function getDueRows(): RevisionRow[] {
  return getRevisionRows().filter((row) => row.entry.status === "DUE");
}

export function getActivityRows() {
  return activity
    .map((entry) => {
      const problem = getProblem(entry.problemSlug);
      return problem ? { problem, entry } : null;
    })
    .filter((row): row is { problem: Problem; entry: (typeof activity)[number] } => row !== null);
}

export function getBookmarkRows() {
  return bookmarks
    .map((bookmark) => {
      const problem = getProblem(bookmark.problemSlug);
      return problem ? { problem, bookmark } : null;
    })
    .filter((row): row is { problem: Problem; bookmark: (typeof bookmarks)[number] } => row !== null);
}

/** Recently opened list for the sidebar rail. */
export function getRecentRows() {
  return getProblemRows()
    .filter((row) => row.progress.lastStudiedAt !== null)
    .sort((a, b) => (a.progress.lastStudiedAt! < b.progress.lastStudiedAt! ? 1 : -1))
    .slice(0, 4);
}

/** Aggregate counters for the dashboard and progress screens (Phase 6). */
export function getAnalytics() {
  const rows = getProblemRows();
  const atLeast = (level: MasteryLevel) => {
    const order: MasteryLevel[] = [
      "NOT_STUDIED",
      "STUDIED",
      "TRACED",
      "CAN_EXPLAIN",
      "SOLVED_INDEPENDENTLY",
      "INTERVIEW_READY",
    ];
    const min = order.indexOf(level);
    return rows.filter((row) => order.indexOf(row.progress.mastery) >= min).length;
  };

  return {
    studied: categoryStats.reduce((sum, s) => sum + s.studied, 0),
    traced: categoryStats.reduce((sum, s) => sum + s.traced, 0),
    independent: categoryStats.reduce((sum, s) => sum + s.independent, 0),
    mastered: categoryStats.reduce((sum, s) => sum + s.mastered, 0),
    due: getDueRows().length,
    totalProblems: categories.reduce((sum, c) => sum + c.problemCount, 0),
    localStudied: atLeast("STUDIED"),
  };
}

/** Categories needing another pass, ranked by mastery rate. */
export function getWeakCategories(limit = 3) {
  return [...categoryStats]
    .filter((stat) => stat.studied > 0)
    .sort((a, b) => a.mastered / a.studied - b.mastered / b.studied)
    .slice(0, limit)
    .map((stat) => ({
      ...stat,
      name: categoryName(stat.categorySlug),
      rate: Math.round((stat.mastered / stat.studied) * 100),
    }));
}

export function getWeakPatterns(limit = 4) {
  return [...patternStats]
    .sort((a, b) => a.mastered / a.studied - b.mastered / b.studied)
    .slice(0, limit)
    .map((stat) => ({ ...stat, name: patternName(stat.patternSlug) }));
}

export function getNotes(slug: string) {
  return savedNotes[slug] ?? {};
}

export function getFreeform(slug: string) {
  return freeformNotes[slug] ?? "";
}

export function getRelatedProblems(slug: string, limit = 3) {
  const problem = getProblem(slug);
  if (!problem) return [];

  return getProblemRows()
    .filter((row) => row.problem.slug !== slug)
    .map((row) => {
      const sharedPatterns = row.problem.patternSlugs.filter((p) => problem.patternSlugs.includes(p)).length;
      const sameCategory = row.problem.categorySlug === problem.categorySlug ? 1 : 0;
      return { ...row, score: sharedPatterns * 2 + sameCategory };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
