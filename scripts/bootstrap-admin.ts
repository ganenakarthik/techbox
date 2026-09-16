import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  const name = process.argv[4] || "TechBox Operations Lead";

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/bootstrap-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email: cleanEmail },
    update: {
      passwordHash,
      role: "ADMIN",
      name,
    },
    create: {
      email: cleanEmail,
      name,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin account provisioned securely:`);
  console.log(`   ID:    ${admin.id}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role:  ${admin.role}`);
  console.log(`\nPassword hash updated in PostgreSQL.`);
}

main()
  .catch((e) => {
    console.error("Bootstrap error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
