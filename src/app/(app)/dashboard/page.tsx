import Link from "next/link";
import { Receipt, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { routes } from "@/lib/routes";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Home</h1>
        <p className="mt-2 text-muted-foreground">Welcome back. Here&apos;s a quick look at your rentals.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href={routes.bills}>
          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Receipt className="h-5 w-5" />
              </div>
              <CardTitle>Bills</CardTitle>
              <CardDescription>Rent, utilities, and maintenance charges.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Open the bills section →</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={routes.users}>
          <Card className="transition-colors hover:bg-accent">
            <CardHeader>
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <Users className="h-5 w-5" />
              </div>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage tenants across your homes.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Open the users section →</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
