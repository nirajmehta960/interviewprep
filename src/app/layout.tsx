import type { Metadata } from "next";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { THEME_INIT_SCRIPT } from "@/components/layout/ThemeToggle";

/**
 * Source Sans 3 — headings, body, and controls.
 *
 * The open-source release of Source Sans Pro, which is the face Coursera
 * ships. One humanist family across the whole interface, with hierarchy coming
 * from weight rather than from a second family.
 */
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-source-sans",
  display: "swap",
});

/** Monospace for instrumentation labels, variables, and code. */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InterviewPrep — structured notebook for technical interviews",
  description:
    "A structured technical notebook for software engineering & technical interview preparation: high-yield answers, code in Java and Python, and a visual trace workbench for algorithms.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /*
     * `suppressHydrationWarning` on <html> and <body> only.
     *
     * Browser extensions (Grammarly, LanguageTool, and similar) inject
     * attributes like `data-gr-ext-installed` and `data-lt-installed` onto these
     * two elements before React hydrates, which React then reports as a
     * mismatch. The flag applies to a single element's own attributes and text —
     * it does not recurse — so real mismatches inside the app are still
     * reported.
     */
    <html
      lang="en"
      className={`${sourceSans.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Blocking, pre-paint theme resolution. Without this the server sends
         * light markup and a dark-mode reader sees a white flash before
         * hydration. `dangerouslySetInnerHTML` is the documented way to inline
         * it; the content is a build-time constant, not user input.
         */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
