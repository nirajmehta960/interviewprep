import type { Collection, Difficulty, Language, Prisma, QuestionType } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

/**
 * Question reads (Phase 2, B2).
 *
 * Every list, detail view and search result the UI renders comes from here.
 * Nothing about the content is hardcoded in components.
 */

export interface QuestionExample {
  label: string;
  input: string;
  output: string;
  explanation?: string;
}

/** Row shape for lists — enough to render a card without loading the body. */
export interface QuestionSummary {
  slug: string;
  number: number | null;
  title: string;
  difficulty: Difficulty;
  type: QuestionType;
  collection: Collection;
  subtopic: string | null;
  synopsis: string;
  tags: string[];
  languages: Language[];
  order: number;
  /** True once the question has enough content to read. */
  written: boolean;
}

export interface QuestionDetail extends QuestionSummary {
  leetcodeUrl: string | null;
  shortAnswer: string | null;
  detailedExplanation: string[];
  examples: QuestionExample[];
  constraints: string[];
  approach: string[];
  timeComplexity: string | null;
  spaceComplexity: string | null;
  interviewTip: string | null;
  commonTrap: string | null;
  followUpQuestions: string[];
  relatedTopics: string[];
  revisionSummary: string[];
  solutions: { language: Language; code: string }[];
  context: {
    role: { slug: string; name: string };
    category: { slug: string; name: string };
    topic: { slug: string; name: string; monogram: string };
  };
}

/** Selection shared by every list query. */
const SUMMARY_SELECT = {
  slug: true,
  number: true,
  title: true,
  difficulty: true,
  type: true,
  collection: true,
  subtopic: true,
  synopsis: true,
  tags: true,
  languages: true,
  order: true,
  interviewTip: true,
  approach: true,
  shortAnswer: true,
  _count: { select: { solutions: true } },
} satisfies Prisma.QuestionSelect;

type SummaryRow = Prisma.QuestionGetPayload<{ select: typeof SUMMARY_SELECT }>;

/**
 * Whether a question has enough content to be worth opening.
 *
 * The bar differs by type, because "complete" means different things: an
 * algorithmic problem is not usable without a worked approach and reference
 * code, whereas a conceptual question is complete once it has the
 * interview-ready answer and the tip — demanding a code listing there would
 * mark every well-written theory question as an outline.
 */
const isWritten = (row: SummaryRow): boolean => {
  if (row.type === "ALGORITHMIC") {
    return Boolean(row.interviewTip) && row.approach.length > 0 && row._count.solutions > 0;
  }
  return Boolean(row.interviewTip) && Boolean(row.shortAnswer);
};

const toSummary = (row: SummaryRow): QuestionSummary => ({
  slug: row.slug,
  number: row.number,
  title: row.title,
  difficulty: row.difficulty,
  type: row.type,
  collection: row.collection,
  subtopic: row.subtopic,
  synopsis: row.synopsis,
  tags: row.tags,
  languages: row.languages,
  order: row.order,
  written: isWritten(row),
});

export interface QuestionFilters {
  role?: string;
  category?: string;
  topic?: string;
  subtopic?: string;
  difficulty?: Difficulty[];
  type?: QuestionType[];
  search?: string;
  writtenOnly?: boolean;
}

function buildWhere(filters: QuestionFilters): Prisma.QuestionWhereInput {
  const where: Prisma.QuestionWhereInput = {};

  if (filters.topic || filters.category || filters.role) {
    where.topic = {
      ...(filters.topic ? { slug: filters.topic } : {}),
      ...(filters.category || filters.role
        ? {
            category: {
              ...(filters.category ? { slug: filters.category } : {}),
              ...(filters.role ? { role: { slug: filters.role } } : {}),
            },
          }
        : {}),
    };
  }

  if (filters.subtopic) where.subtopic = filters.subtopic;
  if (filters.difficulty?.length) where.difficulty = { in: filters.difficulty };
  if (filters.type?.length) where.type = { in: filters.type };
  if (filters.writtenOnly) where.interviewTip = { not: null };

  const needle = filters.search?.trim();
  if (needle) {
    where.OR = [
      { title: { contains: needle, mode: "insensitive" } },
      { synopsis: { contains: needle, mode: "insensitive" } },
      { subtopic: { contains: needle, mode: "insensitive" } },
      { tags: { has: needle } },
    ];
  }

  return where;
}

