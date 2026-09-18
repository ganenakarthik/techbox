import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function resolveDatabaseUrl(): string | undefined {
  const direct = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  const remote = process.env.REMOTE_DATABASE_URL;
  const postgresPrisma = process.env.POSTGRES_PRISMA_URL;
  const postgresUrl = process.env.POSTGRES_URL;
  const supabaseDb = process.env.SUPABASE_DATABASE_URL;

  const candidates = [
    direct,
    postgresPrisma,
    postgresUrl,
    remote,
    directUrl,
    supabaseDb,
  ].filter(Boolean) as string[];

  const isProd = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

  for (const candidate of candidates) {
    const trimmed = candidate.trim().replace(/^["']|["']$/g, "");
    if (trimmed.startsWith("postgresql://") || trimmed.startsWith("postgres://")) {
      if (isProd && (trimmed.includes("localhost") || trimmed.includes("127.0.0.1"))) {
        continue;
      }
      return trimmed;
    }
  }

  return undefined;
}

const resolvedUrl = resolveDatabaseUrl();

if (resolvedUrl) {
  process.env.DATABASE_URL = resolvedUrl;
}

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    ...(resolvedUrl ? { datasourceUrl: resolvedUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
