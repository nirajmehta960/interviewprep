import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { roles as staticRoles } from "@/lib/data/hierarchy";

/**
 * Role / Category / Topic reads.
 *
 * Everything the navigation renders comes from here — the shell has no
 * hardcoded topic list, so seeding a new topic makes it appear in the sidebar.
 */

export interface NavTopic {
  slug: string;
  name: string;
  monogram: string;
  blurb: string;
  questionCount: number;
}

export interface NavCategory {
  slug: string;
  name: string;
  topics: NavTopic[];
}

export interface NavRole {
  slug: string;
  name: string;
  description: string;
  highlights: string[];
  categories: NavCategory[];
  questionCount: number;
}

/** The full navigation tree for one role. */
export const getRoleTree = cache(async (roleSlug: string): Promise<NavRole | null> => {
  try {
    const role = await prisma.role.findUnique({
      where: { slug: roleSlug },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: {
            topics: {
              orderBy: { order: "asc" },
              include: { _count: { select: { questions: true } } },
            },
          },
        },
      },
    });

    if (role) {
      const categories: NavCategory[] = role.categories.map((category) => ({
        slug: category.slug,
        name: category.name,
        topics: category.topics.map((topic) => ({
          slug: topic.slug,
          name: topic.name,
          monogram: topic.monogram,
          blurb: topic.blurb,
          questionCount: topic._count.questions,
        })),
      }));

      return {
        slug: role.slug,
        name: role.name,
        description: role.description,
        highlights: role.highlights,
        categories,
        questionCount: categories.reduce(
          (sum, category) => sum + category.topics.reduce((n, topic) => n + topic.questionCount, 0),
          0,
        ),
      };
    }
  } catch (err) {
    console.warn("Database unavailable in getRoleTree, using static fallback:", err);
  }

  const staticRole = staticRoles.find((r) => r.slug === roleSlug);
  if (!staticRole) return null;

  return {
    slug: staticRole.slug,
    name: staticRole.name,
    description: staticRole.description,
    highlights: staticRole.highlights,
    categories: staticRole.categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      topics: c.topics.map((t) => ({
        slug: t.slug,
        name: t.name,
        monogram: t.monogram,
        blurb: t.blurb,
        questionCount: 10,
      })),
    })),
    questionCount: 150,
  };
});

/** Every role, for the switcher and the role selection screen. */
export const listRoles = cache(async () => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { order: "asc" },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: { topics: { include: { _count: { select: { questions: true } } } } },
        },
      },
    });

    if (roles.length > 0) {
      return roles.map((role) => ({
        slug: role.slug,
        name: role.name,
        description: role.description,
        highlights: role.highlights,
        topicCount: role.categories.reduce((sum, c) => sum + c.topics.length, 0),
        questionCount: role.categories.reduce(
          (sum, c) => sum + c.topics.reduce((n, t) => n + t._count.questions, 0),
          0,
        ),
      }));
    }
  } catch (err) {
    console.warn("Database unavailable in listRoles, using static fallback:", err);
  }

  return staticRoles.map((role) => ({
    slug: role.slug,
    name: role.name,
    description: role.description,
    highlights: role.highlights,
    topicCount: role.categories.reduce((sum, c) => sum + c.topics.length, 0),
    questionCount: role.slug === "software-engineer" ? 150 : 25,
  }));
});

export interface TopicContext {
  role: { slug: string; name: string };
  category: { slug: string; name: string };
  topic: {
    slug: string;
    name: string;
    monogram: string;
    blurb: string;
    questionCount: number;
  };
}

/** A topic plus its ancestors, for breadcrumbs and headers. */
export const getTopicContext = cache(async (
  roleSlug: string,
  topicSlug: string,
): Promise<TopicContext | null> => {
  try {
    const topic = await prisma.topic.findFirst({
      where: { slug: topicSlug, category: { role: { slug: roleSlug } } },
      include: {
        _count: { select: { questions: true } },
        category: { include: { role: true } },
      },
    });

    if (topic) {
      return {
        role: { slug: topic.category.role.slug, name: topic.category.role.name },
        category: { slug: topic.category.slug, name: topic.category.name },
        topic: {
          slug: topic.slug,
          name: topic.name,
          monogram: topic.monogram,
          blurb: topic.blurb,
          questionCount: topic._count.questions,
        },
      };
    }
  } catch (err) {
    console.warn("Database unavailable in getTopicContext, using static fallback:", err);
  }

  const role = staticRoles.find((r) => r.slug === roleSlug);
  if (!role) return null;
  for (const cat of role.categories) {
    const top = cat.topics.find((t) => t.slug === topicSlug);
    if (top) {
      return {
        role: { slug: role.slug, name: role.name },
        category: { slug: cat.slug, name: cat.name },
        topic: {
          slug: top.slug,
          name: top.name,
          monogram: top.monogram,
          blurb: top.blurb,
          questionCount: 10,
        },
      };
    }
  }
  return null;
});

export interface TopicHit {
  roleSlug: string;
  roleName: string;
  categoryName: string;
  slug: string;
  name: string;
  monogram: string;
  blurb: string;
  questionCount: number;
}

/**
 * Topic matches for the search results page.
 *
 * Searched separately from questions because the two answer different needs:
 * "HashMap" should offer both the place to study it and the specific questions
 * about it, and collapsing them into one ranked list buries the topic.
 */
export async function searchTopics(query: string, limit = 6): Promise<TopicHit[]> {
  const needle = query.trim();
  if (!needle) return [];

  const topics = await prisma.topic.findMany({
    where: {
      OR: [
        { name: { contains: needle, mode: "insensitive" } },
        { blurb: { contains: needle, mode: "insensitive" } },
        { category: { name: { contains: needle, mode: "insensitive" } } },
      ],
    },
    orderBy: { order: "asc" },
    take: limit,
    include: {
      _count: { select: { questions: true } },
      category: { include: { role: true } },
    },
  });

  // Topics with content first — an empty scaffold is a poor top result.
  return topics
    .map((topic) => ({
      roleSlug: topic.category.role.slug,
      roleName: topic.category.role.name,
      categoryName: topic.category.name,
      slug: topic.slug,
      name: topic.name,
      monogram: topic.monogram,
      blurb: topic.blurb,
      questionCount: topic._count.questions,
    }))
    .sort((a, b) => b.questionCount - a.questionCount);
}

/** Every role/topic pair, used to resolve a topic without knowing its role. */
export async function findTopicRole(topicSlug: string) {
  const topic = await prisma.topic.findFirst({
    where: { slug: topicSlug },
    include: { category: { include: { role: true } } },
  });
  return topic?.category.role.slug ?? null;
}
