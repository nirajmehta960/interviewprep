import type { Collection, Difficulty, Language, Prisma, QuestionType } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { allModularQuestions } from "@/lib/data/topics";
import { problems as staticProblems } from "@/lib/data";

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
  try {
    const rows = await prisma.question.findMany({
      where: buildWhere(filters),
      orderBy: [{ order: "asc" }],
      select: SUMMARY_SELECT,
    });
    return rows.map(toSummary);
  } catch (err) {
    console.warn("Database error in findQuestions:", err);
    return [];
  }
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

function getStaticDetailBySlug(slug: string): QuestionDetail | null {
  const q = allModularQuestions.find((item) => item.slug === slug);
  if (q) {
    return {
      slug: q.slug,
      number: null,
      title: q.title,
      difficulty: (q.difficulty ?? "EASY") as Difficulty,
      type: "CONCEPTUAL" as QuestionType,
      collection: "CORE" as Collection,
      subtopic: q.subtopic ?? null,
      synopsis: q.synopsis,
      tags: q.tags ?? [],
      languages: ["JAVA", "PYTHON"] as Language[],
      order: 1,
      written: true,
      leetcodeUrl: null,
      shortAnswer: q.shortAnswer ?? null,
      detailedExplanation: q.detailedExplanation ?? [],
      examples: [],
      constraints: [],
      approach: [],
      timeComplexity: null,
      spaceComplexity: null,
      interviewTip: q.interviewTip ?? null,
      commonTrap: q.commonTrap ?? null,
      followUpQuestions: q.followUpQuestions ?? [],
      relatedTopics: q.relatedTopics ?? [],
      revisionSummary: [],
      solutions: [],
      context: {
        role: { slug: "software-engineer", name: "Software Engineer" },
        category: { slug: "languages", name: "Languages" },
        topic: { slug: q.topicSlug, name: q.topicSlug.toUpperCase(), monogram: q.topicSlug.substring(0, 2).toUpperCase() },
      },
    };
  }

  const p = staticProblems.find((item) => item.slug === slug);
  if (p) {
    return {
      slug: p.slug,
      number: p.number ?? null,
      title: p.title,
      difficulty: p.difficulty as Difficulty,
      type: "ALGORITHMIC" as QuestionType,
      collection: (p.collection ?? "CORE") as Collection,
      subtopic: p.patternSlugs[0] ?? null,
      synopsis: p.synopsis,
      tags: p.patternSlugs ?? [],
      languages: ["JAVA", "PYTHON"] as Language[],
      order: 1,
      written: true,
      leetcodeUrl: p.leetcodeUrl ?? null,
      shortAnswer: p.intuition ?? null,
      detailedExplanation: p.description ?? [],
      examples: (p.examples ?? []) as unknown as QuestionExample[],
      constraints: p.constraints ?? [],
      approach: p.approach ?? [],
      timeComplexity: p.timeComplexity ?? null,
      spaceComplexity: p.spaceComplexity ?? null,
      interviewTip: p.keyTakeaway ?? null,
      commonTrap: p.criticalTrap ?? null,
      followUpQuestions: [],
      relatedTopics: p.patternSlugs ?? [],
      revisionSummary: p.revisionSummary ?? [],
      solutions: p.solutions?.map((s) => ({ language: s.language as Language, code: s.code })) ?? [],
      context: {
        role: { slug: "software-engineer", name: "Software Engineer" },
        category: { slug: "cs-fundamentals", name: "CS Fundamentals" },
        topic: { slug: "dsa", name: "Data Structures & Algorithms", monogram: "DS" },
      },
    };
  }

  return null;
}

function getStaticTopicQuestions(topicSlug: string): QuestionDetail[] {
  const conceptual = allModularQuestions.filter((q) => q.topicSlug === topicSlug);
  if (conceptual.length > 0) {
    return conceptual.map((q, idx) => ({
      slug: q.slug,
      number: null,
      title: q.title,
      difficulty: (q.difficulty ?? "EASY") as Difficulty,
      type: "CONCEPTUAL" as QuestionType,
      collection: "CORE" as Collection,
      subtopic: q.subtopic ?? null,
      synopsis: q.synopsis,
      tags: q.tags ?? [],
      languages: ["JAVA", "PYTHON"] as Language[],
      order: idx + 1,
      written: true,
      leetcodeUrl: null,
      shortAnswer: q.shortAnswer ?? null,
      detailedExplanation: q.detailedExplanation ?? [],
      examples: [],
      constraints: [],
      approach: [],
      timeComplexity: null,
      spaceComplexity: null,
      interviewTip: q.interviewTip ?? null,
      commonTrap: q.commonTrap ?? null,
      followUpQuestions: q.followUpQuestions ?? [],
      relatedTopics: q.relatedTopics ?? [],
      revisionSummary: [],
      solutions: [],
      context: {
        role: { slug: "software-engineer", name: "Software Engineer" },
        category: { slug: "languages", name: "Languages" },
        topic: { slug: topicSlug, name: topicSlug.toUpperCase(), monogram: topicSlug.substring(0, 2).toUpperCase() },
      },
    }));
  }

  const dsa = staticProblems;
  return dsa.map((p, idx) => ({
    slug: p.slug,
    number: p.number ?? null,
    title: p.title,
    difficulty: p.difficulty as Difficulty,
    type: "ALGORITHMIC" as QuestionType,
    collection: (p.collection ?? "CORE") as Collection,
    subtopic: p.patternSlugs[0] ?? null,
    synopsis: p.synopsis,
    tags: p.patternSlugs ?? [],
    languages: ["JAVA", "PYTHON"] as Language[],
    order: idx + 1,
    written: true,
    leetcodeUrl: p.leetcodeUrl ?? null,
    shortAnswer: p.intuition ?? null,
    detailedExplanation: p.description ?? [],
    examples: (p.examples ?? []) as unknown as QuestionExample[],
    constraints: p.constraints ?? [],
    approach: p.approach ?? [],
    timeComplexity: p.timeComplexity ?? null,
    spaceComplexity: p.spaceComplexity ?? null,
    interviewTip: p.keyTakeaway ?? null,
    commonTrap: p.criticalTrap ?? null,
    followUpQuestions: [],
    relatedTopics: p.patternSlugs ?? [],
    revisionSummary: p.revisionSummary ?? [],
    solutions: p.solutions?.map((s) => ({ language: s.language as Language, code: s.code })) ?? [],
    context: {
      role: { slug: "software-engineer", name: "Software Engineer" },
      category: { slug: "cs-fundamentals", name: "CS Fundamentals" },
      topic: { slug: "dsa", name: "Data Structures & Algorithms", monogram: "DS" },
    },
  }));
}

