"use client";

import { useState, ChangeEvent, useEffect, Suspense, useRef } from "react";
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
import AddImageSvg from "@/app/components/svg/AddImageSvg";
import LoadingAnime from "@/app/components/LoadingAnime";
import pup from "@/public/dotPup.png";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import MenuButton from "@/app/components/MenuButton";
import ShareButtons from "@/app/components/ShareButtons";
import OffStarSvg from "@/app/components/svg/OffStar";
import TagSvg from "@/app/components/svg/TagSvg";
import GalleryModal from "@/app/components/GalleryModal";
import { ImageType } from "@/app/type/ImageType";
import convertDateToSlashFormat from "@/app/utils/convertDateToSlashFormat";
import buildImageUrl from "@/app/utils/buildImageUrl";
import NoImage from "@/app/components/NoImage";
import Loading from "@/app/loading";
import dotWatering from "@/public/dotWatering.png";

const Page = () => {
  const { slug } = useParams();
  const [agave, setAgave] = useState<AgaveType | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const router = useRouter();

  const currentURL = process.env.NEXT_PUBLIC_APP_BASE_URL + usePathname();

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
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

  const getImage = (index: number) => {
    return agave!.images![index];
  };

  const createShareUrl = (index: number) => {
    const imageUrl = getImage(index).url;
    return `${
      process.env.NEXT_PUBLIC_APP_BASE_URL
    }/agave/${slug}/image/${imageUrl
      .substring(imageUrl.lastIndexOf("/") + 1)
      .replace(".jpg", "")}`;
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

      const uploadImages: ImageType[] = imagePaths.map((imagePath) => ({
        url: imagePath,
        shotDate: new Date().toISOString(),
      }));

      await addImages({
        id: agave.id as number,
        slug: slug as unknown as string,
        images: uploadImages,
      });

      setPreviewImages([]);
      setFileInputKey((prevKey) => prevKey + 1);
      toast.success("画像アップロード完了");
    } catch (error) {
      toast.error("画像アップロードに失敗しました");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAgave = async () => {
    await deleteAgave(slug as string);
    toast.success(agave!.name + "を削除しました");
    router.back();
  };

  const handleDeleteImage = async (index: number) => {
    const imageUrl = getImage(index).url;
    const fileName = imageUrl!
      .substring(imageUrl!.lastIndexOf("/") + 1)
      .replace(".jpg", "");
    await deleteImage(slug as string, fileName);
    fetchData();
    toast.success("画像を削除しました");
  };

  const handleSetIcon = async (index: number) => {
    const imageUrl = getImage(index).url;
    const fileName = imageUrl!.substring(imageUrl!.lastIndexOf("/agave") + 1);
    await setAgaveIcon(slug as string, fileName);
    fetchData();
    toast.success("サムネイルに設定しました");
  };

  function convertToImageGalleryItems(images: ImageType[]) {
    return images.map((image) => ({
      original: buildImageUrl(image.url),
      thumbnail: buildImageUrl(image.url),
      description: convertDateToSlashFormat(image.shotDate as string),
    }));
  }

  return (
    <div>
      {agave === null ? (
        <Loading />
      ) : (
        <div>
          <div className="flex border-b border-gray-300">
            <div className="w-2/12 flex justify-center">
              {agave.iconUrl ? (
                <Image
                  src={buildImageUrl(agave.iconUrl)}
                  alt={`Image icon`}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              ) : (
                <NoImage />
              )}
            </div>
            <div className="w-8/12 text-center">
              <p className="break-all p-2">{agave.name}</p>
            </div>
            <div className="w-3/12 flex">
              <div className="">
                <Image
                  src={dotWatering}
                  alt="watering"
                  width={100}
                  height={100}
                />
              </div>
              <div className="text-right">
                <MenuButton
                  contents={
                    <>
                      <ShareButtons getUrl={() => currentURL} />
                      <DeleteButton
                        onDelete={handleDeleteAgave}
                        title={"株を削除"}
                        buttonClass="text-red-500 w-full border-b border-gray-300 p-2"
                      />
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
            {agave.description && (
              <div
                style={{ whiteSpace: "pre-wrap" }}
              >{`${agave.description}`}</div>
            )}
          </div>
          <div className="flex my-2">
            <div className="w-5/6">
              <div>
                <p>オーナー: {agave.ownerName}</p>
              </div>
            </div>
            <div className="w-1/6">
              <div className="flex flex-row-reverse">
                <div className="w-16 flex flex-col">
                  {agave.parent ? (
                    <Link href={"/agave/" + agave.parent.slug}>
                      <div className="text-gray-700 h-10 rounded-l-full bg-white flex flex-row justify-end items-center overflow-hidden">
                        <div className="text-xs mr-1 font-bold text-gray-700">
                          親
                        </div>
                        <div className="w-10">
                          {agave.parent.iconUrl ? (
                            <Image
                              src={buildImageUrl(agave.parent.iconUrl)}
                              alt="parent"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <NoImage />
                          )}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="text-black h-10 rounded-l-full bg-gray-500 flex flex-row justify-end items-center">
                      <div className="text-xs mr-1 font-bold text-gray-700">
                        親
                      </div>
                      <div className="w-10 text-center">-</div>
                    </div>
                  )}
                  <Link href={slug + "/pup"}>
                    <div className="text-gray-700 h-10 rounded-l-full bg-white flex flex-row justify-end items-center mt-1">
                      <div className="text-xs mr-1 font-bold">子</div>
                      <Image src={pup} alt="pup" width={40} height={40} />
                    </div>
                  </Link>
                </div>
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
              <Loading />
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
                            <Loading />
                          ) : (
                            <Image
                              src={previewURL}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover" // 画像を親要素に合わせて表示
                              // onClick={() =>
                              //   handleImageClick(`${previewURL}`, "")
                              // }
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
              {agave.images.map((image, index) => (
                <div key={index} className="p-px overflow-hidden">
                  <Image
                    src={buildImageUrl(image.url)}
                    alt={`Image ${index}`}
                    className="w-full h-full object-cover"
                    onClick={() => handleImageClick(index)}
                    width={200}
                    height={200}
                  />
                </div>
              ))}
            </div>
          )}
          {agave && agave.images && selectedImageIndex !== null && (
            <GalleryModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onDelete={handleDeleteImage}
              onSetIcon={handleSetIcon}
              getShareUrl={createShareUrl}
              items={convertToImageGalleryItems(agave.images)}
              startIndex={selectedImageIndex}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
