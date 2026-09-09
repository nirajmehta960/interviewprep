import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, DocPage } from "@/components/layout/DocShell";
import { Eyebrow, SectionKicker } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Tag";
import { Inline } from "@/components/ui/Prose";
import { QuestionRow } from "@/components/questions/QuestionRow";
import { QuestionArticle } from "@/components/questions/QuestionArticle";
import { LevelTabs } from "@/components/questions/LevelTabs";
import { SubtopicNav } from "@/components/questions/SubtopicNav";
import { ReadingTOC, type TocEntry } from "@/components/questions/ReadingTOC";
import { getTopicContext } from "@/server/repositories/taxonomy.repository";
import { findByTopic, findTopicReader } from "@/server/repositories/question.repository";
import { LEVEL_FROM_SLUG } from "@/lib/routes";
import {
  DIFFICULTY_ORDER,
  DIFFICULTY_STUDY_BLURB,
  DIFFICULTY_STUDY_LABEL,
  type Difficulty,
} from "@/lib/types";

export const dynamic = "force-dynamic";

interface TopicParams {
  params: Promise<{ role: string; topic: string }>;
  searchParams?: Promise<{ sub?: string; level?: string }>;
}

export async function generateMetadata({ params }: TopicParams): Promise<Metadata> {
  const { role, topic } = await params;
  const context = await getTopicContext(role, topic);
  if (!context) return { title: "Topic not found — InterviewPrep" };

  return {
    title: `${context.topic.name} interview questions — InterviewPrep`,
    description: context.topic.blurb,
  };
}

/**
 * Topic page. Two presentations, chosen by what the topic holds.
 *
 * **Theory topics** (Java, Python, OOP, DBMS…) render as one continuous
 * document: level tabs across the top, then every question with its full answer
 * inline, read top to bottom like a chapter. Giving each theory question its own
 * route would mean hundreds of pages holding four paragraphs each, and would
 * make revising a whole topic a hundred-click exercise.
 *
 * **Problem topics** (DSA) keep the index-plus-detail shape, because a coding
 * problem is a workspace — solution listings, complexity, a trace workbench —
 * and forty of those on one page is unreadable.
 */
