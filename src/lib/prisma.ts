import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

function resolveDatabaseUrl(): string | undefined {
  const isProd = process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
  const direct = process.env.DATABASE_URL;
  const remote = process.env.REMOTE_DATABASE_URL;

  if (isProd && (!direct || direct.includes("localhost") || direct.includes("127.0.0.1"))) {
    return remote || direct;
  }
  return direct || remote;
}

const resolvedUrl = resolveDatabaseUrl();

export const prisma =
  globalThis.prismaGlobal ??
  new PrismaClient({
    datasourceUrl: resolvedUrl,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
