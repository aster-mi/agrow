"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

const Header = () => {
  const session = useSession();
  return (
    <div className="flex flex-row w-full h-10 bg-neutral-800 border-b border-neutral-500 shadow-sm shadow-white">
      <div className="flex flex-col justify-center">
        <Link className="font-bold text-lg text-white ml-3" href={"/"}>
          Agrow
        </Link>
      </div>
      {session.status === "authenticated" && (
        <div className="flex flex-row ml-auto mr-3">
          <div className="flex flex-col justify-center">
            <Link href="/mypage">
              <div className="text-white text-sm">マイページ</div>
            </Link>
          </div>
        </div>
      )}
      {session.status === "unauthenticated" && (
        <div className="flex flex-row ml-auto mr-3">
          <div className="flex flex-col justify-center">
            <div className="text-white text-sm" onClick={() => signIn()}>
              ログイン
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
