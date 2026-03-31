"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

type ProductActionState = {
  error?: string;
  success?: boolean;
};

type ParsedVariant = {
  name: string;
  price?: number | null;
  stock?: number;
  options?: { name: string; value: string }[];
};

type ParsedReview = {
  authorName: string;
  authorCountry?: string | null;
  rating: number;
  title?: string | null;
  content: string;
  imageUrl?: string | null;
  verified?: boolean;
  source?: string | null;
  reviewDate?: string | null;
  sortOrder?: number;
};

function parseImageUrls(raw: string) {
  return raw
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

function parseBenefits(raw: string) {
  return raw
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeStock(value: unknown) {
  return Number(value) > 0 ? 1 : 0;
}

function parseVariants(raw: string): ParsedVariant[] {
  if (!raw.trim()) return [];

  const parsed = JSON.parse(raw) as ParsedVariant[];

  return parsed.map((variant) => ({
    name: variant.name,
    price: typeof variant.price === "number" ? variant.price : null,
    stock: normalizeStock(variant.stock ?? 0),
    options: (variant.options ?? []).map((option) => ({
      name: option.name,
      value: option.value,
    })),
  }));
}

function parseReviews(raw: string): ParsedReview[] {
  if (!raw.trim()) return [];

  const parsed = JSON.parse(raw) as ParsedReview[];

  return parsed
    .map((review, index) => ({
      authorName: String(review.authorName || "").trim(),
      authorCountry: review.authorCountry
        ? String(review.authorCountry).trim()
        : null,
      rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
      title: review.title ? String(review.title).trim() : null,
      content: String(review.content || "").trim(),
      imageUrl: review.imageUrl ? String(review.imageUrl).trim() : null,
      verified: Boolean(review.verified),
      source: review.source ? String(review.source).trim() : null,
      reviewDate: review.reviewDate ? String(review.reviewDate).trim() : null,
      sortOrder: Number.isFinite(Number(review.sortOrder))
        ? Number(review.sortOrder)
        : index,
    }))
    .filter((review) => review.authorName && review.content);
}

async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function createProduct(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  try {
    await requireAdmin();

    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const shortDescription = String(
      formData.get("shortDescription") || "",
    ).trim();
    const price = Number(formData.get("price") || 0);
    const compareAtPriceRaw = String(formData.get("compareAtPrice") || "").trim();
    const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;
    const stock = normalizeStock(formData.get("stock") || 0);
    const featured = formData.get("featured") === "on";
    const badge = String(formData.get("badge") || "").trim();
    const seoTitle = String(formData.get("seoTitle") || "").trim();
    const seoDescription = String(formData.get("seoDescription") || "").trim();
    const benefits = parseBenefits(String(formData.get("benefits") || ""));
    const categoryId = String(formData.get("categoryId") || "").trim();
    const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);

    const sizeGuideEnabled = formData.get("sizeGuideEnabled") === "on";
    const sizeGuideTitle = String(formData.get("sizeGuideTitle") || "").trim();
    const sizeGuideContent = String(
      formData.get("sizeGuideContent") || "",
    ).trim();

    const imageUrlsRaw = String(formData.get("imageUrls") || "");
    const variantsRaw = String(formData.get("variantsJson") || "");
    const reviewsRaw = String(formData.get("reviewsJson") || "");

    if (!name || !slug || !description || !categoryId) {
      return { error: "Please fill in all required fields." };
    }

    const parsedImageUrls = parseImageUrls(imageUrlsRaw);

    let parsedVariants: ParsedVariant[] = [];
    try {
      parsedVariants = parseVariants(variantsRaw);
    } catch {
      return { error: "Variants data is invalid." };
    }

    let parsedReviews: ParsedReview[] = [];
    try {
      parsedReviews = parseReviews(reviewsRaw);
    } catch {
      return { error: "Reviews data is invalid." };
    }

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription: shortDescription || null,
        price,
        compareAtPrice:
          compareAtPrice && compareAtPrice > 0 ? compareAtPrice : null,
        stock,
        featured,
        badge: badge || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        benefits: benefits.length ? benefits : Prisma.JsonNull,
        categoryId,
        sizeGuideEnabled,
        sizeGuideTitle: sizeGuideEnabled ? sizeGuideTitle || "Size guide" : null,
        sizeGuideContent: sizeGuideEnabled ? sizeGuideContent || null : null,
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
        images: {
          create: parsedImageUrls.map((url, index) => ({
            url,
            alt: name,
            order: index,
          })),
        },
        variants: {
          create: parsedVariants.map((variant) => ({
            name: variant.name,
            price: variant.price ?? null,
            stock: normalizeStock(variant.stock ?? 0),
            options: {
              create: (variant.options ?? []).map((option) => ({
                name: option.name,
                value: option.value,
              })),
            },
          })),
        },
        reviews: {
          create: parsedReviews.map((review) => ({
            authorName: review.authorName,
            authorCountry: review.authorCountry || null,
            rating: review.rating,
            title: review.title || null,
            content: review.content,
            imageUrl: review.imageUrl || null,
            verified: review.verified ?? false,
            source: review.source || null,
            reviewDate: review.reviewDate ? new Date(review.reviewDate) : null,
            sortOrder: review.sortOrder ?? 0,
          })),
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong while creating the product." };
  }
}

export async function updateProduct(
  _prevState: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  try {
    await requireAdmin();

    const productId = String(formData.get("productId") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const shortDescription = String(
      formData.get("shortDescription") || "",
    ).trim();
    const price = Number(formData.get("price") || 0);
    const compareAtPriceRaw = String(formData.get("compareAtPrice") || "").trim();
    const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;
    const stock = normalizeStock(formData.get("stock") || 0);
    const featured = formData.get("featured") === "on";
    const badge = String(formData.get("badge") || "").trim();
    const seoTitle = String(formData.get("seoTitle") || "").trim();
    const seoDescription = String(formData.get("seoDescription") || "").trim();
    const benefits = parseBenefits(String(formData.get("benefits") || ""));
    const categoryId = String(formData.get("categoryId") || "").trim();
    const tagIds = formData.getAll("tagIds").map(String).filter(Boolean);

    const sizeGuideEnabled = formData.get("sizeGuideEnabled") === "on";
    const sizeGuideTitle = String(formData.get("sizeGuideTitle") || "").trim();
    const sizeGuideContent = String(
      formData.get("sizeGuideContent") || "",
    ).trim();

    const imageUrlsRaw = String(formData.get("imageUrls") || "");
    const variantsRaw = String(formData.get("variantsJson") || "");
    const reviewsRaw = String(formData.get("reviewsJson") || "");

    if (!productId || !name || !slug || !description || !categoryId) {
      return { error: "Please fill in all required fields." };
    }

    const parsedImageUrls = parseImageUrls(imageUrlsRaw);

    let parsedVariants: ParsedVariant[] = [];
    try {
      parsedVariants = parseVariants(variantsRaw);
    } catch {
      return { error: "Variants data is invalid." };
    }

    let parsedReviews: ParsedReview[] = [];
    try {
      parsedReviews = parseReviews(reviewsRaw);
    } catch {
      return { error: "Reviews data is invalid." };
    }

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        slug,
        description,
        shortDescription: shortDescription || null,
        price,
        compareAtPrice:
          compareAtPrice && compareAtPrice > 0 ? compareAtPrice : null,
        stock,
        featured,
        badge: badge || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        benefits: benefits.length ? benefits : Prisma.JsonNull,
        categoryId,
        sizeGuideEnabled,
        sizeGuideTitle: sizeGuideEnabled ? sizeGuideTitle || "Size guide" : null,
        sizeGuideContent: sizeGuideEnabled ? sizeGuideContent || null : null,
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
        images: {
          deleteMany: {},
          create: parsedImageUrls.map((url, index) => ({
            url,
            alt: name,
            order: index,
          })),
        },
        variants: {
          deleteMany: {},
          create: parsedVariants.map((variant) => ({
            name: variant.name,
            price: variant.price ?? null,
            stock: normalizeStock(variant.stock ?? 0),
            options: {
              create: (variant.options ?? []).map((option) => ({
                name: option.name,
                value: option.value,
              })),
            },
          })),
        },
        reviews: {
          deleteMany: {},
          create: parsedReviews.map((review) => ({
            authorName: review.authorName,
            authorCountry: review.authorCountry || null,
            rating: review.rating,
            title: review.title || null,
            content: review.content,
            imageUrl: review.imageUrl || null,
            verified: review.verified ?? false,
            source: review.source || null,
            reviewDate: review.reviewDate ? new Date(review.reviewDate) : null,
            sortOrder: review.sortOrder ?? 0,
          })),
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath("/shop");
    revalidatePath(`/shop/${slug}`);
    revalidatePath(`/product/${slug}`);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong while updating the product." };
  }
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  await prisma.$transaction(async (tx) => {
    await tx.variantOption.deleteMany({
      where: {
        variant: {
          productId,
        },
      },
    });

    await tx.productVariant.deleteMany({
      where: {
        productId,
      },
    });

    await tx.productReview.deleteMany({
      where: {
        productId,
      },
    });

    await tx.product.delete({
      where: {
        id: productId,
      },
    });
  });
}