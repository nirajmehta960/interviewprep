"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Eyebrow } from "@/components/ui/Section";
import { DocSidebar } from "./DocSidebar";
import { RoleSwitcher } from "./RoleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import type { NavCategory } from "@/server/repositories/taxonomy.repository";

/**
 * Mobile navigation: a top bar plus a slide-over drawer holding the same topic
 * tree the desktop sidebar shows.
 *
 * The tree is passed down from the server rather than re-fetched, so the drawer
 * costs one shared payload instead of a second query.
 */
export function MobileNav({
  roleSlug,
  roleName,
  categories,
  roles,
  activeTopicSlug,
  questionCount,
}: {
  roleSlug: string;
  roleName: string;
  categories: NavCategory[];
  roles: { slug: string; name: string; questionCount: number }[];
  activeTopicSlug?: string;
  questionCount: number;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Navigating from inside the drawer should dismiss it.
  useEffect(() => setOpen(false), [pathname]);

  // Escape closes, and the page behind must not scroll while it is open.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-0 z-30 flex h-[49px] items-center justify-between gap-3 border-b border-rule bg-paper/95 px-4 backdrop-blur-[2px] lg:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            aria-expanded={open}
            /* 44px minimum touch target, per the touch-interaction rule. */
            className="-ml-2 flex size-11 items-center justify-center text-ink-2 transition-colors hover:text-ink"
          >
            <Menu className="size-[18px]" strokeWidth={1.7} />
          </button>

          <Link href="/" className="flex min-w-0 items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-control bg-brand text-[12px] font-bold leading-none text-paper">
              I
            </span>
            <span className="truncate text-[15px] font-semibold tracking-[-0.01em]">
              <span className="text-ink">Interview</span>
              <span className="text-brand">Prep</span>
            </span>
          </Link>
        </div>

        <ThemeToggle />
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-[320px] flex-col border-r border-rule bg-paper"
          >
            <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-3">
              <Eyebrow>{roleName}</Eyebrow>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="-mr-2 flex size-11 items-center justify-center text-ink-3 transition-colors hover:text-ink"
              >
                <X className="size-[18px]" strokeWidth={1.7} />
              </button>
            </div>

            <div className="border-b border-rule px-4 py-3">
              <RoleSwitcher activeSlug={roleSlug} roles={roles} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pt-2">
              <DocSidebar
                roleSlug={roleSlug}
                categories={categories}
                activeTopicSlug={activeTopicSlug}
              />
            </div>

            <div className="border-t border-rule px-4 py-3">
              <Eyebrow>{questionCount} questions</Eyebrow>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
