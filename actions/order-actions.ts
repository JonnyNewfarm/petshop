"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const allowedStatuses = [
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export async function updateOrderStatus(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const orderId = String(formData.get("orderId") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!orderId || !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    throw new Error("Invalid order status update");
  }

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
  });

  revalidatePath("/admin/orders");
}