"use client";

import { signOut } from "@/server/auth";
import { User } from "@/types/user";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { NextRequest } from 'next/server';

type UserInfoProps = {
  user: User;
}


export default function UserNavbar() {
  const cookies = useCookies();
  const router = useRouter();
  const [userIsLoggedIn, setUserIsLoggedIn] = React.useState(false)
  const [username, setUsername] = React.useState(undefined)
  
  useEffect(() => {    
    if ( cookies.get("user_data") ) {
      setUsername(JSON.parse(cookies.get("user_data"))["username"]);
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
        <ul className="hidden md:flex items-center gap-x-6">
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