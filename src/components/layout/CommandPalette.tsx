"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import { KeyCap } from "@/components/ui/Controls";
import { questionHref } from "@/lib/routes";

export const OPEN_PALETTE_EVENT = "interviewprep:open-palette";

/** Opens the palette from anywhere without threading state through the tree. */
export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

interface SearchHit {
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  type: "CONCEPTUAL" | "ALGORITHMIC" | "BEHAVIORAL";
  topicName: string;
  /** Needed to build the anchor URL for theory questions. */
  topicSlug: string;
  roleSlug: string;
}

const DIFFICULTY_LABEL: Record<SearchHit["difficulty"], string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

const NAV_TARGETS = [
  { href: "/", title: "Choose a role", group: "Navigate" },
  { href: "/workbench", title: "Visualizer workbench", group: "Navigate" },
  { href: "/review", title: "Revision queue", group: "Navigate" },
];

/** Global search across every question in the database (Phase 1, F1). */
export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
      if (event.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Debounced server search; the catalog is too large to ship to the client.
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = (await response.json()) as { results: SearchHit[] };
        if (!cancelled) {
          setHits(data.results ?? []);
          setCursor(0);
        }
      } catch {
        if (!cancelled) setHits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 140);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, open]);

  if (!open) return null;

  const navMatches = NAV_TARGETS.filter((target) =>
    target.title.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const rows = [
    ...hits.map((hit) => ({
      // Theory questions resolve to their anchor on the topic page; only
      // coding problems have a page of their own.
      href: questionHref({
        slug: hit.slug,
        type: hit.type,
        difficulty: hit.difficulty,
        roleSlug: hit.roleSlug,
        topicSlug: hit.topicSlug,
      }),
      title: hit.title,
      group: hit.topicName,
      badge: DIFFICULTY_LABEL[hit.difficulty],
    })),
    ...navMatches.map((target) => ({ ...target, badge: undefined })),
    /* The palette caps at eight hits, so give the reader a way through to the
       full result set rather than making them retype the query. */
    ...(query.trim()
      ? [
          {
            href: `/search?q=${encodeURIComponent(query.trim())}`,
            title: `See all results for "${query.trim()}"`,
            group: "Search",
            badge: undefined,
          },
        ]
      : []),
  ];

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((c) => (rows.length === 0 ? 0 : (c + 1) % rows.length));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((c) => (rows.length === 0 ? 0 : (c - 1 + rows.length) % rows.length));
    }
    if (event.key === "Enter" && rows[cursor]) {
      event.preventDefault();
      go(rows[cursor].href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search questions"
        className="relative w-full max-w-[600px] overflow-hidden rounded-panel border border-rule bg-card shadow-pop"
      >
        <div className="flex items-center gap-3 border-b border-rule px-4 py-3.5">
          {loading ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-ink-4" strokeWidth={1.8} />
          ) : (
            <Search className="size-4 shrink-0 text-ink-4" strokeWidth={1.6} />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search questions, topics, or concepts"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-4"
          />
          <KeyCap>esc</KeyCap>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-ink-3">
            {loading ? "Searching…" : `Nothing matches “${query}”.`}
          </p>
        ) : (
          <ul className="max-h-[52vh] overflow-y-auto py-1.5">
            {rows.map((row, index) => (
              <li key={row.href}>
                <button
                  type="button"
                  onMouseEnter={() => setCursor(index)}
                  onClick={() => go(row.href)}
                  className={cn(
                    "flex w-full items-baseline gap-3 px-4 py-2 text-left transition-colors",
                    index === cursor ? "bg-tint-brand" : "hover:bg-paper-sunken",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate font-display text-[15px] text-ink">
                    {row.title}
                  </span>
                  {row.badge ? <span className="eyebrow shrink-0">{row.badge}</span> : null}
                  <Eyebrow className="w-[124px] shrink-0 truncate text-right">{row.group}</Eyebrow>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between border-t border-rule px-4 py-2.5">
          <Eyebrow>{rows.length} results</Eyebrow>
          <span className="flex items-center gap-1.5">
            <KeyCap>↑</KeyCap>
            <KeyCap>↓</KeyCap>
            <Eyebrow className="ml-1">navigate</Eyebrow>
            <KeyCap>↵</KeyCap>
            <Eyebrow className="ml-1">open</Eyebrow>
          </span>
        </div>
      </div>
    </div>
  );
}