export async function findQuestions(filters: QuestionFilters = {}): Promise<QuestionSummary[]> {
  const rows = await prisma.question.findMany({
    where: buildWhere(filters),
    orderBy: [{ order: "asc" }],
    select: SUMMARY_SELECT,
  });
  return rows.map(toSummary);
}

export interface TopicQuestions {
  questions: QuestionSummary[];
  /** Ordered subtopic groups, preserving the study plan's own sequence. */
  bySubtopic: { subtopic: string; questions: QuestionSummary[] }[];
  byDifficulty: { difficulty: Difficulty; questions: QuestionSummary[] }[];
  counts: { total: number; written: number; easy: number; medium: number; hard: number };
}

const DIFFICULTY_ORDER: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

/** Everything a topic page needs, grouped both ways. */
export const findByTopic = cache(async (roleSlug: string, topicSlug: string): Promise<TopicQuestions> => {
  const questions = await findQuestions({ role: roleSlug, topic: topicSlug });

  const subtopicOrder: string[] = [];
  const subtopicMap = new Map<string, QuestionSummary[]>();
  for (const question of questions) {
    const key = question.subtopic ?? "General";
    if (!subtopicMap.has(key)) {
      subtopicMap.set(key, []);
      subtopicOrder.push(key);
    }
    subtopicMap.get(key)?.push(question);
  }

  return {
    questions,
    bySubtopic: subtopicOrder.map((subtopic) => ({
      subtopic,
      questions: subtopicMap.get(subtopic) ?? [],
    })),
    byDifficulty: DIFFICULTY_ORDER.map((difficulty) => ({
      difficulty,
      questions: questions.filter((q) => q.difficulty === difficulty),
    })),
    counts: {
      total: questions.length,
      written: questions.filter((q) => q.written).length,
      easy: questions.filter((q) => q.difficulty === "EASY").length,
      medium: questions.filter((q) => q.difficulty === "MEDIUM").length,
      hard: questions.filter((q) => q.difficulty === "HARD").length,
    },
  };
});

/** Include clause shared by every full-content read. */
const DETAIL_INCLUDE = {
  solutions: { orderBy: { language: "asc" } },
  topic: { include: { category: { include: { role: true } } } },
} satisfies Prisma.QuestionInclude;

type DetailRow = Prisma.QuestionGetPayload<{ include: typeof DETAIL_INCLUDE }>;

const toDetail = (row: DetailRow): QuestionDetail => {
  const { topic } = row;
  const { category } = topic;
  const { role } = category;

  return {
    ...toSummary({
      slug: row.slug,
      number: row.number,
      title: row.title,
      difficulty: row.difficulty,
      type: row.type,
      collection: row.collection,
      subtopic: row.subtopic,
      synopsis: row.synopsis,
      tags: row.tags,
      languages: row.languages,
      order: row.order,
      interviewTip: row.interviewTip,
      approach: row.approach,
      shortAnswer: row.shortAnswer,
      _count: { solutions: row.solutions.length },
    }),
    leetcodeUrl: row.leetcodeUrl,
    shortAnswer: row.shortAnswer,
    detailedExplanation: row.detailedExplanation,
    examples: (row.examples ?? []) as unknown as QuestionExample[],
    constraints: row.constraints,
    approach: row.approach,
    timeComplexity: row.timeComplexity,
    spaceComplexity: row.spaceComplexity,
    interviewTip: row.interviewTip,
    commonTrap: row.commonTrap,
    followUpQuestions: row.followUpQuestions,
    relatedTopics: row.relatedTopics,
    revisionSummary: row.revisionSummary,
    solutions: row.solutions.map((s) => ({ language: s.language, code: s.code })),
    context: {
      role: { slug: role.slug, name: role.name },
      category: { slug: category.slug, name: category.name },
      topic: { slug: topic.slug, name: topic.name, monogram: topic.monogram },
    },
  };
};

