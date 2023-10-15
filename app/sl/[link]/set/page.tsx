"use client";

import SetShortLinkAgave from "@/app/components/SetShortLinkAgave";
import Loading from "@/app/loading";
import { signIn, useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const { link } = useParams();
  const session = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleUpdate = () => {
    router.push(`/sl/${link}`);
  };

  return (
    <div>
      {loading || session.status === "loading" ? (
        <Loading />
      ) : (
        <div>
          {session.status === "authenticated" && (
            <SetShortLinkAgave
              link={link as string}
              onLoading={setLoading}
              onUpdate={handleUpdate}
            />
          )}
          {session.status === "unauthenticated" && (
            <div>
              <div className="text-gray-200">
                まずはこちらからログインしてください
              </div>
              <button
                className="w-full rounded-none border-none bg-green-500 text-white font-bold p-2 mt-5"
                onClick={() => signIn()}
              >
                ログイン
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
