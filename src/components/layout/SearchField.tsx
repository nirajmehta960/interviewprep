"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/**
 * The search input on the results page.
 *
 * A real form submit rather than search-as-you-type: results come from the
 * server, and firing a navigation on every keystroke would queue renders the
 * reader never sees. The palette (⌘K) already covers incremental search.
 */
export function SearchField({
  initialQuery = "",
  autoFocus = false,
}: {
  initialQuery?: string;
  /** Only set this where landing on the screen *is* the intent to search. */
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const next = value.trim();
        router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
      }}
      className="flex items-center gap-2.5 rounded-full border border-rule bg-card pr-1.5 pl-4 shadow-card transition-shadow focus-within:border-brand focus-within:shadow-card-hover"
    >
      <Search className="size-4 shrink-0 text-ink-4" strokeWidth={1.7} aria-hidden />
      <label htmlFor="search-input" className="sr-only">
        Search questions, topics, or concepts
      </label>
      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search questions, topics, or concepts..."
        autoComplete="off"
        autoFocus={autoFocus}
        className="h-12 min-w-0 flex-1 bg-transparent text-[16px] text-ink placeholder:text-ink-4 focus:outline-none"
      />
      {/* A filled pill, as on the reference: search is the primary action of
          this control, so it looks like a button rather than a text link. */}
      <button
        type="submit"
        className="shrink-0 rounded-full bg-brand px-5 py-2 text-[14px] font-semibold text-paper transition-colors hover:bg-brand-soft"
      >
        Search
      </button>
    </form>
  );
}
