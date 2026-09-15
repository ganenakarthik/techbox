import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
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
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch related products from same category
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        brand: true,
        category: true,
        variants: {
          include: {
            inventory: true,
          },
        },
      },
      take: 4,
    });

    const formattedVariants = product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: Number(v.price),
      mrp: Number(v.mrp),
      discount: v.discount,
      stock: v.inventory ? v.inventory.available : 0,
      reserved: v.inventory ? v.inventory.reserved : 0,
    }));

    const formattedRelated = related.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand.name,
      category: p.category.name,
      description: p.description,
      rating: p.rating,
      reviewCount: p.reviewCount,
      images: (p.images as string[]) || [],
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: Number(v.price),
        mrp: Number(v.mrp),
        discount: v.discount,
        stock: v.inventory ? v.inventory.available : 0,
      })),
    }));

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        brand: product.brand.name,
        category: product.category.name,
        description: product.description,
        details: product.details,
        rating: product.rating,
        reviewCount: product.reviewCount,
        images: (product.images as string[]) || [],
        specs: (product.specs as Record<string, string>) || {},
        pinoutUrl: product.pinoutUrl,
        datasheetUrl: product.datasheetUrl,
        isFeatured: product.isFeatured,
        isBestseller: product.isBestseller,
        variants: formattedVariants,
        reviews: product.reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          author: r.user.name,
          date: r.createdAt.toISOString().split("T")[0],
          verified: r.verifiedPurchase,
        })),
      },
      related: formattedRelated,
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
