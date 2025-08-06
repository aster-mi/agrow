"use client";

import useSWR from "swr";
import { useSession, signIn, signOut } from "next-auth/react";
import AgrowLogo from "./components/AgrowLogo";
import Link from "next/link";
import Image from "next/image";
import rackPng from "@/public/rack.png";
import LoadingAnime from "./components/LoadingAnime";
import Room from "./components/Room";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import fromNow from "./utils/fromNow";
import Loading from "./loading";
import useNews, { News } from "./hooks/useNews";
import useProfile from "./hooks/useProfile";

export default function Page() {
  const session = useSession();
  const { newsList, newsError, newsLoading } = useNews();
  const { profile, profileError, profileLoading } = useProfile();
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  if (newsLoading || profileLoading) return <Loading />;
  if (newsError || profileError || !profile) return <div>failed to load</div>;

  return (
    <div
      className="absolute top-0 left-0 flex flex-col items-center justify-center h-screen w-screen bg-black"
      style={{ zIndex: "60" }}
    >
      <Room />
      <div className="w-full p-3">
        <AgrowLogo />
      </div>

      <div className="mt-10">
        <div className="mx-auto">
          {session.status === "authenticated" && (
            <>
              <div className="text-center m-3">
                こんにちは {profile.name} さん
              </div>
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
                <div className="text-xl ml-1 font-bold">ラックを確認する</div>
              </Link>
            </>
          )}
          {session.status === "unauthenticated" && (
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
      <Modal
        open={selectedNews !== null}
        onCancel={() => setSelectedNews(null)}
        footer={null}
      >
        <h1>{selectedNews?.title}</h1>
        <div>{selectedNews?.content}</div>
        <div className="text-right text-sm text-gray-500">
          {fromNow(selectedNews?.createdAt)}
        </div>
      </Modal>

      <div className="mt-10">- NEWS -</div>
      <div className="w-full bg-black">
        {newsList.map((news) => (
          <div
            key={news.id}
            onClick={() => setSelectedNews(news)}
            className="flex flex-row justify-between border border-gray-500 text-white p-1 rounded"
          >
            <div>{news.title}</div>
            <div className="text-right text-sm text-gray-500">
              {fromNow(news.createdAt)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
