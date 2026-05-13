import { Home, Receipt, MessageCircle, TrendingUp } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#eeeaf8] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-xl">
        {/* Left — marketing panel */}
        <div className="hidden md:flex flex-col w-[55%] bg-gradient-to-br from-[#7c3aed] to-[#5b21b6] p-10 text-white relative overflow-hidden">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <Home className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold leading-none">RentalApp</div>
              <div className="text-[10px] tracking-widest text-white/60 mt-0.5">LANDLORD DASHBOARD</div>
            </div>
          </div>

          {/* Badge */}
          <span className="self-start mb-6 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-medium tracking-wide text-white/80">
            • FOR PROPERTY OWNERS
          </span>

          {/* Headline */}
          <h2 className="text-3xl font-bold leading-snug mb-3">
            Manage every rental,<br />
            <span className="text-yellow-300">without the spreadsheets.</span>
          </h2>
          <p className="text-sm text-white/70 mb-8 leading-relaxed">
            Track tenants, generate monthly bills, record payments and chase pending dues — all from one place.
          </p>

          {/* Stats card */}
          <div className="rounded-xl bg-white/10 border border-white/20 p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold tracking-widest text-white/60">THIS MONTH</span>
              <span className="rounded-full bg-green-400/20 px-2.5 py-0.5 text-[11px] font-medium text-green-300">
                92% recovered
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">4</div>
                <div className="text-[11px] text-white/60">Properties</div>
              </div>
              <div>
                <div className="text-2xl font-bold">17</div>
                <div className="text-[11px] text-white/60">Tenants</div>
              </div>
              <div>
                <div className="text-2xl font-bold">8,420</div>
                <div className="text-[11px] text-white/60">Pending</div>
              </div>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            <FeatureRow
              icon={<Receipt className="h-4 w-4" />}
              title="Auto-generated bills"
              body="Rent, electricity, gas, water — itemised every month, ready to send."
            />
            <FeatureRow
              icon={<MessageCircle className="h-4 w-4" />}
              title="One-tap reminders"
              body="Nudge tenants on WhatsApp directly from the bill or table view."
            />
            <FeatureRow
              icon={<TrendingUp className="h-4 w-4" />}
              title="See where dues sit"
              body="Color-coded balances — orange means follow up, green means done."
            />
          </div>
        </div>

        {/* Right — sign in form */}
        <div className="flex-1 bg-white flex flex-col justify-center px-10 py-12">
          <span className="self-start mb-4 rounded-full bg-[#ede9ff] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#7c3aed]">
            WELCOME BACK
          </span>
          <h1 className="text-2xl font-bold text-[#1a0f3c] mb-1">Sign in to RentalApp</h1>
          <p className="text-sm text-[#7c6fa0] mb-7">
            Pick up where you left off — your properties, tenants and bills are all waiting.
          </p>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-[12px] text-white/60 leading-relaxed">{body}</div>
      </div>
    </div>
  );
}
