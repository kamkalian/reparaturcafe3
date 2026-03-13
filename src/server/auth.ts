'use server';

import { jwtVerify } from "jose";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";


export default async function getServerAuthSession(){
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;

    if (sessionToken === undefined) return null;
    if (process.env.SECRET_KEY === undefined) new Error("Secret key is missing.");
    
    const secret = new TextEncoder().encode(process.env.SECRET_KEY)

    let payload;
    try {
        payload = (
            await jwtVerify(sessionToken, secret, {
                algorithms: ["HS256"],
            })
        ).payload;
    } catch {
        console.log("Tampered session cookie: ", sessionToken);
        return null;
    }
    return {user: {username:"oskar"}};

}

export async function getUserID(): Promise<string | null> {
    const value = (await cookies()).get("user_data")?.value;
    if (!value) return null;
    const id = JSON.parse(value)["id"];
    return id != null ? String(id) : null;
}

export async function getUserName(): Promise<string | null> {
    const userData = (await cookies()).get("user_data")?.value;
    if (!userData) return null;
    return JSON.parse(userData)["username"] ?? null;
}


export async function signIn(username: string, password: string, callbackUrl: string) {
    const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/fastapi/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username=' + username + '&password=' + password
    });
    if(!res.ok) {
        return false
    }
    const token = await res.json();
    const cookieStore = await cookies();

    cookieStore.set(
        "session",
        token.access_token,
        {
            maxAge: 60*60*24,
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        }
    )

    const userRes = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/fastapi/user/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + cookieStore.get("session")?.value
            }
        }
    );
    if(!res.ok) {
        return false
    }
    const user = await userRes.json();

    cookieStore.set(
        "user_data",
        JSON.stringify(
            {
                "username": username,
                "id": user.id
            }
        ),
        {
            maxAge: 60*60*24,
            sameSite: "lax",
        }
    )
    redirect(callbackUrl);
  }


  export async function signOut() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.delete("user_data");
  }