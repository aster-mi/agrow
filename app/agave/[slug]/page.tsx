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
import Image from "next/image";
import compressImage from "@/app/utils/compressImage";
import AddImageSvg from "@/app/components/svg/AddImageSvg";
import Link from "next/link";
import DeleteButton from "@/app/components/DeleteButton";
import MenuButton from "@/app/components/MenuButton";
import ShareButtons from "@/app/components/ShareButtons";
import TagSvg from "@/app/components/svg/TagSvg";
import GalleryModal from "@/app/components/GalleryModal";
import { ImageType } from "@/app/type/ImageType";
import convertDateToSlashFormat from "@/app/utils/convertDateToSlashFormat";
import buildImageUrl from "@/app/utils/buildImageUrl";
import NoImage from "@/app/components/NoImage";
import Loading from "@/app/loading";
import dotWatering from "@/public/dotWatering.png";
import { useSession } from "next-auth/react";
import Pups from "@/app/components/Pups";
import { Modal, Image as AntdImage, Input } from "antd";
import EditAgave from "@/app/components/EditAgave";
import UserView from "@/app/components/UserView";
import AngleDown from "@/app/components/svg/AngleDown";
import useAgave, { mutateAgave } from "@/app/hooks/useAgave";
import MoreSvg from "@/app/components/svg/MoreSvg";

