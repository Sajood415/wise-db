import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const staticAssetRegex = /\.(png|jpe?g|gif|svg|ico|webp|avif|css|js|map|txt|woff2?|ttf|eot)$/i;
const publicPaths = [
  "/", "/login", "/signup", "/about", "/help", "/how-it-works", "/services",
  "/report-fraud", "/enterprise", "/pricing", "/privacy", "/terms", "/contact",
  "/docs", "/api-docs", "/forgot-password", "/reset-password",
  "/api/auth/login", "/api/auth/signup", "/api/auth/enterprise-signup",
  "/api/auth/forgot-password", "/api/auth/reset-password",
  "/api/fraud", "/api/external", "/api/help", "/api/enterprise$",
  "/dashboard/payment/success", "/dashboard/payment/cancel",
  "/api/payment/enterprise/verify", "/api/webhooks/stripe", "/uploads",
];

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => {
    if (p.endsWith("$")) return pathname === p.slice(0, -1);
    return pathname === p || pathname.startsWith(p + "/");
  });
}

function failAuth(isApi: boolean, request: NextRequest, pathname: string) {
  if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL("/login", request.url);
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (staticAssetRegex.test(pathname)) return NextResponse.next();
  if (pathname.startsWith("/_next") || pathname.startsWith("/api/public") || pathname.startsWith("/uploads/")) {
    return NextResponse.next();
  }
  if (isPublicPath(pathname)) return NextResponse.next();
  if (pathname.startsWith("/dashboard/payment/")) return NextResponse.next();

  const isApi = pathname.startsWith("/api/");
  const cookieToken = request.cookies.get("auth-token")?.value;
  const authHeader = request.headers.get("authorization") || "";
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
  const apiKey = request.headers.get("x-api-key")?.trim();
  const flutterKey = process.env.FLUTTER_API_KEY?.trim();

  let token = cookieToken;
  if (!token && flutterKey && apiKey === flutterKey && bearerToken) token = bearerToken;
  if (!token) return failAuth(isApi, request, pathname);
  if (bearerToken && !cookieToken && (!flutterKey || apiKey !== flutterKey)) {
    return failAuth(isApi, request, pathname);
  }

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "your-secret-key");
  let decoded: { userId?: string; email?: string; role?: string };
  try {
    const { payload } = await jwtVerify(token, secret);
    decoded = payload as { userId?: string; email?: string; role?: string };
  } catch {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const res = NextResponse.redirect(new URL("/login", request.url));
    res.cookies.delete("auth-token");
    return res;
  }

  const role = decoded.role || "";
  if (pathname.startsWith("/admin") && role !== "super_admin") {
    if (isApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  if (pathname.startsWith("/manage") && !["sub_admin", "enterprise_admin", "super_admin"].includes(role)) {
    if (isApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const headers = new Headers(request.headers);
  headers.set("x-user-id", String(decoded.userId ?? ""));
  headers.set("x-user-email", String(decoded.email ?? ""));
  headers.set("x-user-role", String(decoded.role ?? ""));

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