export const findBySlug = cache(async (slug: string): Promise<QuestionDetail | null> => {
  const row = await prisma.question.findUnique({
    where: { slug },
    include: DETAIL_INCLUDE,
  });
  return row ? toDetail(row) : null;
});

export interface TopicReader {
  /** Beginner → Intermediate → Advanced, each with full question content. */
  byDifficulty: { difficulty: Difficulty; questions: QuestionDetail[] }[];
  counts: { total: number; easy: number; medium: number; hard: number };
  /** True when the topic is theory rather than coding problems. */
  conceptual: boolean;
}

/**
 * Every question in a topic, with full content, for the inline reading view.
 *
 * Theory topics are read straight down the page like a chapter rather than
 * navigated one question at a time, so the whole topic is fetched at once. That
 * is deliberate but bounded: it is only used for conceptual topics, which hold
 * tens of questions, never the 150-problem DSA catalogue.
 */
export const findTopicReader = cache(
  async (roleSlug: string, topicSlug: string): Promise<TopicReader> => {
    const rows = await prisma.question.findMany({
      where: { topic: { slug: topicSlug, category: { role: { slug: roleSlug } } } },
      orderBy: { order: "asc" },
      include: DETAIL_INCLUDE,
    });

    const questions = rows.map(toDetail);

    return {
      byDifficulty: DIFFICULTY_ORDER.map((difficulty) => ({
        difficulty,
        questions: questions.filter((q) => q.difficulty === difficulty),
      })),
      counts: {
        total: questions.length,
        easy: questions.filter((q) => q.difficulty === "EASY").length,
        medium: questions.filter((q) => q.difficulty === "MEDIUM").length,
        hard: questions.filter((q) => q.difficulty === "HARD").length,
      },
      // A topic counts as conceptual when nothing in it is a coding problem.
      conceptual: questions.length > 0 && questions.every((q) => q.type !== "ALGORITHMIC"),
    };
  },
);

