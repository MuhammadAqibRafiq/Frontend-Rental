import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Bills</h1>
        <p className="mt-2 text-muted-foreground">Track rent, utilities, and maintenance charges.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>Bills management UI will be added here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will list charges across your tenants. Tell us what you want here next.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
