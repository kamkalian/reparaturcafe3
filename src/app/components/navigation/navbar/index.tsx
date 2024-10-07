import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import UserNavbar from "@/app/components/UserNavbar";
import getServerAuthSession from "@/server/auth";


async function Navbar() {
  const authSession = await getServerAuthSession();
  return (
    <div className="w-full h-20 bg-white sticky top-0 shadow z-40 print:hidden">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <Logo />
          <ul className="hidden md:flex items-center gap-x-6">
            <li>
              <UserNavbar/>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;