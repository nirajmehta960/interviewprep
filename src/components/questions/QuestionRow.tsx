import Link from "next/link";
import { cn } from "@/lib/cn";
import { Chip } from "@/components/ui/Tag";
import { LANGUAGE_LABEL } from "@/lib/types";
import type { QuestionSummary } from "@/server/repositories/question.repository";

/**
 * One clickable question in a coding-problem list.
 *
 * A card rather than a ruled row: the platform register treats each problem as
 * a discrete destination, and the hover lift makes the whole block read as the
 * hit target. Only used for algorithmic topics — theory questions render their
 * answer inline instead, via `QuestionArticle`.
 */
export function QuestionRow({
  question,
  position,
  showSubtopic = true,
}: {
  question: QuestionSummary;
  position: number;
  showSubtopic?: boolean;
}) {
  return (
    <li className="mb-2.5 list-none">
      <Link
        href={`/questions/${question.slug}`}
        className="group flex items-start gap-4 rounded-card border border-rule bg-card px-4 py-3.5 shadow-card transition-all hover:border-brand/40 hover:shadow-card-hover"
      >
        <span className="marker-num mt-[3px] w-5 shrink-0 text-right">{position}</span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span
              className={cn(
                "text-[16px] font-medium leading-snug transition-colors",
                question.written
                  ? "text-ink group-hover:text-brand"
                  : "text-ink-2 group-hover:text-ink",
              )}
            >
              {question.title}
            </span>
            {!question.written ? (
              <span className="font-sans text-[11px] tracking-[0.04em] text-ink-4 uppercase">
                outline
              </span>
            ) : null}
          </span>

          {question.synopsis ? (
            <span className="mt-1 block max-w-[76ch] text-[13px] leading-relaxed text-ink-3">
              {question.synopsis}
            </span>
          ) : null}

          {showSubtopic && question.subtopic ? (
            <span className="mt-2 flex flex-wrap items-center gap-2">
              <Chip>{question.subtopic}</Chip>
              {/* Only worth showing when there is a choice to make. On a Java
                  page a "java" chip on every row is noise. */}
              {question.languages.length > 1
                ? question.languages.map((language) => (
                    <Chip key={language}>{LANGUAGE_LABEL[language]}</Chip>
                  ))
                : null}
            </span>
          ) : null}
        </span>

        <span
          aria-hidden
          className="mt-[3px] shrink-0 text-ink-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand"
        >
          →
        </span>
      </Link>
    </li>
  );
}
