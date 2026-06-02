import { type NextRequest, NextResponse } from "next/server";
import { downloadMonthlyCsv } from "@/controllers/statement.controller";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month") ?? undefined;
  try {
    const csv = await downloadMonthlyCsv(month);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="statement-${month ?? "monthly"}.csv"`,
      },
    });
  } catch {
    return NextResponse.json({ message: "Failed to generate statement" }, { status: 500 });
  }
}
