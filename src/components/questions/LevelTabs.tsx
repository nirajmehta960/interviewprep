import Link from "next/link";
import { cn } from "@/lib/cn";
import { LEVEL_PARAM, LEVEL_SLUG } from "@/lib/routes";
import { DIFFICULTY_ORDER, DIFFICULTY_STUDY_LABEL, type Difficulty } from "@/lib/types";

/**
 * Beginner / Intermediate / Advanced tabs for a theory topic.
 *
 * Links carrying a query param rather than client state, so a level is a real
 * URL — shareable, bookmarkable, and correct on back. That also keeps the whole
 * reader a server component, which matters when a tab renders a dozen full
 * write-ups.
 */
export function LevelTabs({
  basePath,
  active,
  counts,
  total,
}: {
  basePath: string;
  /** Undefined means the "All" tab. */
  active?: Difficulty;
  counts: Record<Difficulty, number>;
  total: number;
}) {
  const tabs: { label: string; href: string; count: number; isActive: boolean }[] = [
    {
      label: "All",
      href: basePath,
      count: total,
      isActive: active === undefined,
    },
    ...DIFFICULTY_ORDER.filter((difficulty) => counts[difficulty] > 0).map((difficulty) => ({
      label: DIFFICULTY_STUDY_LABEL[difficulty],
      href: `${basePath}?${LEVEL_PARAM}=${LEVEL_SLUG[difficulty]}`,
      count: counts[difficulty],
      isActive: active === difficulty,
    })),
  ];

  return (
    <nav
      aria-label="Difficulty level"
      /*
       * Sticks directly beneath the breadcrumb bar rather than at the top of
       * the viewport, which would park it behind that bar. Offsets are the sum
       * of the chrome above: breadcrumb (~48px) on desktop, plus the 49px
       * mobile brand bar below lg.
       */
      className="sticky top-[97px] z-10 -mx-4 mt-8 border-b border-rule bg-paper/95 px-4 backdrop-blur-[2px] sm:-mx-8 sm:px-8 lg:top-[48px]"
    >
      <ul className="flex flex-wrap items-end gap-x-1">
        {tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={tab.isActive ? "page" : undefined}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-3 py-3 text-[14px] transition-colors",
                tab.isActive
                  ? "border-b-brand text-brand"
                  : "border-b-transparent text-ink-3 hover:border-b-rule hover:text-ink",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "font-sans text-[11.5px] tabular-nums",
                  tab.isActive ? "text-brand" : "text-ink-4",
                )}
              >
                {tab.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
