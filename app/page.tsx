"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import AgrowLogo from "./components/AgrowLogo";
import Link from "next/link";
import Image from "next/image";
import rackPng from "@/public/rack.png";

export default function Page() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <AgrowLogo />

      <div className="mt-10">
        <div className="mx-auto">
          {session ? (
            <Link
              href="/rack"
              className="flex flex-row items-center justify-center rounded-full bg-black border border-yellow-100 bg-opacity-50 shadow-inner shadow-yellow-100 px-20 py-2"
            >
              <Image
                src={rackPng}
                width={100}
                alt="rack"
                style={{ width: "25px", height: "25px" }}
              />
              <div className="text-xl ml-1 font-bold">棚を確認する</div>
            </Link>
          ) : (
            <>
              <h1 className="text-2xl font-bold">ようこそ、 Agrow へ</h1>
              <p className="text-gray-400">こちらからログインしてください</p>
              <button
                className="w-full rounded-none border-none bg-green-500 text-white font-bold p-2 mt-5"
                onClick={() => signIn()}
              >
                ログイン
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
