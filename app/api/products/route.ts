import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");

  const products = await prisma.product.findMany({
    where: category
      ? {
          category: {
            slug: category,
          },
        }
      : undefined,
    include: {
      category: true,
      images: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(products);
}