import { PrismaClient } from "@prisma/client";
import { PRODUCTS, PROJECT_KITS, CATEGORIES, BRANDS, COLLEGES } from "../src/data/mockData";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding TechBox database...");

  // 1. Seed Colleges & Campuses
  for (const col of COLLEGES) {
    const college = await prisma.college.upsert({
      where: { code: col.code },
      update: {},
      create: {
        id: col.id,
        name: col.name,
        code: col.code,
        city: col.city,
        state: col.state,
        pincode: col.pincode,
      },
    });

    for (const camp of col.campuses) {
      const campus = await prisma.campus.create({
        data: {
          id: camp.id,
          collegeId: college.id,
          name: camp.name,
        },
      });

      for (const loc of camp.pickupLocations) {
        await prisma.campusPickupLocation.create({
          data: {
            campusId: campus.id,
            name: loc,
            instructions: "Meet campus delivery runner with student ID.",
          },
        });
      }

      for (const slot of camp.deliverySlots) {
        await prisma.campusDeliverySlot.create({
          data: {
            campusId: campus.id,
            slotName: slot,
            cutoffHours: 2,
          },
        });
      }
    }
  }

  // 2. Seed Users
  await prisma.user.upsert({
    where: { email: "admin@techbox.com" },
    update: {},
    create: {
      id: "usr-admin",
      email: "admin@techbox.com",
      name: "TechBox Operations Lead",
      passwordHash: "$2b$10$EpRnTzVlqHNP0.fUbXUwSOyiohKGuvv/dY7Vv91/y2jS", // hashed mock
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "student@campus.edu" },
    update: {},
    create: {
      id: "usr-student",
      email: "student@campus.edu",
      name: "Arjun Sharma",
      phone: "+91 98450 12345",
      passwordHash: "$2b$10$EpRnTzVlqHNP0.fUbXUwSOyiohKGuvv/dY7Vv91/y2jS",
      role: "CUSTOMER",
    },
  });

  // 3. Seed Categories & Brands
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: `${cat.name} for engineering college projects`,
      },
    });
  }

  for (const brand of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
      },
    });
  }

  // 4. Seed Products, Variants & Inventory
  for (const prod of PRODUCTS) {
    const brand = await prisma.brand.findFirst({ where: { name: prod.brand } });
    const category = await prisma.category.findFirst({ where: { name: prod.category } });

    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        brandId: brand?.id || BRANDS[0].id,
        categoryId: category?.id || CATEGORIES[0].id,
        description: prod.description,
        details: prod.details,
        specs: prod.specs,
        pinoutUrl: prod.pinoutUrl,
        datasheetUrl: prod.datasheetUrl,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        isFeatured: prod.isFeatured,
        isBestseller: prod.isBestseller,
        images: prod.images,
      },
    });

    for (const v of prod.variants) {
      const createdVar = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: {
          id: v.id,
          productId: createdProd.id,
          name: v.name,
          sku: v.sku,
          price: v.price,
          mrp: v.mrp,
          discount: v.discount,
        },
      });

      await prisma.inventory.upsert({
        where: { variantId: createdVar.id },
        update: {},
        create: {
          variantId: createdVar.id,
          available: v.stock,
          reserved: Math.floor(v.stock * 0.1),
          sold: Math.floor(v.stock * 0.4),
          minThreshold: 10,
        },
      });
    }
  }

  // 5. Seed Project Kits
  for (const kit of PROJECT_KITS) {
    await prisma.projectKit.upsert({
      where: { slug: kit.slug },
      update: {},
      create: {
        id: kit.id,
        title: kit.title,
        slug: kit.slug,
        category: kit.category,
        difficulty: kit.difficulty,
        buildTime: kit.buildTime,
        price: kit.price,
        mrp: kit.mrp,
        description: kit.description,
        includes: kit.includes,
        optionalAddons: kit.optionalAddons,
        images: kit.images,
      },
    });
  }

  // 6. Seed Coupons
  await prisma.coupon.upsert({
    where: { code: "TECHBOX10" },
    update: {},
    create: {
      code: "TECHBOX10",
      discountPercent: 10,
      minSpend: 299,
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90),
    },
  });

  console.log("✅ TechBox database seeded successfully with 50+ components, 8 kits, and campus delivery hubs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
