import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#eeeaf8] flex items-center justify-center p-6">
      <AuthShell
        eyebrow="Get started"
        title="Create your account"
        description="Free for the first 3 properties. No card required to start."
      >
        <RegisterForm />
      </AuthShell>
    </div>
  );
}
