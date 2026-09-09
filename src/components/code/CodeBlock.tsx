import { cn } from "@/lib/cn";
import type { Language } from "@/lib/types";

/**
 * Minimal syntax highlighter.
 *
 * Phase 1 specified Monaco, but the trace workbench's core need is precise
 * line-level highlighting and click-to-seek on a read-only listing — which a
 * plain renderer does better, at a fraction of the bundle. Monaco is worth
 * revisiting only if the code panel becomes editable.
 */

const KEYWORDS: Record<Language, Set<string>> = {
  JAVA: new Set([
    "abstract", "boolean", "break", "byte", "case", "catch", "char", "class", "continue", "default",
    "do", "double", "else", "enum", "extends", "final", "finally", "float", "for", "if",
    "implements", "import", "instanceof", "int", "interface", "long", "new", "package", "private",
    "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this",
    "throw", "throws", "try", "void", "while", "true", "false", "null",
  ]),
  PYTHON: new Set([
    "and", "as", "assert", "break", "class", "continue", "def", "del", "elif", "else", "except",
    "False", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "None",
    "nonlocal", "not", "or", "pass", "raise", "return", "self", "True", "try", "while", "with",
    "yield",
  ]),
};

/** Types and built-ins that read as a distinct tier from control flow. */
const TYPES = new Set([
  "String", "Integer", "Character", "List", "ArrayList", "Map", "HashMap", "Deque", "ArrayDeque",
  "Queue", "LinkedList", "Arrays", "Math", "TreeNode", "ListNode", "Solution", "OrderedDict",
  "Optional", "int", "str", "bool", "len", "max", "min", "range", "enumerate", "deque", "sort",
  "sorted", "append", "pop", "Node", "LRUCache",
]);

const TOKEN_RE =
  /(\s+)|(\/\/[^\n]*|#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|([^\sA-Za-z0-9_])/g;

function tokenize(line: string, language: Language) {
  const tokens: { text: string; className: string }[] = [];
  const keywords = KEYWORDS[language];

  for (const match of line.matchAll(TOKEN_RE)) {
    const [text, space, comment, string, number, word, punct] = match;

    if (space) tokens.push({ text, className: "" });
    else if (comment) tokens.push({ text, className: "text-ink-4 italic" });
    else if (string) tokens.push({ text, className: "text-warn" });
    else if (number) tokens.push({ text, className: "text-warn" });
    else if (word) {
      if (keywords.has(word)) tokens.push({ text, className: "text-danger" });
      else if (TYPES.has(word)) tokens.push({ text, className: "text-brand" });
      else tokens.push({ text, className: "text-ink" });
    } else if (punct) tokens.push({ text, className: "text-ink-3" });
  }

  return tokens;
}

export function CodeBlock({
  lines,
  language,
  activeLine,
  onLineClick,
  className,
  showLineNumbers = true,
  /** Extra lines of scroll padding kept below the active line. */
  dense = false,
}: {
  lines: string[];
  language: Language;
  activeLine?: number;
  onLineClick?: (line: number) => void;
  className?: string;
  showLineNumbers?: boolean;
  dense?: boolean;
}) {
  const interactive = Boolean(onLineClick);

  return (
    <div className={cn("overflow-x-auto font-mono text-[12.5px] leading-[1.75]", className)}>
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const isActive = activeLine === lineNumber;

            return (
              <tr
                key={lineNumber}
                id={`code-line-${lineNumber}`}
                onClick={interactive ? () => onLineClick?.(lineNumber) : undefined}
                className={cn(
                  "group scroll-my-24 transition-colors",
                  isActive && "bg-tint-brand",
                  interactive && "cursor-pointer",
                  interactive && !isActive && "hover:bg-paper-sunken",
                )}
              >
                {showLineNumbers ? (
                  <td
                    className={cn(
                      "w-9 border-r border-rule-soft pr-2.5 text-right align-top font-mono text-[10.5px] tabular-nums select-none",
                      dense ? "py-0" : "py-[1px]",
                      isActive ? "border-r-brand/40 text-brand" : "text-ink-4",
                    )}
                  >
                    {lineNumber}
                  </td>
                ) : null}
                <td
                  className={cn(
                    "relative pl-3.5 align-top whitespace-pre",
                    dense ? "py-0" : "py-[1px]",
                  )}
                >
                  {isActive ? (
                    <span className="absolute top-0 bottom-0 left-0 w-[2px] bg-brand" aria-hidden />
                  ) : null}
                  {line.length === 0 ? (
                    <span>{" "}</span>
                  ) : (
                    tokenize(line, language).map((token, tokenIndex) => (
                      <span key={tokenIndex} className={token.className}>
                        {token.text}
                      </span>
                    ))
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
