import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * Next.js hot-reloading re-evaluates modules on every edit, which would open a
 * new connection pool each time and exhaust Supabase's connection limit. The
 * client is cached on `globalThis` in development to prevent that.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/** Placeholder identity until auth lands. Every user-scoped row uses this. */
export const LOCAL_USER_ID = "local-user";

/** True when a Postgres connection string is configured. */
export const isDatabaseConfigured = () =>
  typeof process.env.DATABASE_URL === "string" && process.env.DATABASE_URL.length > 0;
