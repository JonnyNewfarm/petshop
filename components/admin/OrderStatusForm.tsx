"use client";

import { useTransition } from "react";
import { updateOrderStatus } from "@/actions/order-actions";

const statuses = [
  { label: "Paid", value: "paid" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await updateOrderStatus(formData);
        });
      }}
      className="flex items-center gap-3"
    >
      <input type="hidden" name="orderId" value={orderId} />

      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => {
          const form = e.currentTarget.form;
          if (form) {
            form.requestSubmit();
          }
        }}
        className="border border-black/10 bg-[#f6f1e8] px-4 py-3 text-sm uppercase tracking-[0.14em] outline-none"
        disabled={isPending}
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      {isPending ? (
        <span className="text-xs uppercase tracking-[0.14em] text-black/45">
          Saving...
        </span>
      ) : null}
    </form>
  );
}
