"use client";

import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/login" })}
      className="inline-flex items-center justify-center border border-black/10 px-4 py-3 text-sm uppercase tracking-[0.14em] text-black transition hover:border-black"
    >
      Logout
    </button>
  );
}