export default async function TopicPage({ params, searchParams }: TopicParams) {
  const { role: roleSlug, topic: topicSlug } = await params;
  const { sub, level } = (await searchParams) ?? {};

  const context = await getTopicContext(roleSlug, topicSlug);
  if (!context) notFound();

  const reader = await findTopicReader(roleSlug, topicSlug);
  const basePath = `/roles/${roleSlug}/${topicSlug}`;

  const header = (
    <>
      <SectionKicker index={1} label={context.category.name} className="mb-4" />

      <div className="flex items-start gap-4">
        <span
          className="mt-1.5 flex size-9 shrink-0 items-center justify-center border border-rule bg-paper-sunken font-sans text-[11px] tracking-[0.04em] text-ink-3"
          aria-hidden
        >
          {context.topic.monogram}
        </span>
        <div className="min-w-0">
          <h1 className="text-[40px] leading-[1.08]">
            {context.topic.name} Interview Questions
          </h1>
          <p className="mt-3 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
            {context.topic.blurb}
          </p>
        </div>
      </div>
    </>
  );

  const crumbs = [
    { label: "Roles", href: "/" },
    { label: context.role.name, href: `/roles/${context.role.slug}` },
    { label: context.category.name },
    { label: context.topic.name },
  ];

  /* ---------------------------------------------------------------- empty */

  if (reader.counts.total === 0) {
    return (
      <>
        <Breadcrumbs crumbs={crumbs} />
        <DocPage>
          {header}
          <div className="mt-10 border border-dashed border-rule bg-paper-sunken/40 px-6 py-10 text-center">
            <Eyebrow>Not yet written</Eyebrow>
            <p className="mx-auto mt-3 max-w-[48ch] text-[14px] leading-relaxed text-ink-2">
              This topic is scaffolded but has no questions yet. The hierarchy is in place, so
              questions appear here as soon as they are seeded.
            </p>
            <Link
              href={`/roles/${context.role.slug}`}
              className="link-quiet mt-5 inline-block text-[13px] text-brand"
            >
              Back to {context.role.name}
            </Link>
          </div>
        </DocPage>
      </>
    );
  }

  /* ------------------------------------------------- theory: inline reader */

  if (reader.conceptual) {
    const activeLevel = level ? LEVEL_FROM_SLUG[level] : undefined;

    // An unknown ?level= falls back to All rather than 404-ing, so a stale
    // bookmark still lands somewhere useful.
    const shownLevels = reader.byDifficulty.filter(
      (group) =>
        group.questions.length > 0 && (activeLevel === undefined || group.difficulty === activeLevel),
    );

    const toc: TocEntry[] = shownLevels.flatMap((group) =>
      group.questions.map((question) => ({ id: question.slug, label: question.title })),
    );

    const counts: Record<Difficulty, number> = {
      EASY: reader.counts.easy,
      MEDIUM: reader.counts.medium,
      HARD: reader.counts.hard,
    };

    return (
      <>
        <Breadcrumbs
          crumbs={crumbs}
          meta={[`${reader.counts.total} questions`, "reading view"]}
        />

        <div className="mx-auto flex w-full min-w-0 max-w-[1480px] gap-12 px-4 py-10 sm:px-8 xl:px-12">
          <div className="w-full min-w-0 flex-1">
            {header}

            <LevelTabs
              basePath={basePath}
              active={activeLevel}
              counts={counts}
              total={reader.counts.total}
            />

            {shownLevels.map((group) => (
              <section key={group.difficulty} className="mt-12">
                <header className="border-b border-rule pb-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <h2 className="text-[26px] leading-tight">
                      {DIFFICULTY_STUDY_LABEL[group.difficulty]}
                    </h2>
                    <Eyebrow>{group.questions.length} questions</Eyebrow>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-ink-3">
                    {DIFFICULTY_STUDY_BLURB[group.difficulty]}
                  </p>
                </header>

                {group.questions.map((question, index) => (
                  <article
                    key={question.slug}
                    id={question.slug}
                    /* Clears the sticky breadcrumb *and* level tabs when an
                       anchor from search or a redirect lands here. */
                    className="scroll-mt-[152px] border-b border-rule py-9 last:border-b-0 lg:scroll-mt-[104px]"
                  >
                    <header>
                      <div className="flex items-baseline gap-3">
                        <span className="marker-num shrink-0">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-[23px] leading-snug">{question.title}</h3>
                      </div>

                      {question.subtopic ? (
                        <div className="mt-2 flex flex-wrap items-center gap-2 pl-[26px]">
                          <Chip>{question.subtopic}</Chip>
                        </div>
                      ) : null}

                      {question.synopsis ? (
                        <p className="mt-3 pl-[26px] text-[14.5px] leading-relaxed text-ink-2">
                          <Inline text={question.synopsis} />
                        </p>
                      ) : null}
                    </header>

                    <div className="pl-[26px]">
                      <QuestionArticle question={question} variant="inline" />
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>

          <aside className="hidden w-[210px] shrink-0 xl:block">
            <ReadingTOC entries={toc} title="Questions" />
          </aside>
        </div>
      </>
    );
  }

  /* --------------------------------------------- problems: index + detail */

  const grouped = await findByTopic(roleSlug, topicSlug);
  const { counts, bySubtopic } = grouped;

  const subtopics = bySubtopic
    .filter((group) => group.subtopic !== "General")
    .map((group) => ({ name: group.subtopic, count: group.questions.length }));

  const active = subtopics.some((s) => s.name === sub) ? sub : undefined;

  const byDifficulty = active
    ? grouped.byDifficulty.map((group) => ({
        ...group,
        questions: group.questions.filter((question) => question.subtopic === active),
      }))
    : grouped.byDifficulty;

  const shown = byDifficulty.reduce((sum, group) => sum + group.questions.length, 0);

  return (
    <>
      <Breadcrumbs
        crumbs={crumbs}
        meta={[`${counts.total} questions`, `${counts.written} written up`]}
      />

      <DocPage>
        {header}

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {DIFFICULTY_ORDER.map((difficulty) => {
            const count =
              byDifficulty.find((g) => g.difficulty === difficulty)?.questions.length ?? 0;
            if (count === 0) return null;

            return (
              <Chip
                key={difficulty}
                tone={difficulty === "EASY" ? "brand" : difficulty === "MEDIUM" ? "warn" : "danger"}
              >
                {DIFFICULTY_STUDY_LABEL[difficulty]} · {count}
              </Chip>
            );
          })}
        </div>

        {subtopics.length > 1 ? (
          <SubtopicNav
            subtopics={subtopics}
            basePath={basePath}
            active={active}
            total={counts.total}
          />
        ) : null}

        {active ? (
          <p className="mt-4 text-[13px] text-ink-3">
            Showing <span className="text-ink tabular-nums">{shown}</span> of{" "}
            <span className="tabular-nums">{counts.total}</span> questions in{" "}
            <span className="text-ink">{active}</span>.
          </p>
        ) : null}

        {byDifficulty.map((group, index) => {
          if (group.questions.length === 0) return null;

          return (
            <section
              key={group.difficulty}
              id={`level-${group.difficulty.toLowerCase()}`}
              className="mt-14 scroll-mt-24"
            >
              <header className="mb-1 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-3">
                <div className="flex items-baseline gap-2.5">
                  <span className="marker-num">{String(index + 1).padStart(2, "0")}</span>
                  <h2 className="text-[26px] leading-tight">
                    {DIFFICULTY_STUDY_LABEL[group.difficulty]}
                  </h2>
                </div>
                <Eyebrow>{group.questions.length} questions</Eyebrow>
              </header>
              <p className="mb-2 text-[13.5px] text-ink-3">
                {DIFFICULTY_STUDY_BLURB[group.difficulty]}
              </p>

              <ol>
                {group.questions.map((question, position) => (
                  <QuestionRow
                    key={question.slug}
                    question={question}
                    position={position + 1}
                    showSubtopic={!active}
                  />
                ))}
              </ol>
            </section>
          );
        })}
      </DocPage>
    </>
  );
}
