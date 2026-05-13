import Link from "next/link";
import { logoutAction } from "@/controllers/auth.controller";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-violet-200/50 bg-white/60 backdrop-blur-xl dark:border-violet-900/30 dark:bg-[#0d0a1a]/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-2">
        <Link href={routes.home} className="text-lg font-bold tracking-tight">
          App
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href={routes.dashboard} className="text-sm text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link href={routes.bills} className="text-sm text-muted-foreground hover:text-foreground">
            Bills
          </Link>
          <Link href={routes.users} className="text-sm text-muted-foreground hover:text-foreground">
            Users
          </Link>
        </nav>

        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm">
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
}
