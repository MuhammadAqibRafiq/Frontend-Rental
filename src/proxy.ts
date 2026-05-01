import { NextResponse, type NextRequest } from "next/server";
import { PUBLIC_ONLY_ROUTES, PROTECTED_PREFIXES, routes } from "@/lib/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;
  const isAuthed = Boolean(token);

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isPublicOnly = PUBLIC_ONLY_ROUTES.includes(pathname);

  if (isProtected && !isAuthed) {
    return NextResponse.redirect(new URL(routes.login, request.url));
  }

  if (isPublicOnly && isAuthed) {
    return NextResponse.redirect(new URL(routes.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
