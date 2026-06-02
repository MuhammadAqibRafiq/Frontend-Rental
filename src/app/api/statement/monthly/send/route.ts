import { type NextRequest, NextResponse } from "next/server";
import { sendMonthlyStatement } from "@/controllers/statement.controller";

export async function POST(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");
  if (!month) return NextResponse.json({ message: "month is required" }, { status: 400 });
  const body = await request.json().catch(() => ({}));
  try {
    const message = await sendMonthlyStatement(month, body?.email);
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ message: "Failed to send statement" }, { status: 500 });
  }
}
