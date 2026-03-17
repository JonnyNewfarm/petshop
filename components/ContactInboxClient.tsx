"use client";

import { useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export default function ContactInboxClient({
  messages: initialMessages,
}: {
  messages: Message[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [active, setActive] = useState<Message | null>(null);

  async function markRead(id: string) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
    );

    await fetch(`/api/admin/contact/${id}/read`, { method: "POST" });
  }

  async function remove(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await fetch(`/api/admin/contact/${id}`, { method: "DELETE" });
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
          Admin
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
          Contact inbox
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[420px_1fr]">
          <div className="space-y-3">
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActive(m);
                  if (!m.isRead) markRead(m.id);
                }}
                className={`w-full border bg-white p-5 text-left transition hover:border-black ${
                  m.isRead ? "border-black/10" : "border-black"
                }`}
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-black/40">
                  {new Date(m.createdAt).toLocaleDateString()}
                </p>

                <h3 className="mt-2 text-lg font-medium">{m.subject}</h3>

                <p className="mt-1 text-sm text-black/60">
                  {m.name} · {m.email}
                </p>

                {!m.isRead && (
                  <span className="mt-3 inline-block text-[10px] uppercase tracking-[0.2em] text-black">
                    New
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="border border-black/10 bg-white p-8">
            {active ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                  Message
                </p>

                <h2 className="mt-3 text-3xl font-medium">{active.subject}</h2>

                <p className="mt-4 text-sm text-black/60">
                  From {active.name} ({active.email})
                </p>

                <div className="mt-8 whitespace-pre-line text-base leading-7 text-black/75">
                  {active.message}
                </div>

                <div className="mt-10 flex gap-4">
                  <a
                    href={`mailto:${active.email}?subject=Re:${active.subject}`}
                    className="border border-black bg-black px-6 py-4 text-sm uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black"
                  >
                    Reply
                  </a>

                  <button
                    onClick={() => remove(active.id)}
                    className="border border-black/15 px-6 py-4 text-sm uppercase tracking-[0.18em] transition hover:border-black"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-black/50">Select a message to read</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
