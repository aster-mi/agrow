"use client";

import Link from "next/link";
import Image from "next/image";
import rackPng from "@/public/rack.png";
import { useSession } from "next-auth/react";
import AgrowLogo from "./AgrowLogo";

const Header = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-row w-full h-10 bg-neutral-800 border-b border-neutral-500 shadow-sm shadow-white">
      <div className="flex flex-col justify-center">
        <div className="font-bold text-lg text-white ml-3">Agrow</div>
      </div>
    </div>
  );
};

export default Header;
