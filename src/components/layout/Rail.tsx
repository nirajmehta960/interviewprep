"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Bookmark, FileSearch, FlaskConical, Home, RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";

export interface RailRecent {
  slug: string;
  title: string;
  context: string;
}

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/problems", label: "Problem index", icon: FileSearch },
  { href: "/workbench", label: "Workbench", icon: FlaskConical },
  { href: "/review", label: "Review", icon: RefreshCw },
  { href: "/progress", label: "Progress", icon: BarChart2 },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Left navigation rail. Persistent across every screen. */
export function Rail({
  recents,
  counts,
}: {
  recents: RailRecent[];
  counts: { problems: number; due: number; bookmarks: number };
}) {
  const pathname = usePathname();

  const badgeFor = (href: string) =>
    href === "/problems" ? counts.problems : href === "/review" ? counts.due : null;

  return (
    <aside className="sticky top-0 flex h-screen w-rail shrink-0 flex-col border-r border-rule bg-paper">
      <Link
        href="/"
        className="flex items-center gap-2.5 px-5 py-5 transition-opacity hover:opacity-70"
      >
        <span className="flex size-7 items-center justify-center rounded-control bg-brand text-[14px] font-bold leading-none text-paper">
          D
        </span>
        <span className="font-mono text-[11px] leading-[1.35] tracking-[0.11em] uppercase">
          <span className="block text-ink">DSA</span>
          <span className="block text-ink-3">Notebook</span>
        </span>
      </Link>

      <nav className="mt-2 px-3" aria-label="Main">
        <Eyebrow className="block px-2 pb-2">Index</Eyebrow>
        <ul>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            const badge = badgeFor(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-2.5 py-[7px] pr-2 pl-2 text-[13px] transition-colors",
                    active
                      ? "bg-tint-brand font-medium text-brand"
                      : "text-ink-2 hover:bg-paper-sunken hover:text-ink",
                  )}
                >
                  {active ? (
                    <span className="absolute top-0 bottom-0 -left-3 w-[2px] bg-brand" aria-hidden />
                  ) : null}
                  <Icon
                    className={cn("size-[15px] shrink-0", active ? "text-brand" : "text-ink-4")}
                    strokeWidth={1.6}
                  />
                  <span className="flex-1 truncate">{label}</span>
                  {badge ? (
                    <span
                      className={cn(
                        "font-mono text-[10.5px] tabular-nums",
                        href === "/review" && counts.due > 0 ? "text-warn" : "text-ink-4",
                      )}
                    >
                      {String(badge).padStart(2, "0")}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-8 min-h-0 flex-1 overflow-y-auto px-5">
        <Eyebrow className="block pb-3">Recently opened</Eyebrow>
        <ul className="space-y-3.5">
          {recents.map((recent) => (
            <li key={recent.slug}>
              <Link href={`/questions/${recent.slug}`} className="group block">
                <span className="block font-display text-[14px] leading-snug text-ink group-hover:text-brand">
                  {recent.title}
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-ink-3">
                  {recent.context}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-rule px-5 py-4">
        <Link
          href="/problems?bookmarked=1"
          className="flex items-center gap-2.5 text-[13px] text-ink-2 transition-colors hover:text-ink"
        >
          <Bookmark className="size-[15px] text-ink-4" strokeWidth={1.6} />
          <span className="flex-1">Bookmarks</span>
          <span className="font-mono text-[10.5px] tabular-nums text-ink-4">
            {String(counts.bookmarks).padStart(2, "0")}
          </span>
        </Link>
      </div>
    </aside>
  );
}
