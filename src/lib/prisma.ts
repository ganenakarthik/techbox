import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function resolveDatabaseUrl(): string | undefined {
  const direct = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;
  const remote = process.env.REMOTE_DATABASE_URL;
  const isProd = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);

  if (isProd) {
    if (direct && !direct.includes("localhost") && !direct.includes("127.0.0.1")) {
      return direct;
    }
    return directUrl || remote || direct;
  }

  return direct || directUrl || remote;
}

const resolvedUrl = resolveDatabaseUrl();

if (resolvedUrl && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("localhost"))) {
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
