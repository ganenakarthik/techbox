import { NextResponse } from "next/server";
import { getProductsFromDB } from "@/lib/neon";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const query = searchParams.get("query") || undefined;

  const products = await getProductsFromDB(category, query);
  return NextResponse.json({ success: true, count: products.length, products });
}