/** Previous / next within the same topic, for continuous reading. */
export async function getNeighbours(slug: string) {
  const current = await prisma.question.findUnique({
    where: { slug },
    select: { order: true, topicId: true },
  });
  if (!current) return { previous: null, next: null };

  const [previous, next] = await Promise.all([
    prisma.question.findFirst({
      where: { topicId: current.topicId, order: { lt: current.order } },
      orderBy: { order: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.question.findFirst({
      where: { topicId: current.topicId, order: { gt: current.order } },
      orderBy: { order: "asc" },
      select: { slug: true, title: true },
    }),
  ]);

  return { previous, next };
}

/**
 * Related questions, subtopic matches first.
 *
 * Ranking matters here: a shared subtopic ("Intervals") is a far stronger
 * signal than a shared tag, since broad tags like "Greedy" would otherwise
 * pull in unrelated problems.
 */
export async function findRelated(slug: string, limit = 4): Promise<QuestionSummary[]> {
  const current = await prisma.question.findUnique({
    where: { slug },
    select: { subtopic: true, topicId: true, tags: true },
  });
  if (!current) return [];

  const ordering: Prisma.QuestionOrderByWithRelationInput[] = [
    { interviewTip: { sort: "desc", nulls: "last" } },
    { order: "asc" },
  ];

  const sameSubtopic = current.subtopic
    ? await prisma.question.findMany({
        where: { topicId: current.topicId, slug: { not: slug }, subtopic: current.subtopic },
        orderBy: ordering,
        take: limit,
        select: SUMMARY_SELECT,
      })
    : [];

  if (sameSubtopic.length >= limit) return sameSubtopic.map(toSummary);

  // Top up with tag matches from elsewhere in the topic.
  const seen = new Set(sameSubtopic.map((row) => row.slug));
  const byTag = current.tags.length
    ? await prisma.question.findMany({
        where: {
          topicId: current.topicId,
          slug: { notIn: [slug, ...seen] },
          tags: { hasSome: current.tags },
        },
        orderBy: ordering,
        take: limit - sameSubtopic.length,
        select: SUMMARY_SELECT,
      })
    : [];

  return [...sameSubtopic, ...byTag].map(toSummary);
}

export interface SearchHit {
  slug: string;
  title: string;
  difficulty: Difficulty;
  type: QuestionType;
  topicName: string;
  topicSlug: string;
  subtopic: string | null;
  synopsis: string;
  roleSlug: string;
}

/** Command palette search across every question. */
export async function searchQuestions(query: string, limit = 8): Promise<SearchHit[]> {
  const needle = query.trim();

  const rows = await prisma.question.findMany({
    where: needle
      ? {
          OR: [
            { title: { contains: needle, mode: "insensitive" } },
            { synopsis: { contains: needle, mode: "insensitive" } },
            { subtopic: { contains: needle, mode: "insensitive" } },
            { tags: { hasSome: [needle] } },
          ],
        }
      : {},
    orderBy: [{ interviewTip: { sort: "desc", nulls: "last" } }, { order: "asc" }],
    take: limit,
    select: {
      slug: true,
      title: true,
      difficulty: true,
      type: true,
      subtopic: true,
      synopsis: true,
      topic: {
        select: {
          name: true,
          slug: true,
          category: { select: { role: { select: { slug: true } } } },
        },
      },
    },
  });

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    difficulty: row.difficulty,
    type: row.type,
    subtopic: row.subtopic,
    synopsis: row.synopsis,
    topicName: row.topic.name,
    topicSlug: row.topic.slug,
    roleSlug: row.topic.category.role.slug,
  }));
}

export interface SubtopicHit {
  subtopic: string;
  roleSlug: string;
  roleName: string;
  categoryName: string;
  topicSlug: string;
  topicName: string;
  count: number;
}

/**
 * Subtopic matches for the search results page.
 *
 * A concept like "HashMap" is a subtopic rather than a topic in this model, so
 * without this a search for it would return only individual questions and
 * never the place to study the whole group. Results link straight to the
 * filtered topic view.
 */
export async function searchSubtopics(query: string, limit = 6): Promise<SubtopicHit[]> {
  const needle = query.trim();
  if (!needle) return [];

  const rows = await prisma.question.findMany({
    where: { subtopic: { contains: needle, mode: "insensitive" } },
    orderBy: { order: "asc" },
    select: {
      subtopic: true,
      topic: {
        select: {
          slug: true,
          name: true,
          category: { select: { name: true, role: { select: { slug: true, name: true } } } },
        },
      },
    },
  });

  // Collapse the question rows into one entry per (topic, subtopic) pair.
  const groups = new Map<string, SubtopicHit>();
  for (const row of rows) {
    if (!row.subtopic) continue;
    const key = `${row.topic.slug}/${row.subtopic}`;
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      continue;
    }
    groups.set(key, {
      subtopic: row.subtopic,
      roleSlug: row.topic.category.role.slug,
      roleName: row.topic.category.role.name,
      categoryName: row.topic.category.name,
      topicSlug: row.topic.slug,
      topicName: row.topic.name,
      count: 1,
    });
  }

  return [...groups.values()].sort((a, b) => b.count - a.count).slice(0, limit);
}

/** Distinct subtopics for a topic, in study plan order. */
export async function listSubtopics(roleSlug: string, topicSlug: string): Promise<string[]> {
  const rows = await prisma.question.findMany({
    where: { topic: { slug: topicSlug, category: { role: { slug: roleSlug } } } },
    orderBy: { order: "asc" },
    select: { subtopic: true },
  });

  const seen: string[] = [];
  for (const row of rows) {
    if (row.subtopic && !seen.includes(row.subtopic)) seen.push(row.subtopic);
  }
  return seen;
}
