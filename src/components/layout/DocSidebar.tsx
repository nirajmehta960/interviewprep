"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import type { NavCategory } from "@/server/repositories/taxonomy.repository";

/**
 * Documentation sidebar (Phase 1, F1).
 *
 * The tree is passed in from the database, so seeding a new topic makes it
 * appear here with no code change. Categories collapse; the one containing the
 * active topic always starts open.
 */
export function DocSidebar({
  roleSlug,
  categories,
  activeTopicSlug,
}: {
  roleSlug: string;
  categories: NavCategory[];
  /** Set by screens whose URL does not contain the topic, e.g. a question. */
  activeTopicSlug?: string;
}) {
  const pathname = usePathname();

  const activeTopic =
    activeTopicSlug ??
    categories
      .flatMap((category) => category.topics)
      .find((topic) => pathname.startsWith(`/roles/${roleSlug}/${topic.slug}`))?.slug;

  const [collapsed, setCollapsed] = useState<string[]>([]);

  const toggle = (slug: string) =>
    setCollapsed((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );

  return (
    <nav className="px-3 pb-8" aria-label="Topics">
      {categories.map((category) => {
        const holdsActive = category.topics.some((topic) => topic.slug === activeTopic);
        const isOpen = holdsActive || !collapsed.includes(category.slug);

        return (
          <div key={category.slug} className="mb-1">
            <button
              type="button"
              onClick={() => toggle(category.slug)}
              aria-expanded={isOpen}
              className="group flex w-full items-center gap-1.5 px-2 py-2 text-left transition-colors"
            >
              <ChevronDown
                className={cn(
                  "size-3 shrink-0 text-ink-4 transition-transform duration-150",
                  !isOpen && "-rotate-90",
                )}
                strokeWidth={2}
              />
              <Eyebrow className="group-hover:text-ink">{category.name}</Eyebrow>
            </button>

            {isOpen ? (
              <ul className="mb-2">
                {category.topics.map((topic) => {
                  const href = `/roles/${roleSlug}/${topic.slug}`;
                  const isActive = topic.slug === activeTopic;
                  const isEmpty = topic.questionCount === 0;

                  return (
                    <li key={topic.slug}>
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "relative mx-1 flex items-center gap-2.5 rounded-control py-[7px] pr-2 pl-[22px] text-[14px] transition-colors",
                          isActive
                            ? "bg-tint-brand font-medium text-brand"
                            : isEmpty
                              ? "text-ink-4 hover:bg-paper-sunken hover:text-ink-3"
                              : "text-ink-2 hover:bg-paper-sunken hover:text-ink",
                        )}
                      >
                        {/* The active row is now carried by the tinted pill and
                            the brand text colour; a hard left bar would break
                            out of the rounded corners. */}
                        <span className="min-w-0 flex-1 truncate">{topic.name}</span>
                        <span
                          className={cn(
                            "font-sans text-[11px] tabular-nums",
                            isActive ? "text-brand" : "text-ink-4",
                          )}
                        >
                          {topic.questionCount > 0 ? topic.questionCount : "—"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
