import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";

export default async function AdminOrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="px-6 py-10 sm:px-8 lg:px-12 min-h-screen">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
          Admin
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
          Orders
        </h1>

        <div className="mt-10 space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-black/10 bg-white p-6">
              <div className="flex flex-col gap-2">
                <p className="text-sm uppercase tracking-[0.14em] text-black/45">
                  {order.customerName ?? "No name"} ·{" "}
                  {order.customerEmail ?? "No email"}
                </p>

                <p className="text-lg font-medium">
                  {order.amountTotal ? formatPrice(order.amountTotal) : "-"}
                </p>

                <p className="text-sm text-black/55">
                  {order.shippingLine1 ?? ""}
                  {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}
                  {order.shippingCity ? `, ${order.shippingCity}` : ""}
                  {order.shippingPostalCode
                    ? `, ${order.shippingPostalCode}`
                    : ""}
                  {order.shippingCountry ? `, ${order.shippingCountry}` : ""}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-t border-black/10 pt-3 text-sm"
                  >
                    <div>
                      <p>{item.productName}</p>
                      {item.variantName ? (
                        <p className="text-black/50">{item.variantName}</p>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <p>Qty: {item.quantity}</p>
                      <p>{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="border border-black/10 bg-white p-6 text-sm uppercase tracking-[0.14em] text-black/45">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
