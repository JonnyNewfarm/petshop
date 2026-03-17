import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const tag = request.nextUrl.searchParams.get("tag");
  const search = request.nextUrl.searchParams.get("search")?.trim() || "";
  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const limit = Number(request.nextUrl.searchParams.get("limit") || "9");

  const currentPage = Number.isNaN(page) || page < 1 ? 1 : page;
  const currentLimit = Number.isNaN(limit) || limit < 1 ? 9 : limit;

  const where = {
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
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [products, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where,
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
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    }),
    prisma.product.count({
      where,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalProducts / currentLimit));

  return NextResponse.json({
    products,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      totalProducts,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  });
}