import { NextResponse } from "next/server";

/**
 * Safely parse JWT payload
 */
export function parseJwt(token) {
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

  // Auth-only public pages (login, register etc.)
  const authPages = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  // Fully public pages
  const openPages = [
    "/",
    "/about",
    "/how-its-works",
    "/find-tutor",
    "/home",
    "/unauthorized",
  ];

  // API routes - allow all
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Read token from cookies
  const token =
    req.cookies.get("token")?.value ||
    req.cookies.get("accessToken")?.value ||
    req.cookies.get("studiquo_token")?.value;

  const payload = token ? parseJwt(token) : null;

  const isAuthenticated = payload?.exp && payload.exp > now;
  const userRole = payload?.role;

  // 🔒 Block auth pages if already logged in
  if (authPages.includes(pathname) && isAuthenticated) {
    // Role-based redirect
    if (userRole === "Admin")
      return NextResponse.redirect(new URL("/dashboard/admin", origin));
    if (userRole === "Tutor")
      return NextResponse.redirect(new URL("/dashboard/tutor/", origin));
    if (userRole === "Student")
      return NextResponse.redirect(new URL("/student/dashboard", origin));

    // default redirect
    return NextResponse.redirect(new URL("/", origin));
  }

  // 🌍 Allow fully public pages
  if (openPages.includes(pathname)) {
    return NextResponse.next();
  }

  // 🔓 Allow auth pages for logged-out users
  if (authPages.includes(pathname)) return NextResponse.next();

  // 🔐 All other pages require authentication
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based access control
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard/admin")
  ) {
    if (userRole !== "Admin") {
      return NextResponse.redirect(new URL("/login", origin));
    }
  }

  if (
    pathname.startsWith("/dashboard/tutor") ||
    pathname.startsWith("/tutor")
  ) {
    if (userRole !== "Tutor") {
      return NextResponse.redirect(new URL("/login", origin));
    }
  }

  if (
    pathname.startsWith("/dashboard/student") ||
    pathname.startsWith("/student")
  ) {
    if (userRole !== "Student") {
      return NextResponse.redirect(new URL("/login", origin));
    }
  }

  // Allow other authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public/).*)"],
};
