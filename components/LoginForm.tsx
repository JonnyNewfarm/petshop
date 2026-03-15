"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin",
    });

    setLoading(false);

    if (result?.error) {
      setError("Feil e-post eller passord.");
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm uppercase tracking-[0.14em]">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm uppercase tracking-[0.14em]"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-black/10 bg-[#f6f1e8] px-4 py-4 outline-none"
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center border border-black bg-black px-7 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black disabled:opacity-50"
      >
        {loading ? "Logger inn..." : "Logg inn"}
      </button>
    </form>
  );
}
