import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "quiet" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-paper border-brand hover:bg-brand-soft",
  outline: "bg-card text-ink border-rule hover:border-ink-4 hover:bg-paper-sunken",
  quiet: "bg-transparent text-ink-2 border-transparent hover:bg-paper-sunken hover:text-ink",
  ghost: "bg-transparent text-ink-3 border-transparent hover:text-ink",
};

const SIZES = {
  sm: "h-7 px-2.5 text-[11px] gap-1.5",
  md: "h-9 px-3.5 text-[12px] gap-2",
  lg: "h-11 px-5 text-[13px] gap-2.5",
} as const;

const base =
  "inline-flex items-center justify-center border font-mono tracking-[0.06em] uppercase transition-colors duration-100 disabled:pointer-events-none disabled:opacity-40 select-none";

export function Button({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: keyof typeof SIZES }) {
  return (
    <button className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "outline",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: keyof typeof SIZES }) {
  return (
    <Link className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </Link>
  );
}

/** Square icon button, sized to align with the text controls beside it. */
export function IconButton({
  label,
  size = "md",
  variant = "outline",
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  label: string;
  size?: keyof typeof SIZES;
  variant?: Variant;
}) {
  const square = { sm: "size-7", md: "size-9", lg: "size-11" } as const;

  return (
    <button
      aria-label={label}
      title={label}
      className={cn(base, VARIANTS[variant], square[size], "px-0", className)}
      {...props}
    >
      {children}
    </button>
  );
}

/** Keyboard cap, e.g. ⌘K. */
export function KeyCap({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[19px] min-w-[19px] items-center justify-center rounded-control border border-rule bg-paper-sunken px-1 font-mono text-[10.5px] text-ink-3">
      {children}
    </kbd>
  );
}

/**
 * Segmented control. Used for language toggles and view switches, where the
 * options are peers rather than a primary/secondary pair.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "sm",
  className,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
  label?: string;
}) {
  const pad = size === "sm" ? "h-7 px-2.5 text-[10.5px]" : "h-9 px-3.5 text-[11.5px]";

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex overflow-hidden rounded-control border border-rule bg-card", className)}
    >
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "font-mono tracking-[0.06em] uppercase transition-colors duration-100",
              pad,
              index > 0 && "border-l border-rule",
              active ? "bg-brand text-paper" : "text-ink-3 hover:bg-paper-sunken hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Underlined text link with a trailing arrow — the system's "go there" affordance. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "link-quiet group inline-flex items-baseline gap-1.5 text-[13px] text-brand",
        className,
      )}
    >
      {children}
      <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">
        ↗
      </span>
    </Link>
  );
}
