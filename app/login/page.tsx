import LoginForm from "@/components/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f6f1e8] px-6 py-28 text-black sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[520px] border border-black/10 bg-white p-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-black/45">
          Admin
        </p>

        <h1 className="mt-4 text-[clamp(2.5rem,6vw,4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em]">
          Login
        </h1>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
