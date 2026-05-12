import { type NextRequest, NextResponse } from "next/server";
import { clearSessionToken } from "@/lib/session";
import { routes } from "@/lib/routes";

export async function GET(request: NextRequest) {
  await clearSessionToken();
  const loginUrl = new URL(routes.login, request.url);
  return NextResponse.redirect(loginUrl);
}