export const findBySlug = cache(async (slug: string): Promise<QuestionDetail | null> => {
  try {
    const row = await prisma.question.findUnique({
      where: { slug },
      include: DETAIL_INCLUDE,
    });
    if (row) return toDetail(row);
  } catch (err) {
    console.warn("Database unavailable in findBySlug, using static fallback:", err);
  }
  return getStaticDetailBySlug(slug);
});

export interface TopicReader {
  /** Beginner → Intermediate → Advanced, each with full question content. */
  byDifficulty: { difficulty: Difficulty; questions: QuestionDetail[] }[];
  counts: { total: number; easy: number; medium: number; hard: number };
  /** True when the topic is theory rather than coding problems. */
  conceptual: boolean;
}

export const findTopicReader = cache(
  async (roleSlug: string, topicSlug: string): Promise<TopicReader> => {
    let questions: QuestionDetail[] = [];
    try {
      const rows = await prisma.question.findMany({
        where: { topic: { slug: topicSlug, category: { role: { slug: roleSlug } } } },
        orderBy: { order: "asc" },
        include: DETAIL_INCLUDE,
      });
      if (rows.length > 0) {
        questions = rows.map(toDetail);
      }
    } catch (err) {
      console.warn("Database unavailable in findTopicReader, using static fallback:", err);
    }

    if (questions.length === 0) {
      questions = getStaticTopicQuestions(topicSlug);
    }

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
      conceptual: questions.length > 0 && questions.every((q) => q.type !== "ALGORITHMIC"),
    };
  },
);

/** Previous / next within the same topic, for continuous reading. */
export async function getNeighbours(slug: string) {
  try {
    const current = await prisma.question.findUnique({
      where: { slug },
      select: { order: true, topicId: true },
    });
    if (current) {
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
  } catch (err) {
    console.warn("Database unavailable in getNeighbours:", err);
  }
  return { previous: null, next: null };
}

export async function findRelated(slug: string, limit = 4): Promise<QuestionSummary[]> {
  try {
    const current = await prisma.question.findUnique({
      where: { slug },
      select: { subtopic: true, topicId: true, tags: true },
    });
    if (current) {
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
  } catch (err) {
    console.warn("Database unavailable in findRelated:", err);
  }
  return [];
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

export async function searchQuestions(query: string, limit = 8): Promise<SearchHit[]> {
  const needle = query.trim().toLowerCase();
  try {
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

    if (rows.length > 0) {
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
  } catch (err) {
    console.warn("Database unavailable in searchQuestions, using static search:", err);
  }

  return allModularQuestions
    .filter((q) => !needle || q.title.toLowerCase().includes(needle) || q.synopsis.toLowerCase().includes(needle))
    .slice(0, limit)
    .map((q) => ({
      slug: q.slug,
      title: q.title,
      difficulty: (q.difficulty ?? "EASY") as Difficulty,
      type: "CONCEPTUAL" as QuestionType,
      topicName: q.topicSlug.toUpperCase(),
      topicSlug: q.topicSlug,
      subtopic: q.subtopic ?? null,
      synopsis: q.synopsis,
      roleSlug: "software-engineer",
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

export async function searchSubtopics(query: string, limit = 6): Promise<SubtopicHit[]> {
  const needle = query.trim();
  if (!needle) return [];

  try {
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

    if (groups.size > 0) {
      return [...groups.values()].sort((a, b) => b.count - a.count).slice(0, limit);
    }
  } catch (err) {
    console.warn("Database unavailable in searchSubtopics:", err);
  }

  return [];
}

export async function listSubtopics(roleSlug: string, topicSlug: string): Promise<string[]> {
  try {
    const rows = await prisma.question.findMany({
      where: { topic: { slug: topicSlug, category: { role: { slug: roleSlug } } } },
      orderBy: { order: "asc" },
      select: { subtopic: true },
    });

    const seen: string[] = [];
    for (const row of rows) {
      if (row.subtopic && !seen.includes(row.subtopic)) seen.push(row.subtopic);
    }
    if (seen.length > 0) return seen;
  } catch (err) {
    console.warn("Database unavailable in listSubtopics, using static fallback:", err);
  }

  const staticQuestions = allModularQuestions.filter((q) => q.topicSlug === topicSlug);
  const seen: string[] = [];
  for (const q of staticQuestions) {
    if (q.subtopic && !seen.includes(q.subtopic)) seen.push(q.subtopic);
  }
  return seen;
}
