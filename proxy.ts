import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes except the login page
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    const session = request.cookies.get("akal-admin-session");
    if (!session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path+"],
};
