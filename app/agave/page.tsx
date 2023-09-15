"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, Input, Button } from "antd";
import { useSession } from "next-auth/react";
import { addAgave } from "./api";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [agaveName, setAgaveName] = useState<string>("");
  const [agaveDescription, setAgaveDescription] = useState<string>("");
  const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // アップロードした画像の URL をサーバーに送信する
    await addAgave({
      name: agaveName,
      description: agaveDescription,
      ownerId: session?.user?.id,
      images: uploadedImageURLs, // 画像の URL をサーバーに送信
    });

    setAgaveName("");
    setAgaveDescription("");
    setUploadedImageURLs([]); // 送信後に画像の URL リストをクリア

    router.push("/"); // 例: ホームページにリダイレクト
  };
  // ...

  // 画像のURLを受け取るコールバック関数
  const handleImagesUploaded = (imageURLs: string[]) => {
    setUploadedImageURLs(imageURLs);
  };

  return (
    <div>
      <Card title="Agave">
        <form className="mb-4 space-y-3" onSubmit={handleSubmit}>
          <input
            value={agaveName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAgaveName(e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="name..."
          />
          <input
            value={agaveDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAgaveDescription(e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="description..."
          />
          <button className="w-full px-4 py-2 text-white bg-blue-500 rounded transform transition-transform duration-200 hover:bg-blue-400 hover:scale-95">
            Add new agave!
          </button>
        </form>
      </Card>
    </div>
  );
}
