import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#eeeaf8] flex items-center justify-center p-6">
      <AuthShell
        eyebrow="Welcome back"
        title="Sign in to RentalApp"
        description="Pick up where you left off — your properties, tenants and bills are all waiting."
      >
        <LoginForm />
      </AuthShell>
    </div>
  );
}
