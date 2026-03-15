"use client";

import { signOut } from "@/server/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function getClientCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export default function UserNavbar() {
  const router = useRouter();
  const [userIsLoggedIn, setUserIsLoggedIn] = React.useState(false)
  const [username, setUsername] = React.useState(undefined)
  
  useEffect(() => {    
    const userData = getClientCookie("user_data");
    if (userData) {
      setUsername(JSON.parse(userData)["username"]);
      setUserIsLoggedIn(true);
    } else {
      setUserIsLoggedIn(false);
    }
  }, [])

  const handleLogout = () => {
    signOut();
    router.push("/");
    setTimeout(window.location.reload.bind(window.location), 1000);
  }

  if (!userIsLoggedIn || username === undefined) return (
    <Link href="/login">
      <p>Login</p>
    </Link>
  );

  return(
        <ul className="flex flex-row items-center gap-x-6">
          <li>
            <Link href="/dashboard?new=1&in_process=1&done=1">
              <p>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link href="/simplelist">
              <p>Liste</p>
            </Link>
          </li>
          <li>
            <Link href="/statistik">
              <p>Statistiken</p>
            </Link>
          </li>
          <li>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-green-600 rounded-full">
              <span className="font-medium text-white">{username.slice(0,3).toUpperCase()}</span>
            </div>
          </li>
          <li>
            <button onClick={handleLogout}>
              <p>Log out</p>
            </button>
          </li>
        </ul>
  );
}