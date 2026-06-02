import { NextResponse } from "next/server";
import { getStatementHistory } from "@/controllers/statement.controller";

export async function GET() {
  try {
    const history = await getStatementHistory();
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ message: "Failed to fetch history" }, { status: 500 });
  }
}
