import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow, SectionKicker } from "@/components/ui/Section";
import { Chip, DifficultyTag } from "@/components/ui/Tag";
import { SearchField } from "@/components/layout/SearchField";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { searchQuestions, searchSubtopics } from "@/server/repositories/question.repository";
import { searchTopics } from "@/server/repositories/taxonomy.repository";
import { questionHref } from "@/lib/routes";
import { DIFFICULTY_STUDY_LABEL } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — InterviewPrep",
  description: "Search interview questions, topics, and concepts.",
};

/**
 * Full search results.
 *
 * The command palette handles the fast case; this page is the one you land on
 * when the answer was not in the first eight hits, so it separates topics from
 * questions and shows enough of each to judge relevance without opening it.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const { q } = (await searchParams) ?? {};
  const query = q?.trim() ?? "";

  const [topics, subtopics, questions] = query
    ? await Promise.all([
        searchTopics(query, 6),
        searchSubtopics(query, 6),
        searchQuestions(query, 40),
      ])
    : [[], [], []];

  const total = topics.length + subtopics.length + questions.length;

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between gap-6 border-b border-rule px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-control bg-brand text-[14px] font-bold leading-none text-paper">
            I
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.01em]">
            <span className="text-ink">Interview</span>
            <span className="text-brand">Prep</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-[880px] px-4 py-12 sm:px-8">
        <SectionKicker index={1} label="Search" className="mb-4" />
        <h1 className="text-[34px] leading-tight">Search the notebook</h1>

        <div className="mt-6">
          <SearchField initialQuery={query} autoFocus />
        </div>

        {query ? (
          <p className="mt-4 text-[13px] text-ink-3">
            <span className="text-ink tabular-nums">{total}</span>{" "}
            {total === 1 ? "result" : "results"} for{" "}
            <span className="text-ink">&ldquo;{query}&rdquo;</span>
          </p>
        ) : (
          <p className="mt-4 max-w-[54ch] text-[13.5px] leading-relaxed text-ink-3">
            Search across every question, topic, and concept in the notebook. Press{" "}
            <span className="code-chip">⌘K</span> anywhere in the app for the quick palette.
          </p>
        )}

        {query && total === 0 ? (
          <div className="mt-10 border border-dashed border-rule bg-paper-sunken/40 px-6 py-10 text-center">
            <Eyebrow>No matches</Eyebrow>
            <p className="mx-auto mt-3 max-w-[46ch] text-[14px] leading-relaxed text-ink-2">
              Nothing matched &ldquo;{query}&rdquo;. Try a shorter term, or a concept name like{" "}
              <span className="code-chip">HashMap</span> or{" "}
              <span className="code-chip">polymorphism</span>.
            </p>
          </div>
        ) : null}

        {topics.length + subtopics.length > 0 ? (
          <section className="mt-12">
            <header className="mb-4 flex items-baseline justify-between gap-4 border-b border-rule pb-2.5">
              <h2 className="text-[21px]">Topics</h2>
              <Eyebrow>{topics.length + subtopics.length}</Eyebrow>
            </header>

            <ul>
              {/* Concept-level matches, shown as the full path to the material:
                  Software Engineer / Java / Collections → HashMap. */}
              {subtopics.map((hit) => (
                <li key={`${hit.topicSlug}-${hit.subtopic}`} className="border-b border-rule-soft">
                  <Link
                    href={`/roles/${hit.roleSlug}/${hit.topicSlug}?sub=${encodeURIComponent(hit.subtopic)}`}
                    className="group flex items-start gap-3.5 py-3.5 transition-colors hover:bg-paper-sunken/50"
                  >
                    <span
                      className="mt-[2px] flex size-[26px] shrink-0 items-center justify-center border border-rule bg-paper-sunken font-sans text-[11px] text-ink-3"
                      aria-hidden
                    >
                      ↳
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block font-sans text-[11.5px] tracking-[0.04em] text-ink-3 uppercase">
                        {hit.roleName} / {hit.topicName}
                      </span>
                      <span className="mt-1 block text-[15px] text-ink transition-colors group-hover:text-brand">
                        {hit.subtopic}
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-ink-3">
                        {hit.count} {hit.count === 1 ? "question" : "questions"} in{" "}
                        {hit.topicName} → {hit.subtopic}
                      </span>
                    </span>

                    <span className="shrink-0 pt-1 font-sans text-[11.5px] tabular-nums text-ink-4">
                      {hit.count} q
                    </span>
                  </Link>
                </li>
              ))}

              {topics.map((topic) => (
                <li key={`${topic.roleSlug}-${topic.slug}`} className="border-b border-rule-soft">
                  <Link
                    href={`/roles/${topic.roleSlug}/${topic.slug}`}
                    className="group flex items-start gap-3.5 py-3.5 transition-colors hover:bg-paper-sunken/50"
                  >
                    <span
                      className="mt-[2px] flex size-[26px] shrink-0 items-center justify-center border border-rule bg-paper-sunken font-sans text-[11px] text-ink-3"
                      aria-hidden
                    >
                      {topic.monogram}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[11.5px] font-sans tracking-[0.04em] text-ink-3 uppercase">
                        {topic.roleName} / {topic.categoryName}
                      </span>
                      <span className="mt-1 block text-[15px] text-ink transition-colors group-hover:text-brand">
                        {topic.name}
                      </span>
                      <span className="mt-1 block max-w-[64ch] text-[13px] leading-relaxed text-ink-3">
                        {topic.blurb}
                      </span>
                    </span>

                    <span className="shrink-0 pt-1 font-sans text-[11.5px] tabular-nums text-ink-4">
                      {topic.questionCount > 0 ? `${topic.questionCount} q` : "soon"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {questions.length > 0 ? (
          <section className="mt-12">
            <header className="mb-4 flex items-baseline justify-between gap-4 border-b border-rule pb-2.5">
              <h2 className="text-[21px]">Interview questions</h2>
              <Eyebrow>{questions.length}</Eyebrow>
            </header>

            <ul>
              {questions.map((hit) => (
                <li key={hit.slug} className="border-b border-rule-soft">
                  <Link
                    href={questionHref({
                      slug: hit.slug,
                      type: hit.type,
                      difficulty: hit.difficulty,
                      roleSlug: hit.roleSlug,
                      topicSlug: hit.topicSlug,
                    })}
                    className="group block py-3.5 transition-colors hover:bg-paper-sunken/50"
                  >
                    <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="text-[15px] leading-snug text-ink transition-colors group-hover:text-brand">
                        {hit.title}
                      </span>
                      <DifficultyTag difficulty={hit.difficulty} className="text-[11.5px]" />
                    </span>

                    {hit.synopsis ? (
                      <span className="mt-1 block max-w-[70ch] text-[13px] leading-relaxed text-ink-3">
                        {hit.synopsis}
                      </span>
                    ) : null}

                    <span className="mt-2 flex flex-wrap items-center gap-1.5">
                      <Chip>{hit.topicName}</Chip>
                      {hit.subtopic ? <Chip>{hit.subtopic}</Chip> : null}
                      <Chip>{DIFFICULTY_STUDY_LABEL[hit.difficulty]}</Chip>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}
