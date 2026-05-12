"use client";

import { useState } from "react";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialForm: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const initialErrors: FormErrors = {};

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!subject) {
    errors.subject = "Please enter a subject.";
  } else if (subject.length < 3) {
    errors.subject = "Subject must be at least 3 characters.";
  }

  if (!message) {
    errors.message = "Please enter a message.";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

export default function ContactPageClient() {
  const [form, setForm] = useState<FormValues>(initialForm);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccess("");
    setError("");
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name } = e.target;
    const nextErrors = validateForm(form);

    setErrors((prev) => ({
      ...prev,
      [name]: nextErrors[name as keyof FormValues] || "",
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSuccess("");
    setError("");

    const trimmedForm = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    const nextErrors = validateForm(trimmedForm);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not send message.");
      }

      setSuccess("Your message has been received.");
      setForm(initialForm);
      setErrors(initialErrors);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#dddad5] text-black">
      <div className="mx-auto max-w-[1600px] px-6 pb-20 pt-28 sm:px-8 lg:px-12">
        <section className="border-b border-black/10 pb-14 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="max-w-[980px]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-black/45">
                Contact
              </p>

              <h1
                style={{ fontFamily: "Mango" }}
                className="mt-5 text-[clamp(3.4rem,9vw,9rem)] uppercase leading-[0.88] tracking-[-0.02em]"
              >
                Let&apos;s talk
              </h1>

              <p className="mt-6 max-w-[620px] text-[15px] leading-7 text-black/62 md:text-base">
                Questions about products, orders, shipping, returns or general
                enquiries — get in touch and we&apos;ll get back to you as soon
                as possible.
              </p>
            </div>

            <div className="flex flex-col justify-end">
              <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-black/10 pt-6 sm:grid-cols-3 lg:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Response
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    24–48h
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Support
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    Email
                  </p>
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-black/40">
                    Since
                  </p>
                  <p className="mt-2 text-2xl leading-none tracking-[-0.04em]">
                    2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-12 pt-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16 lg:pt-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-black/10 bg-[#e6e2dc]">
              <div className="border-b border-black/10 px-6 py-6 sm:px-8">
                <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                  Contact details
                </p>

                <h2 className="mt-3 text-[1.4rem] uppercase tracking-[-0.04em]">
                  Reach us
                </h2>
              </div>

              <div className="space-y-8 px-6 py-6 sm:px-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                    Email
                  </p>
                  <a
                    href="mailto:sales@petsaco.com"
                    className="mt-2 block text-base tracking-[-0.02em] text-black transition hover:opacity-70"
                  >
                    sales@petsaco.com
                  </a>
                </div>

                <div className="border-t border-black/10 pt-8">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                    Support hours
                  </p>
                  <div className="mt-3 space-y-2 text-sm leading-6 text-black/65">
                    <p>Monday — Friday</p>
                    <p>We typically reply within 24–48 hours.</p>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-8">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                    Business location
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/65">
                    Based in Norway, serving customers in selected international
                    markets.
                  </p>
                </div>

                <div className="border-t border-black/10 pt-8">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
                    Customer support
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/65">
                    For order questions, shipping updates, returns, refunds,
                    product questions, or general support, please contact us by
                    email.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="border border-black/10 bg-[#e6e2dc]">
              <div className="border-b border-black/10 px-6 py-6 sm:px-8">
                <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
                  Send a message
                </p>

                <h2 className="mt-3 text-[1.4rem] uppercase tracking-[-0.04em]">
                  General enquiry
                </h2>
              </div>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="px-6 py-6 sm:px-8"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-black/45">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.name}
                      className={`w-full border bg-[#f3efe8] px-4 py-4 text-sm outline-none transition placeholder:text-black/35 ${
                        errors.name
                          ? "border-black"
                          : "border-black/10 focus:border-black"
                      }`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-[12px] text-black/60">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-black/45">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={!!errors.email}
                      className={`w-full border bg-[#f3efe8] px-4 py-4 text-sm outline-none transition placeholder:text-black/35 ${
                        errors.email
                          ? "border-black"
                          : "border-black/10 focus:border-black"
                      }`}
                      placeholder="Your email"
                    />
                    {errors.email && (
                      <p className="mt-2 text-[12px] text-black/60">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-black/45">
                    Subject
                  </label>
                  <input
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.subject}
                    className={`w-full border bg-[#f3efe8] px-4 py-4 text-sm outline-none transition placeholder:text-black/35 ${
                      errors.subject
                        ? "border-black"
                        : "border-black/10 focus:border-black"
                    }`}
                    placeholder="Subject"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-[12px] text-black/60">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <label className="mb-3 block text-[11px] uppercase tracking-[0.18em] text-black/45">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={!!errors.message}
                    rows={8}
                    className={`w-full resize-none border bg-[#f3efe8] px-4 py-4 text-sm outline-none transition placeholder:text-black/35 ${
                      errors.message
                        ? "border-black"
                        : "border-black/10 focus:border-black"
                    }`}
                    placeholder="Write your message..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-[12px] text-black/60">
                      {errors.message}
                    </p>
                  )}
                </div>

                {(success || error) && (
                  <div className="mt-6 border border-black/10 bg-[#f3efe8] px-4 py-4 text-sm">
                    <p className={success ? "text-black" : "text-black/70"}>
                      {success || error}
                    </p>
                  </div>
                )}

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center border border-black bg-black px-7 py-4 text-[11px] uppercase tracking-[0.18em] text-[#f6f1e8] transition hover:bg-transparent hover:text-black disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
