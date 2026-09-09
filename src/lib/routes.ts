import type { Difficulty, QuestionType } from "@/lib/types";

/**
 * Where a question lives.
 *
 * Theory and coding problems are read differently, so they are addressed
 * differently. A coding problem is a destination: one page, with its own
 * workbench and reference solution. A theory question is a passage inside a
 * chapter — a dozen of them on one page, read top to bottom — so its address is
 * an anchor on the topic page, under the level tab that contains it.
 *
 * Keep every link in the app going through here; a question that is linked
 * inconsistently is one that appears twice in navigation.
 */

export const LEVEL_PARAM = "level";

export const LEVEL_SLUG: Record<Difficulty, string> = {
  EASY: "beginner",
  MEDIUM: "intermediate",
  HARD: "advanced",
};

export const LEVEL_FROM_SLUG: Record<string, Difficulty> = {
  beginner: "EASY",
  intermediate: "MEDIUM",
  advanced: "HARD",
};

export const topicHref = (roleSlug: string, topicSlug: string) =>
  `/roles/${roleSlug}/${topicSlug}`;

export interface QuestionLocation {
  slug: string;
  type: QuestionType;
  difficulty: Difficulty;
  roleSlug: string;
  topicSlug: string;
}

/** The canonical URL for a question, per its type. */
export function questionHref(question: QuestionLocation): string {
  if (question.type === "ALGORITHMIC") return `/questions/${question.slug}`;

  const level = LEVEL_SLUG[question.difficulty];
  return `${topicHref(question.roleSlug, question.topicSlug)}?${LEVEL_PARAM}=${level}#${question.slug}`;
}
