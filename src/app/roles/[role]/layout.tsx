import type { ReactNode } from "react";
import { DocShell } from "@/components/layout/DocShell";

/** Every role page renders inside the documentation shell for that role. */
export default async function RoleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  return <DocShell roleSlug={role}>{children}</DocShell>;
}
