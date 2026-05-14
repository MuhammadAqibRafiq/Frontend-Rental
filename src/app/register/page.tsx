import { AuthShell } from "@/components/auth/auth-shell";
import { MobileAuthShell } from "@/components/auth/mobile-auth-shell";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <>
      {/* Mobile layout */}
      <MobileAuthShell
        title="Create your account"
        description="Free for the first 3 properties. No card required."
      >
        <RegisterForm />
      </MobileAuthShell>

      {/* Desktop layout — original, unchanged */}
      <div className="hidden min-h-screen bg-[#eeeaf8] items-center justify-center p-6 md:flex">
        <AuthShell
          eyebrow="Get started"
          title="Create your account"
          description="Free for the first 3 properties. No card required to start."
        >
          <RegisterForm />
        </AuthShell>
      </div>
    </>
  );
}
