"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type CreateProductState = {
  error?: string;
  success?: boolean;
};

export async function createProduct(
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  try {
    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);
    const featured = formData.get("featured") === "on";
    const categoryId = String(formData.get("categoryId") || "").trim();

    const imageUrlsRaw = String(formData.get("imageUrls") || "").trim();

    if (!name || !slug || !description || !categoryId) {
      return { error: "Please fill in all required fields." };
    }

    const parsedImageUrls = imageUrlsRaw
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const variantsRaw = String(formData.get("variantsJson") || "").trim();

    let parsedVariants:
      | {
          name: string;
          price?: number | null;
          stock?: number;
          options?: { name: string; value: string }[];
        }[]
      | [] = [];

    if (variantsRaw) {
      try {
        parsedVariants = JSON.parse(variantsRaw);
      } catch {
        return {
          error:
            "Variants JSON is invalid. Check the format and try again.",
        };
      }
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
            price:
              typeof variant.price === "number" ? variant.price : null,
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

    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong while creating the product." };
  }
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
}