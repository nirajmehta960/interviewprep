"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Light / dark / system theme control.
 *
 * Three states rather than a boolean: "system" is the honest default for a
 * reading app, and a user who has set their OS to switch at dusk expects the
 * notebook to follow. An explicit choice is remembered in localStorage.
 */

export type Theme = "light" | "dark" | "system";

/** Read by the pre-paint script in the root layout. Keep the two in sync. */
export const THEME_STORAGE_KEY = "interviewprep-theme";

/**
 * Runs before first paint to stop a light flash on a dark-mode reload.
 *
 * This is inlined as a blocking script in <head>: it must execute before the
 * browser paints, so it cannot wait for React to hydrate.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var dark = stored === "dark" ||
      ((!stored || stored === "system") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {
    /* Private mode can throw on localStorage; light is a safe fallback. */
  }
})();
`;

/** Apply a theme to <html>, resolving "system" against the OS setting. */
function apply(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export function ThemeToggle({ className }: { className?: string }) {
  // Starts undefined so the first client render matches the server HTML; the
  // stored value is only read in the effect below, avoiding a hydration
  // mismatch on the pressed state.
  const [theme, setTheme] = useState<Theme>();

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    setTheme(stored ?? "system");
  }, []);

  // While on "system", keep following the OS if it changes mid-session.
  useEffect(() => {
    if (theme !== "system") return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [theme]);

  const choose = (next: Theme) => {
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    apply(next);
  };

  return (
    <div
      className={cn("inline-flex items-center overflow-hidden rounded-full border border-rule bg-card", className)}
      role="group"
      aria-label="Colour theme"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => choose(value)}
            aria-label={`${label} theme`}
            aria-pressed={active}
            title={label}
            className={cn(
              "flex size-7 items-center justify-center transition-colors",
              active ? "bg-tint-brand text-brand" : "text-ink-4 hover:text-ink-2",
            )}
          >
            <Icon className="size-3.5" strokeWidth={1.7} />
          </button>
        );
      })}
    </div>
  );
}
