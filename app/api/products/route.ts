import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const tag = request.nextUrl.searchParams.get("tag");

  const products = await prisma.product.findMany({
    where: {
      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),
      ...(tag
        ? {
            tags: {
              some: {
                slug: tag,
              },
            },
          }
        : {}),
    },
    include: {
      category: true,
      tags: true,
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