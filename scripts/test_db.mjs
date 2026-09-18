import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.REMOTE_DATABASE_URL || "postgresql://postgres.lflqghccqvohstanpgly:NnpTeXAqlMOaNmuU@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres";

console.log("Connecting to Supabase at:", dbUrl.replace(/:[^:@]+@/, ":****@"));
const prisma = new PrismaClient({
  datasourceUrl: dbUrl,
});

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("CONNECTION SUCCESSFUL:", res);
  } catch (err) {
    console.error("CONNECTION FAILED:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
