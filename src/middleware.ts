import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import getServerAuthSession, { signIn } from './server/auth';
import { jwtVerify } from 'jose';

export const config = { matcher: ["/dashboard", "/simplelist"]}


export async function middleware(request: NextRequest) {
  const serverSession = await getServerAuthSession();
  const userData = cookies().get("user_data")?.value;

  let username;
  if(userData !== undefined){
    username = JSON.parse(userData)["username"];
  }

  if(!serverSession || !username){
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      const res = NextResponse.redirect(new URL('/login?callbackUrl=' + callbackUrl, request.url));
      res.cookies.delete("session");
      res.cookies.delete("user_data");
      return res
  }
  return NextResponse.next()
}