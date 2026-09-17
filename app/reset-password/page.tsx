import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";

function ResetPasswordFallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050816] px-6">
      <div className="text-sm text-white/60">Loading reset form…</div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
