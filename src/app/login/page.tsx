import { AuthShell } from "@/components/auth/auth-shell";
import { MobileAuthShell } from "@/components/auth/mobile-auth-shell";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <>
      {/* Mobile layout */}
      <MobileAuthShell
        title="Sign in to RentalApp"
        description="Your properties, tenants and bills are waiting."
      >
        <LoginForm />
      </MobileAuthShell>

      {/* Desktop layout — original, unchanged */}
      <div className="hidden min-h-screen bg-[#eeeaf8] items-center justify-center p-6 md:flex">
        <AuthShell
          eyebrow="Welcome back"
          title="Sign in to RentalApp"
          description="Pick up where you left off — your properties, tenants and bills are all waiting."
        >
          <LoginForm />
        </AuthShell>
      </div>
    </>
  );
}
