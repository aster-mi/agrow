"use client";

import { useState, ChangeEvent, useEffect, Suspense } from "react";
import { toast } from "react-toastify";
import supabase from "@/app/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import {
  addImages,
  deleteAgave,
  deleteImage,
  getAgave,
  setAgaveIcon,
} from "@/app/agave/api";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AgaveType } from "@/app/type/AgaveType";
import Image from "next/image";
import compressImage from "@/app/utils/compressImage";
import ImageModal from "@/app/components/ImageModal";
import AddImageSvg from "@/app/components/svg/AddImageSvg";
import Loading from "./loading";
import LoadingImage from "@/app/components/LoadingImage";
import pup from "@/public/pup.png";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import MenuButton from "@/app/components/MenuButton";
import ShareButtons from "@/app/components/ShareButtons";
import localImage from "@/public/agave.jpeg";
import OffStarSvg from "@/app/components/svg/OffStar";
import TagSvg from "@/app/components/svg/TagSvg";
import { headers } from "next/headers";

const Page = () => {
  const { slug } = useParams();
  const [agave, setAgave] = useState<AgaveType | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const router = useRouter();

  const currentURL = process.env.NEXT_PUBLIC_APP_BASE_URL + usePathname();

  const handleImageClick = (imageUrl: string, shareUrl: string) => {
    setSelectedImage(imageUrl);
    setShareUrl(shareUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setShareUrl(null);
    setIsModalOpen(false);
  };

  const fetchData = async () => {
    try {
      const agave: AgaveType = await getAgave(slug as string);
      setAgave(agave);
    } catch (error) {
      toast.error("データ取得に失敗しました");
      router.back();
    }
  };

  useEffect(() => {
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
            cacheControl: "2592000",
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

  const handleDeleteAgave = async () => {
    await deleteAgave(slug as string);
    toast.success("削除完了");
    router.back();
  };

  const handleDeleteImage = async () => {
    const fileName = selectedImage!
      .substring(selectedImage!.lastIndexOf("/") + 1)
      .replace(".jpg", "");
    await deleteImage(slug as string, fileName);
    fetchData();
    toast.success("画像を削除しました");
  };

  const handleSetIcon = async () => {
    const fileName = selectedImage!.substring(
      selectedImage!.lastIndexOf("/agave") + 1
    );
    await setAgaveIcon(slug as string, fileName);
    fetchData();
    toast.success("アイコンを設定しました");
  };

  return (
    <div>
      {agave === null ? (
        // Agaveデータのロード中に表示するローディング
        <Loading />
      ) : (
        <div>
          <div className="flex border-b border-gray-300">
            <div className="w-2/12 flex justify-center">
              {agave.iconUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${agave.iconUrl}`}
                  alt={`Image icon`}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <div>ICON未設定</div>
              )}
            </div>
            <div className="w-8/12 text-center">
              <p className="break-all p-2">{agave.name}</p>
            </div>
            <div className="w-3/12 flex">
              <div className="p-3">
                <OffStarSvg />
              </div>
              <div className="text-right">
                <MenuButton
                  contents={
                    <>
                      <ShareButtons url={currentURL} />
                      <DeleteButton onDelete={handleDeleteAgave} name={"株"} />
                    </>
                  }
                />
              </div>
            </div>
          </div>
          {/* TODO */}
          <div>
            <div className="flex">
              <TagSvg />
              チタノタ
            </div>
            <p>{agave.description}</p>
          </div>
          <div className="flex my-2">
            <div className="w-5/6">
              <div>
                <p>オーナー: {agave.ownerName}</p>
                {agave.parentSlug && (
                  <div>
                    <div>
                      親株:
                      <Link
                        href={"/agave/" + agave.parentSlug}
                        className="rounded-xl px-1 ml-2 bg-white text-gray-700 w-3/4"
                      >
                        <span className="">{agave.parentName}</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/6">
              <div className="flex items-center justify-center">
                <Link href={slug + "/pup"}>
                  <div className="p-1 rounded-xl bg-white">
                    <Image src={pup} alt="pup" width={40} height={40} />
                  </div>
                </Link>
              </div>
            </div>
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
                              onClick={() =>
                                handleImageClick(`${previewURL}`, "")
                              }
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
                          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${imageUrl}`,
                          `${
                            process.env.NEXT_PUBLIC_APP_BASE_URL
                          }/agave/${slug}/image/${imageUrl
                            .substring(imageUrl.lastIndexOf("/") + 1)
                            .replace(".jpg", "")}`
                        )
                      }
                      width={200}
                      height={200}
                    />
                  </div>
                ))}
            </div>
          )}
          <ImageModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onDelete={handleDeleteImage}
            onSetIcon={handleSetIcon}
            imageUrl={selectedImage!}
            shareUrl={shareUrl!}
          />
        </div>
      )}
      <div className="h-10 w-full"></div>
      <div className="h-10 w-full"></div>
    </div>
  );
};

export default Page;
