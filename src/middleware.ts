import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose';

export const config = { matcher: ["/dashboard", "/simplelist", "/task/:path*"]}


export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  const userData = request.cookies.get("user_data")?.value;

  let isValid = false;

  if (sessionToken && process.env.SECRET_KEY) {
    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      await jwtVerify(sessionToken, secret, { algorithms: ["HS256"] });
      isValid = true;
    } catch {
      isValid = false;
    }
  }

  let username: string | undefined;
  if (userData) {
    try {
      username = JSON.parse(userData)["username"];
    } catch {
      username = undefined;
    }
  }

  if (!isValid || !username) {
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      const res = NextResponse.redirect(new URL('/login?callbackUrl=' + callbackUrl, request.url));
      res.cookies.delete("session");
      res.cookies.delete("user_data");
      return res
  }
  return NextResponse.next()
}