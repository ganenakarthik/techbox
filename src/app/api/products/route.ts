import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const inStock = searchParams.get("inStock") === "true";
    const sort = searchParams.get("sort") || "featured";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    // Search query
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { variants: { some: { sku: { contains: q, mode: "insensitive" } } } },
        { variants: { some: { name: { contains: q, mode: "insensitive" } } } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      where.category = {
        OR: [
          { slug: category },
          { name: { equals: category, mode: "insensitive" } },
        ],
      };
    }

    // Brand filter
    if (brand && brand !== "all") {
      where.brand = {
        OR: [
          { slug: brand },
          { name: { equals: brand, mode: "insensitive" } },
        ],
      };
    }

    // In Stock filter
    if (inStock) {
      where.variants = {
        some: {
          inventory: {
            available: { gt: 0 },
          },
        },
      };
    }

    // Sort order
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "rating") {
      orderBy = { rating: "desc" };
    } else if (sort === "featured") {
      orderBy = { isFeatured: "desc" };
    }

    // Fetch total and records
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: {
          brand: true,
          category: true,
          variants: {
            include: {
              inventory: true,
            },
            orderBy: {
              price: "asc",
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    // Format products for frontend consumption
    let formatted = products.map((p) => {
      const variants = p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: Number(v.price),
        mrp: Number(v.mrp),
        discount: v.discount,
        stock: v.inventory ? v.inventory.available : 0,
        reserved: v.inventory ? v.inventory.reserved : 0,
      }));

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        brand: p.brand.name,
        category: p.category.name,
        categorySlug: p.category.slug,
        description: p.description,
        details: p.details,
        rating: p.rating,
        reviewCount: p.reviewCount,
        images: (p.images as string[]) || [],
        specs: (p.specs as Record<string, string>) || {},
        pinoutUrl: p.pinoutUrl,
        datasheetUrl: p.datasheetUrl,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        variants,
        // tags fallback for search
        tags: [p.name, p.brand.name, p.category.name],
      };
    });

    // In-memory price sorting if requested (since variants define price)
    if (sort === "price-low") {
      formatted.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
    } else if (sort === "price-high") {
      formatted.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
    }

    return NextResponse.json({
      products: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
