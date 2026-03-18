import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  await prisma.contactMessage.update({
    where: { id },
    data: { isRead: true },
  });

  return NextResponse.json({ success: true });
}