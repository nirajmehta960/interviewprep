import Link from "next/link";
import { Eyebrow, SectionKicker } from "@/components/ui/Section";
import { SearchTrigger } from "@/components/layout/SearchTrigger";
import { SearchField } from "@/components/layout/SearchField";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { listRoles } from "@/server/repositories/taxonomy.repository";

export const dynamic = "force-dynamic";

/**
 * Role selection (Phase 6, F6).
 *
 * A deliberate placeholder for the marketing landing page — every role, topic
 * count and blurb is read from the database, so filling in a topic changes
 * this screen with no code change.
 */
export default async function HomePage() {
  const roles = await listRoles();
  const total = roles.reduce((sum, role) => sum + role.questionCount, 0);

  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-rule px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-control bg-brand text-[14px] font-bold leading-none text-paper">
            I
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.01em]">
            <span className="text-ink">Interview</span>
            <span className="text-brand">Prep</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/workbench"
            className="hidden font-sans text-[11.5px] tracking-[0.04em] text-ink-3 uppercase transition-colors hover:text-brand sm:inline"
          >
            Workbench
          </Link>
          <SearchTrigger />
          <ThemeToggle />
        </div>
      </header>

      {/* Centred hero on a tinted band, as on the reference platforms: it gives
          the landing page a clear front door instead of a left-aligned column
          with half the width empty. */}
      <section className="border-b border-rule bg-paper-sunken px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto w-full max-w-[720px] text-center">
          <Eyebrow className="text-brand">Interview preparation</Eyebrow>
          <h1 className="mt-4 text-[36px] leading-[1.1] sm:text-[52px]">
            Your structured notebook for technical interviews
          </h1>
          <p className="mx-auto mt-5 max-w-[60ch] text-[18px] leading-relaxed text-ink-2">
            High-yield answers you can give in thirty seconds, the detail behind them, code in Java
            and Python, and a visual trace workbench for anything algorithmic.
          </p>

          {/* Search above the role cards: someone who already knows the concept
              they want should not have to pick a role first. */}
          <div className="mx-auto mt-9 max-w-[620px]">
            <SearchField />
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-[1080px] px-4 py-16 sm:px-8">
        <h2 className="mb-6 text-[28px]">Choose your role</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role) => {
            const ready = role.questionCount > 0;

            return (
              <Link
                key={role.slug}
                href={`/roles/${role.slug}`}
                className="group flex flex-col rounded-panel border border-rule bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-card-hover"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-[24px] leading-snug text-ink transition-colors group-hover:text-brand">
                    {role.name}
                  </h2>
                  <Eyebrow className={ready ? "shrink-0 text-brand" : "shrink-0"}>
                    {ready ? `${role.questionCount} questions` : "Coming soon"}
                  </Eyebrow>
                </div>

                <p className="mt-2.5 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
                  {role.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-5">
                  {role.highlights.map((highlight, position) => (
                    <span key={highlight} className="flex items-center gap-2.5">
                      {position > 0 ? <span className="text-ink-4">·</span> : null}
                      <span className="font-sans text-[11.5px] tracking-[0.02em] text-ink-3">
                        {highlight}
                      </span>
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-rule-soft pt-3">
                  <Eyebrow>{role.topicCount} topics</Eyebrow>
                  <span
                    aria-hidden
                    className="text-ink-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-brand"
                  >
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-[12.5px] text-ink-3">
          {total} questions indexed. Software Engineer is furthest along; the other roles are
          scaffolded and filling in.
        </p>
      </main>
    </div>
  );
}
