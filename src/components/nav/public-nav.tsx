import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { isAuthenticated } from "@/lib/session";
import { ThemeToggle } from "@/components/nav/theme-toggle";

export async function PublicNav() {
  const authed = await isAuthenticated();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href={routes.home} className="text-lg font-bold tracking-tight">
          RentalApp
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#video" className="text-sm text-muted-foreground hover:text-foreground">
            Video
          </Link>
          <Link href={routes.contact} className="text-sm text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {authed ? (
            <Link href={routes.dashboard} className={buttonVariants({ size: "sm" })}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href={routes.login} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Login
              </Link>
              <Link href={routes.register} className={buttonVariants({ size: "sm" })}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
