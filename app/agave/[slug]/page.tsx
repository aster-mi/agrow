"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { toast } from "react-toastify";
import supabase from "@/app/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { addImages, getAgave } from "@/app/agave/api";
import { useParams, useRouter } from "next/navigation";
import { AgaveType } from "@/app/type/AgaveType";
import Image from "next/image";
import compressImage from "@/app/utils/compressImage";

const Page = () => {
  const { slug } = useParams();
  const [agave, setAgave] = useState<AgaveType | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const agave: AgaveType = await getAgave(slug as string);
        setAgave(agave);
      } catch (error) {
        console.error("Error fetching agave:", error);
      }
    };
    fetchData();
  }, [fileInputKey, slug]);

  const handleChangeFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const compressedURLs = await Promise.all(
        Array.from(files).map(async (file) => {
          const compressedImage = await compressImage(file);
          return URL.createObjectURL(compressedImage);
        })
      );
      setPreviewImages(compressedURLs);
    }
  };

  const handleUpload = async () => {
    try {
      if (!agave) {
        throw "agave not found.";
      }

      // 画像をSupabaseにアップロード
      const uploadPromises = previewImages.map(async (previewURL) => {
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
        id: agave.id as number,
        slug: slug as unknown as string,
        images: imagePaths,
      });

      setPreviewImages([]);
      setFileInputKey((prevKey) => prevKey + 1);
      toast.success("画像追加完了");
      console.log("add images");
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <h1>Upload Images</h1>
      {agave && (
        <div>
          <input
            key={fileInputKey}
            type="file"
            accept=".jpeg, .jpg, .png"
            multiple
            onChange={handleChangeFiles}
            className="w-full p-2 border rounded"
          />

          <div className="flex overflow-x-auto whitespace-nowrap p-2">
            {previewImages.map((previewURL, index) => (
              <div
                key={index}
                className="mr-4 max-w-xs overflow-hidden rounded shadow-lg"
              >
                <Image
                  src={previewURL}
                  alt={`Preview ${index}`}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}

      {agave && (
        <div>
          <h2>Agave Details</h2>
          <p>ID: {agave.id}</p>
          <p>Slug: {agave.slug}</p>
          <p>Name: {agave.name}</p>
          <p>Description: {agave.description}</p>
          {agave.images && (
            <div className="grid grid-cols-4 gap-0">
              {agave.images &&
                agave.images.map((imageUrl, index) => (
                  <div key={index} className="rounded overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imageUrl}`}
                      alt={`Image ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
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
