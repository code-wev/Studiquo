import { NextResponse } from "next/server";

/**
 * Safely parse JWT payload
 */
function parseJwt(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(req) {
  const { pathname, origin } = req.nextUrl;
  const now = Math.floor(Date.now() / 1000);

  /**
   * Auth-only public pages (block if logged in)
   */
  const authPages = ["/login", "/register", "/forgot-password"];

  /**
   * Fully public pages (always accessible)
   */
  const openPages = ["/", "/about", "/how-its-works", "/find-tutor", "/home"];

  /**
   * Read token
   */
  const token =
    req.cookies.get("token")?.value ||
    req.cookies.get("accessToken")?.value ||
    req.cookies.get("studiquo_token")?.value;

  const payload = token ? parseJwt(token) : null;
  const isAuthenticated = payload?.exp && payload.exp > now;

  /**
   * 🔒 Block auth pages if already logged in
   */
  if (authPages.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", origin));
  }

  /**
   * 🌍 Allow fully public pages
   */
  if (
    openPages.some(
      (page) => pathname === page || pathname.startsWith(page + "/")
    )
  ) {
    return NextResponse.next();
  }

  /**
   * 🔓 Allow auth pages for logged-out users
   */
  if (authPages.includes(pathname)) {
    return NextResponse.next();
  }

  /**
   * 🔐 All other pages require authentication
   */
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|public).*)"],
};