const Page = () => {
  const { slug } = useParams();
  const session = useSession();
  const [isMine, setIsMine] = useState<boolean>(false);
  const { agave, agaveError, agaveLoading } = useAgave(slug as string);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [shotDate, setShotDate] = useState<Date>(new Date());
  const [fileInputKey, setFileInputKey] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const [openMoreModal, setOpenMoreModal] = useState<boolean>(false);

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
    setIsMine(agave?.owner?.id === session.data?.user?.id);
  }, [agave?.owner?.id, session.data?.user?.id]);

  const handleChangeFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setLoading(true);
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
    setLoading(false);
  };

  const handlePreviewModalClose = () => {
    setPreviewImages([]);
    setShotDate(new Date());
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
      setLoading(true);

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
        shotDate: shotDate,
      }));

      await addImages({
        id: agave.id as number,
        slug: slug as unknown as string,
        images: uploadImages,
      });

      setPreviewImages([]);
      setFileInputKey((prevKey) => prevKey + 1);
      mutateAgave(slug as string);
      toast.success("画像の投稿が完了しました");
    } catch (error) {
      toast.error("画像の投稿に失敗しました");
    } finally {
      setLoading(false);
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
    mutateAgave(slug as string);
    toast.success("画像を削除しました");
  };

  const handleSetIcon = async (index: number) => {
    const imageUrl = getImage(index).url;
    const fileName = imageUrl!.substring(imageUrl!.lastIndexOf("/agave") + 1);
    await setAgaveIcon(slug as string, fileName);
    mutateAgave(slug as string);
    toast.success("画像をアイコンに設定しました");
  };

  function convertToImageGalleryItems(images: ImageType[]) {
    return images.map((image) => ({
      original: buildImageUrl(image.url),
      thumbnail: buildImageUrl(image.url),
      description: convertDateToSlashFormat(image.shotDate as string),
    }));
  }

  if (loading || agaveLoading) return <Loading />;
  if (agaveError) return <div>failed to load</div>;

  return (
    <div>
      {loading || (agaveLoading && <Loading />)}
      {agave && (
        <div>
          <div
            className="absolute w-full flex justify-center z-0"
            style={{ opacity: "0.3" }}
          >
            {agave.iconUrl ? (
              <Image
                src={buildImageUrl(agave.iconUrl)}
                alt={`Image icon`}
                className="w-full h-full object-cover"
                width={500}
                height={500}
              />
            ) : (
              <NoImage />
            )}
          </div>
          <div className="absolute w-full">
            <div className="grid grid-cols-9 gap-0">
              <div className="col-span-1">
                <div className="text-2xl pl-2 pt-1 text-neutral-500 font-bold">
                  ☆
                </div>
              </div>
              {/* 名前 */}
              <div className="text-center col-span-7 bg-neutral-900 border-b-2 border-neutral-500 shadow shadow-white rounded-b-full">
                <p className="break-all mt-1">{agave.name}</p>
              </div>

              <div
                className="fill-white w-10 h-10 p-2"
                onClick={() => setOpenMoreModal(true)}
              >
                <MoreSvg />
              </div>
              <Modal
                open={openMoreModal}
                onCancel={() => setOpenMoreModal(false)}
                footer={null}
              >
                <div>
                  <div className="text-lg font-bold text-gray-800 border-b">
                    共有
                  </div>
                  <div className="flex flex-row justify-between mt-5">
                    <ShareButtons getUrl={() => currentURL} />
                  </div>
                  <div className="text-lg font-bold text-gray-800 border-b mt-12">
                    その他
                  </div>
                  <div className="flex flex-row justify-between mt-5">
                    {isMine && (
                      <>
                        {/* 編集 */}
                        <div
                          className="text-blue-500 p-2 w-full text-center"
                          onClick={() => {
                            setEditing(true);
                          }}
                        ></div>
                        {/* 水やり */}
                        {/* <div className="p-2 border-b border-gray-300 w-full flex flex-row justify-center">
                          <div className="h-6 w-6">
                            <Image
                              src={dotWatering}
                              alt="watering"
                              width={100}
                              height={100}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-blue-500">水やり管理</div>
                        </div> */}
                        <DeleteButton onDelete={handleDeleteAgave} />
                      </>
                    )}
                  </div>
                </div>
              </Modal>
            </div>

            <div className="flex mt-2">
              <div className="w-5/6">
                {/* owner */}
                <div className="flex flex-row">
                  <div className="w-5/6">
                    <div className="bg-neutral-900 rounded-full inline-block pr-1">
                      <UserView user={agave.owner} />
                    </div>
                  </div>
                  {/* TODO */}
                  <div className="w-1/6 text-xs flex flex-col justify-end">
                    <div>
                      <span className="text-yellow-200">★</span> 230
                    </div>
                    <div>💬 20</div>
                  </div>
                </div>
                {/* description */}
                <div className=" bg-black bg-opacity-50 p-2 ml-1 mr-2 rounded-md overflow-hidden">
                  <div
                    className={
                      openDescription ? "flex flex-row" : "flex flex-row h-24"
                    }
                  >
                    {agave.description && (
                      <>
                        <div
                          className="flex m-1 break-words w-5/6 text-white text-sm"
                          style={{ whiteSpace: "pre-wrap" }}
                        >{`${agave.description}`}</div>
                        <div className="w-1/6 flex my-7">
                          <div className="mx-auto">
                            <div
                              className={openDescription ? "rotate-180" : ""}
                              onClick={() =>
                                setOpenDescription(!openDescription)
                              }
                            >
                              <div className="bg-gray-700 bg-opacity-50 rounded-full">
                                <AngleDown />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-1/6">
                <div>
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
                    <Pups slug={slug as string} isMine={isMine}>
                      <div className="text-gray-700 h-10 rounded-l-full bg-white flex flex-row justify-end items-center mt-1">
                        <div className="text-xs mr-1 font-bold">子</div>
                        <div className="w-7 text-center italic font-serif font-extralight text-3xl text-green-900">
                          {agave.pups?.length}
                        </div>
                        <div className="text-xs h-full flex flex-col justify-end text-green-900 font-bold pb-1">
                          株
                        </div>
                      </div>
                    </Pups>
                    <div className="pl-2 pt-2 flex flex-col text-center">
                      <div className="text-4xl">💬</div>
                      <div className="text-xs scale-75">コメント</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {agave.tags && (
                <div className="flex flex-row overflow-x-scroll w-full py-3">
                  {agave.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex flex-row pr-2 mx-1 rounded-full border-2 border-gray-200 text-gray-200 bg-black bg-opacity-50 whitespace-nowrap"
                    >
                      <TagSvg />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-neutral-900 h-screen rounded-t-lg">
              <div>
                {" "}
                {isMine && (
                  <div>
                    <div className="grid grid-cols-1 gap-0">
                      <label
                        htmlFor="dropzone-file"
                        className="border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <p className="m-2 text-sm text-gray-500">
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

                    {previewImages.length > 0 && (
                      <Modal
                        open={true}
                        onOk={handleUpload}
                        okText="投稿"
                        okType="primary"
                        onCancel={handlePreviewModalClose}
                        cancelText="キャンセル"
                      >
                        <div className="flex flex-row mb-4 border-b-2 border-gray-500 w-52">
                          <p className="flex flex-col justify-center w-16 text-gray-500 font-bold border-b">
                            📷撮影日:
                          </p>
                          <Input
                            className="w-36 bg-white rounded-lg border-none font-bold text-blue-500 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            type="date"
                            defaultValue={new Date().toISOString().slice(0, 10)}
                            max={new Date().toISOString().slice(0, 10)}
                            onChange={(e) =>
                              setShotDate(new Date(e.target.value))
                            }
                          />
                        </div>
                        <div className="flex overflow-x-auto whitespace-nowrap">
                          {!loading &&
                            previewImages.map((previewURL, index) => (
                              <div
                                key={index}
                                className="mr-4 max-w-xs overflow-hidden rounded shadow-lg"
                                style={{ flex: "0 0 auto", height: "200px" }}
                              >
                                <AntdImage
                                  src={previewURL}
                                  alt={`Preview ${index}`}
                                  height={200}
                                />
                              </div>
                            ))}
                        </div>
                      </Modal>
                    )}
                  </div>
                )}
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
                    isMine={isMine}
                  />
                )}
                {editing && (
                  <EditAgave
                    target={agave}
                    onLoading={setLoading}
                    onUpdated={() => {
                      setEditing(false);
                      mutateAgave(slug as string);
                      if (agave.parent) {
                        mutateAgave(agave.parent.slug as string);
                      }
                    }}
                    onCanceled={() => setEditing(false)}
                  />
                )}
                <div className="h-16 w-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
