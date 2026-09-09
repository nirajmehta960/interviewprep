"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";

export interface RoleOption {
  slug: string;
  name: string;
  questionCount: number;
}

/** Switches the active role, which reloads the whole sidebar tree. */
export function RoleSwitcher({
  roles,
  activeSlug,
}: {
  roles: RoleOption[];
  activeSlug: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const active = roles.find((role) => role.slug === activeSlug);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex w-full items-center gap-2 rounded-card border border-rule bg-card px-3 py-2.5 text-left transition-colors hover:border-brand/40"
      >
        <span className="min-w-0 flex-1">
          <Eyebrow className="block">Preparing for</Eyebrow>
          <span className="mt-0.5 block truncate text-[13px] font-medium text-ink">
            {active?.name ?? "Choose a role"}
          </span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-ink-4" strokeWidth={1.8} />
      </button>

      {open ? (
        <ul
          role="listbox"
          className="absolute top-full right-0 left-0 z-40 mt-1.5 overflow-hidden rounded-card border border-rule bg-card shadow-pop"
        >
          {roles.map((role) => {
            const isActive = role.slug === activeSlug;
            return (
              <li key={role.slug}>
                <Link
                  href={`/roles/${role.slug}`}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-2 text-[13px] transition-colors",
                    isActive ? "bg-tint-brand text-brand" : "text-ink-2 hover:bg-paper-sunken",
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{role.name}</span>
                  <span className="font-sans text-[11px] tabular-nums text-ink-4">
                    {role.questionCount > 0 ? role.questionCount : "—"}
                  </span>
                  {isActive ? <Check className="size-3.5 text-brand" strokeWidth={2} /> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
