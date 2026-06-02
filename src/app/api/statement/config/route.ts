import { type NextRequest, NextResponse } from "next/server";
import { getStatementConfig, saveStatementConfig } from "@/controllers/statement.controller";

export async function GET() {
  try {
    const config = await getStatementConfig();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ message: "Failed to fetch config" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  try {
    const config = await saveStatementConfig(body);
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ message: "Failed to save config" }, { status: 500 });
  }
}
