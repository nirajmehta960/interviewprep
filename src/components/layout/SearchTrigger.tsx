"use client";

import { Search } from "lucide-react";
import { KeyCap } from "@/components/ui/Controls";
import { openCommandPalette } from "./CommandPalette";

/** Opens the command palette. Mirrors the ⌘K shortcut for pointer users. */
export function SearchTrigger() {
  return (
    <button
      type="button"
      onClick={openCommandPalette}
      className="inline-flex h-9 items-center gap-2 rounded-full border border-rule bg-card px-3.5 text-ink-3 transition-colors hover:border-brand/40 hover:text-ink"
    >
      <Search className="size-3.5" strokeWidth={1.7} />
      <span className="font-sans text-[11.5px] tracking-[0.04em] uppercase">Search</span>
      <KeyCap>⌘K</KeyCap>
    </button>
  );
}
