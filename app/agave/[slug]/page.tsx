"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import supabase from "@/app/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { addImages, getAgave } from "../api";
import { useParams, useRouter } from "next/navigation";
import { AgaveType } from "@/app/type/AgaveType";
import { toast } from "react-toastify";

const Page = () => {
  const { slug } = useParams();
  const [uploadedImageURLs, setUploadedImageURLs] = useState<string[]>([]);
  const [agave, setAgave] = useState<AgaveType>();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const agave: AgaveType = await getAgave(slug as string);
      setAgave(agave);
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

      setUploadedImageURLs([]);
      toast.success("画像追加完了");

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

      {agave && (
        <div>
          <h2>Agave Details</h2>
          <p>ID: {agave.id}</p>
          <p>Slug: {agave.slug}</p>
          <p>Name: {agave.name}</p>
          <p>Description: {agave.description}</p>
          {/* 画像の表示 */}
          {agave.images && (
            <div>
              <h3>Images</h3>
              {agave.images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imageUrl}`} // プライベートバケットのパスを指定
                  alt={`Image ${index}`}
                  width={100}
                />
              ))}
            </div>
          )}
          <p>Owner ID: {agave.ownerId}</p>
          <p>Parent ID: {agave.parentId}</p>
        </div>
      )}
    </div>
  );
};

export default Page;
