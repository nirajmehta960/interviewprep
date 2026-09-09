import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/ui/Section";
import { DocSidebar } from "./DocSidebar";
import { MobileNav } from "./MobileNav";
import { RoleSwitcher } from "./RoleSwitcher";
import { SearchTrigger } from "./SearchTrigger";
import { ThemeToggle } from "./ThemeToggle";
import { getRoleTree, listRoles } from "@/server/repositories/taxonomy.repository";

/**
 * Documentation shell (Phase 1, F1).
 *
 * Brand, role switcher, and the collapsible topic tree — all read from the
 * database for the given role. Screens supply their own breadcrumb via
 * `Breadcrumbs`.
 */
export async function DocShell({
  roleSlug,
  activeTopicSlug,
  children,
}: {
  roleSlug: string;
  /**
   * Topic to mark as current. The sidebar can infer this from the pathname on
   * `/roles/[role]/[topic]`, but a question lives at `/questions/[slug]`, so
   * that screen passes the owning topic explicitly.
   */
  activeTopicSlug?: string;
  children: ReactNode;
}) {
  const [tree, roles] = await Promise.all([getRoleTree(roleSlug), listRoles()]);
  if (!tree) notFound();

  const switcherRoles = roles.map((role) => ({
    slug: role.slug,
    name: role.name,
    questionCount: role.questionCount,
  }));

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <MobileNav
        roleSlug={roleSlug}
        roleName={tree.name}
        categories={tree.categories}
        roles={switcherRoles}
        activeTopicSlug={activeTopicSlug}
        questionCount={tree.questionCount}
      />

      {/* Desktop rail. Below lg the same tree is reached through the drawer. */}
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col border-r border-rule bg-paper lg:flex">
        <div className="px-4 pt-5 pb-4">
          <Link href="/" className="mb-4 flex items-center gap-2.5 transition-opacity hover:opacity-70">
            <span className="flex size-7 items-center justify-center rounded-control bg-brand text-[14px] font-bold leading-none text-paper">
              I
            </span>
            <span className="text-[16px] font-semibold tracking-[-0.01em]">
              <span className="text-ink">Interview</span>
              <span className="text-brand">Prep</span>
            </span>
          </Link>

          <RoleSwitcher activeSlug={roleSlug} roles={switcherRoles} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto border-t border-rule pt-3">
          <DocSidebar
            roleSlug={roleSlug}
            categories={tree.categories}
            activeTopicSlug={activeTopicSlug}
          />
        </div>

        <div className="border-t border-rule px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <Eyebrow>{tree.questionCount} questions</Eyebrow>
            <Link
              href="/workbench"
              className="font-sans text-[11px] tracking-[0.04em] text-ink-3 uppercase transition-colors hover:text-brand"
            >
              Workbench
            </Link>
          </div>
          <div className="mt-3 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* max-w-full stops a wide child from expanding the column past the
          viewport on mobile, where the shell is a flex *column*. */}
      <div className="flex min-w-0 max-w-full flex-1 flex-col">{children}</div>
    </div>
  );
}

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb bar: `Software Engineer / CS Fundamentals / DSA / Intervals`. */
export function Breadcrumbs({
  crumbs,
  meta,
  actions,
  className,
}: {
  crumbs: Crumb[];
  meta?: string[];
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        /* Sits below the 49px mobile bar; flush to the top once the desktop
           rail takes over at lg. */
        "sticky top-[49px] z-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-rule bg-paper/95 px-4 py-3.5 backdrop-blur-[2px] sm:px-8 lg:top-0",
        className,
      )}
    >
      {/* Wraps rather than overflowing: a question breadcrumb is four levels
          deep, which does not fit one line on a phone. */}
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((crumb, index) => (
          <span key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-2">
            {index > 0 ? <span className="marker-num">/</span> : null}
            {crumb.href ? (
              <Link href={crumb.href} className="eyebrow transition-colors hover:text-ink">
                {crumb.label}
              </Link>
            ) : (
              <Eyebrow className="truncate text-ink">{crumb.label}</Eyebrow>
            )}
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-5">
        {meta?.length ? (
          <div className="hidden items-center gap-3 md:flex">
            {meta.map((item, index) => (
              <span key={item} className="flex items-center gap-3">
                {index > 0 ? <span className="marker-num">·</span> : null}
                <Eyebrow>{item}</Eyebrow>
              </span>
            ))}
          </div>
        ) : null}
        {actions}
        <SearchTrigger />
      </div>
    </header>
  );
}

/** Standard reading-width container for documentation pages. */
export function DocPage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn("mx-auto w-full max-w-[1480px] px-4 py-10 sm:px-8 xl:px-12", className)}>
      {children}
    </main>
  );
}
