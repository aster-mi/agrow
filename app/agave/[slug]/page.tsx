"use client";

import { useState, ChangeEvent, useEffect, Suspense } from "react";
import { toast } from "react-toastify";
import supabase from "@/app/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { addImages, getAgave } from "@/app/agave/api";
import { useParams, useRouter } from "next/navigation";
import { AgaveType } from "@/app/type/AgaveType";
import Image from "next/image";
import compressImage from "@/app/utils/compressImage";
import ImageModal from "@/app/components/ImageModal";
import AddImageSvg from "@/app/components/svg/AddImageSvg";
import Loading from "./loading";
import LoadingImage from "@/app/components/LoadingImage";
import pup from "@/public/pup.png";
import Link from "next/link";

const Page = () => {
  const { slug } = useParams();
  const [agave, setAgave] = useState<AgaveType | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const router = useRouter();

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

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
      setIsImageProcessing(true);
      setPreviewImages(new Array(files.length).fill(""));
      const compressedURLs = await Promise.all(
        Array.from(files).map(async (file) => {
          const compressedImage = await compressImage(file);
          return URL.createObjectURL(compressedImage);
        })
      );
      setPreviewImages(compressedURLs);
    } else {
      setPreviewImages([]);
    }
    setIsImageProcessing(false);
  };

  const handleUpload = async () => {
    try {
      if (previewImages.length == 0) {
        toast.warn("画像が選択されていません。");
        return;
      }
      if (!agave) {
        throw "agave not found.";
      }
      setIsUploading(true);

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
      toast.success("画像アップロード完了");
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePup = async () => {
    router.push("/pup");
  };

  return (
    <div>
      {agave === null ? (
        // Agaveデータのロード中に表示するローディング
        <Loading />
      ) : (
        <div>
          <div className="my-4">
            <span className="text-3xl font-semibold">{agave.name}</span>
            <p className="mt-2 text-gray-300">{agave.description}</p>
            <p>オーナー: {agave.ownerName}</p>
            {agave.parentSlug && (
              <span>
                親株:
                <Link
                  href={"/agave/" + agave.parentSlug}
                  className="rounded-xl px-1 ml-2 bg-white text-gray-700"
                >
                  <span>{agave.parentName}</span>
                </Link>
              </span>
            )}
            <Link href={slug + "/pup"}>
              <div className="flex flex-col items-end justify-center">
                <div
                  className="flex flex-col items-center bg-gray-100 rounded-xl px-2 mr-2 rounded"
                  // onClick={handlePup}
                >
                  <Image
                    src={pup}
                    alt="pup"
                    className="rounded-xl rounded"
                    width={50}
                    height={50}
                  />
                  <div className="text-gray-600 text-xs">子株一覧</div>
                </div>
              </div>
            </Link>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-0">
              <label
                htmlFor="dropzone-file"
                className="border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center">
                  <p className="m-2 text-sm text-gray-500 dark:text-gray-400">
                    <AddImageSvg />
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  key={fileInputKey}
                  type="file"
                  accept=".jpeg, .jpg, .png"
                  multiple
                  onChange={handleChangeFiles}
                  className="hidden"
                />
              </label>
            </div>
            {isUploading ? (
              <div
                className="flex justify-center m-4"
                aria-label="アップロード中"
              >
                <div className="animate-spin h-8 w-8 bg-white rounded-xl"></div>
              </div>
            ) : (
              <div>
                {previewImages.length > 0 && (
                  <div>
                    <div className="flex overflow-x-auto whitespace-nowrap">
                      {previewImages.map((previewURL, index) => (
                        <div
                          key={index}
                          className="mr-4 max-w-xs overflow-hidden rounded shadow-lg"
                          style={{ flex: "0 0 auto", width: "100px" }} // 固定サイズのスタイルを追加
                        >
                          {isImageProcessing ? (
                            // 圧縮中
                            <LoadingImage />
                          ) : (
                            <Image
                              src={previewURL}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover" // 画像を親要素に合わせて表示
                              onClick={() => handleImageClick(`${previewURL}`)}
                              width={50}
                              height={50}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {!isImageProcessing && (
                      <div className="grid grid-cols-1 gap-0">
                        <button
                          onClick={handleUpload}
                          className="relative inline-flex items-center justify-center overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 focus:ring-1 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                        >
                          <span className="m-2 text-xl text-white">
                            <span>投稿</span>
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {agave.images && (
            <div className="grid grid-cols-3 gap-0 w-full h-full">
              {agave.images &&
                agave.images.map((imageUrl, index) => (
                  <div key={index} className="p-px overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imageUrl}`}
                      alt={`Image ${index}`}
                      className="w-full h-full object-cover"
                      onClick={() =>
                        handleImageClick(
                          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imageUrl}`
                        )
                      }
                      width={1000}
                      height={1000}
                    />
                  </div>
                ))}
            </div>
          )}
          <ImageModal
            isOpen={isModalOpen}
            onClose={closeModal}
            imageUrl={selectedImage!}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
