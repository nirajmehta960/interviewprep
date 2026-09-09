"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";

export interface TocEntry {
  id: string;
  label: string;
}

/**
 * Right-hand table of contents for a question page.
 *
 * Tracks the section currently in view so a long answer always shows where you
 * are. The observer watches the top third of the viewport rather than the
 * centre, which is what makes the highlight change when a heading scrolls past
 * rather than only once a whole section is centred.
 */
export function ReadingTOC({
  entries,
  title = "On this page",
}: {
  entries: TocEntry[];
  title?: string;
}) {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      /* Top inset clears the sticky breadcrumb bar and, on the reading view,
         the level tabs beneath it, so the highlight advances as a heading
         passes under the chrome rather than once its section is centred. */
      { rootMargin: "-124px 0px -62% 0px", threshold: 0 },
    );

    const nodes = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((node): node is HTMLElement => node !== null);

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length < 2) return null;

  return (
    <nav aria-label={title} className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <Eyebrow className="mb-3 block">{title}</Eyebrow>
      <ul className="border-l border-rule">
        {entries.map((entry) => {
          const isActive = entry.id === active;

          return (
            <li key={entry.id} className="relative">
              {isActive ? (
                <span className="absolute top-0 bottom-0 -left-px w-[2px] bg-brand" aria-hidden />
              ) : null}
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "line-clamp-2 block py-[5px] pl-3 text-[12.5px] leading-snug transition-colors",
                  isActive ? "text-brand" : "text-ink-3 hover:text-ink",
                )}
              >
                {entry.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
