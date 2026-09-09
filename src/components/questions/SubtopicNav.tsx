import Link from "next/link";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";

/**
 * Subtopic filter for a topic page.
 *
 * These are links carrying a `?sub=` query rather than client-side state, so a
 * filtered view is a real URL — shareable, bookmarkable, and restored on back.
 * Filtering beats anchor-jumping here because the page groups by difficulty:
 * a subtopic's questions are spread across all three levels, so there is no
 * single place to scroll to.
 */
export function SubtopicNav({
  subtopics,
  basePath,
  active,
  total,
}: {
  subtopics: { name: string; count: number }[];
  basePath: string;
  active?: string;
  total: number;
}) {
  return (
    <nav className="mt-8 border-y border-rule py-3" aria-label="Filter by subtopic">
      <Eyebrow className="mb-2.5 block">Jump to</Eyebrow>
      <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
        <li>
          <Link
            href={basePath}
            aria-current={!active ? "true" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
              !active
                ? "border-brand/40 bg-tint-brand text-brand"
                : "border-rule text-ink-3 hover:border-ink-4 hover:text-ink",
            )}
          >
            All
            <span className="tabular-nums opacity-70">{total}</span>
          </Link>
        </li>

        {subtopics.map((subtopic) => {
          const isActive = subtopic.name === active;

          return (
            <li key={subtopic.name}>
              <Link
                href={`${basePath}?sub=${encodeURIComponent(subtopic.name)}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "border-brand/40 bg-tint-brand text-brand"
                    : "border-rule text-ink-3 hover:border-ink-4 hover:text-ink",
                )}
              >
                {subtopic.name}
                <span className="tabular-nums opacity-70">{subtopic.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
