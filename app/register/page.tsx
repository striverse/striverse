import { Suspense } from "react";
import RegisterForm from "@/components/RegisterForm";

function RegisterFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#03040a] px-5 text-white">
      <div className="text-sm text-white/60">Loading registration…</div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}
