"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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

function parseImageUrls(raw: string) {
  return raw
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

function parseVariants(raw: string): ParsedVariant[] {
  if (!raw.trim()) return [];

  const parsed = JSON.parse(raw) as ParsedVariant[];

  return parsed.map((variant) => ({
    name: variant.name,
    price: typeof variant.price === "number" ? variant.price : null,
    stock: typeof variant.stock === "number" ? variant.stock : 0,
    options: (variant.options ?? []).map((option) => ({
      name: option.name,
      value: option.value,
    })),
  }));
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
    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);
    const featured = formData.get("featured") === "on";
    const categoryId = String(formData.get("categoryId") || "").trim();

    const imageUrlsRaw = String(formData.get("imageUrls") || "");
    const variantsRaw = String(formData.get("variantsJson") || "");

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

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        featured,
        categoryId,
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
            stock: variant.stock ?? 0,
            options: {
              create: (variant.options ?? []).map((option) => ({
                name: option.name,
                value: option.value,
              })),
            },
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
    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);
    const featured = formData.get("featured") === "on";
    const categoryId = String(formData.get("categoryId") || "").trim();

    const imageUrlsRaw = String(formData.get("imageUrls") || "");
    const variantsRaw = String(formData.get("variantsJson") || "");

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

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        slug,
        description,
        price,
        stock,
        featured,
        categoryId,
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
            stock: variant.stock ?? 0,
            options: {
              create: (variant.options ?? []).map((option) => ({
                name: option.name,
                value: option.value,
              })),
            },
          })),
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}/edit`);
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong while updating the product." };
  }
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}