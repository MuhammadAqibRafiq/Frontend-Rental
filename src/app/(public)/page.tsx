import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Home as HomeIcon, Receipt, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function LandingPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <span className="mb-6 rounded-full border border-border px-4 py-1 text-xs font-medium text-muted-foreground">
            Manage your rentals — simple, fast, secure
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            The easiest way to track <span className="text-muted-foreground">homes, tenants, and bills</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            One dashboard for all your properties. Add tenants, track rent and maintenance, and stay in
            control — without the spreadsheets.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={routes.register} className={buttonVariants({ size: "lg" })}>
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#video" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Watch video
            </Link>
          </div>
        </div>
      </section>

      <section id="video" className="mx-auto max-w-5xl px-6 py-16">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
          <Image
            src="https://images.unsplash.com/photo-1484154218962-a197022b5858?fm=jpg&q=80&w=1920&auto=format&fit=crop"
            alt="Modern rental apartment interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition hover:bg-white hover:scale-105">
              <svg className="ml-1 h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight md:text-4xl">
          Everything you need to run your rentals
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            icon={<HomeIcon className="h-5 w-5" />}
            title="Homes"
            body="Add every property you manage. One source of truth for addresses and tenants."
          />
          <Feature
            icon={<Users className="h-5 w-5" />}
            title="Tenants"
            body="Onboard tenants per home with phone, charges, and active status."
          />
          <Feature
            icon={<Receipt className="h-5 w-5" />}
            title="Bills"
            body="Track rent, utility bills, and maintenance charges in one view."
          />
        </div>
      </section>
    </>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border p-6">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
