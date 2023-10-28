"use client";

import TodoMessage from "@/app/components/TodoMessage";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function Page() {
  const session = useSession();
  const { publicid } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (session.data?.user?.publicId === publicid) {
      router.push("/mypage");
    }
  }, [session.status]);

  return session.status === "loading" ? <Loading /> : <TodoMessage />;
}
