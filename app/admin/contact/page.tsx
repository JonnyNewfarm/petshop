import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ContactInboxClient from "@/components/ContactInboxClient";

export default async function AdminContactPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ContactInboxClient messages={messages} />;
}
