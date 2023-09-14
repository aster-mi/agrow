"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import supabase from "@/app/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { addImages, getAgave } from "../api";
import { useParams } from "next/navigation";
import { AgaveType } from "@/app/type/AgaveType";

const Page = () => {
  const { slug } = useParams();
  const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);
  const [agave, setAgave] = useState<AgaveType>();

  useEffect(() => {
    (async () => {
      setAgave(await getAgave(slug as string));
      alert(agave?.images);
    })();
  }, []);

  const handleImagesUploaded = (imageURLs: string[]) => {
    setUploadedImageURLs(imageURLs);
  };

  const handleUpload = async () => {
    try {
      if (!agave) {
        throw "agave not found.";
      }
      // 画像をSupabaseにアップロード
      const uploadPromises = uploadedImageURLs.map(async (previewURL) => {
        const response = await fetch(previewURL);
        const blob = await response.blob();
        const fileName = `agave/${uuidv4()}.jpg`;

        const { data, error } = await supabase.storage
          .from("photos")
          .upload(fileName, blob, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          throw error;
        }

        return data?.path || "";
      });

      const imagePaths = await Promise.all(uploadPromises);

      await addImages({
        id: agave.id,
        slug: slug as unknown as string,
        images: imagePaths, // 画像の URL をサーバーに送信
      });

      console.log("add images");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <h1>Upload Images</h1>
      <ImageUploader onImagesUploaded={handleImagesUploaded} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Page;
