"use client";

import { Dialog, Transition } from "@headlessui/react";
import MenuButton from "./MenuButton";
import DownloadSvg from "./svg/DownloadSvg";
import ShareButtons from "./ShareButtons";
import DeleteButton from "./DeleteButton";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "antd";
import XSvg from "./svg/XSvg";
import LineSvg from "./svg/LineSvg";
import CopySvg from "./svg/CopySvg";
import ImageSvg from "./svg/ImageSvg";
import MoreSvg from "./svg/MoreSvg";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (index: number) => void;
  onSetIcon?: (index: number) => void;
  getShareUrl: (index: number) => string;
  items: Item[];
  startIndex: number;
  isMine: boolean;
}

interface Item {
  original: string;
  thumbnail: string;
}

const handleChildClick = (event: { stopPropagation: () => void }) => {
  event.stopPropagation();
};

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  onSetIcon,
  getShareUrl,
  items,
  startIndex,
  isMine,
}) => {
  const galleryRef = useRef<Gallery>(null);
  const [playSlideShow, setPlaySlideShow] = useState(false);
  const [imageOnly, setImageOnly] = useState(false);
  const [openMoreModal, setOpenMoreModal] = useState(false);
  const router = useRouter();
  const focusRef = useRef(null);

  const getCurrentIndex = () => {
    return galleryRef!.current!.getCurrentIndex();
  };

  const getCurrentItem = () => {
    return items[getCurrentIndex()].original;
  };

  const handleGetShareButtonUrl = () => {
    handleClose();
    return getShareUrl(getCurrentIndex());
  };

  const handleSetIcon = () => {
    onSetIcon!(getCurrentIndex());
    handleClose();
  };

  const startSlideShow = () => {
    if (!playSlideShow) {
      galleryRef!.current!.play();
      setPlaySlideShow(true);
      setImageOnly(true);
    }
  };

  const stopSlideShow = () => {
    if (playSlideShow) {
      galleryRef!.current!.pause();
      setPlaySlideShow(false);
    }
  };

  const handleDeleteImage = async () => {
    onDelete!(getCurrentIndex());
    handleClose();
  };

  const downloadImage = () => {
    const currentImageUrl = getCurrentItem();
    // 画像のURLからファイル名を取得
    const fileName = currentImageUrl.substring(
      currentImageUrl.lastIndexOf("/") + 1
    );

    // 画像を取得
    fetch(currentImageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Blobオブジェクトを使用してダウンロードリンクを生成
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; // ダウンロード時のファイル名を設定
        document.body.appendChild(a);
        a.click();

        // ダウンロード後に一時的なURLを解放
        window.URL.revokeObjectURL(url);
      });
  };

  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState(null, "", null);
    window.addEventListener("popstate", onClose);
    console.log("push");
  }, [isOpen]);

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-50 backdrop-blur-2xl"
      onClose={() => {}}
      open={isOpen}
      initialFocus={focusRef}
    >
      <div
        className="flex justify-center items-center h-screen"
        onClick={handleClose}
        ref={focusRef}
      >
        {items && (
          <div onClick={(e) => e.stopPropagation()} className="w-full">
            <Gallery
              items={items}
              showBullets={false}
              showThumbnails={!imageOnly}
              showNav={!imageOnly}
              showFullscreenButton={false}
              showPlayButton={false}
              thumbnailPosition={"bottom"}
              slideDuration={200}
              slideInterval={2000}
              startIndex={startIndex}
              ref={galleryRef}
              onClick={() => {
                stopSlideShow();
                setImageOnly(!imageOnly);
              }}
            />
          </div>
        )}
      </div>
      {!imageOnly && (
        <div onClick={handleChildClick}>
          <div className="absolute top-0 w-full flex flex-row justify-between bg-black bg-opacity-50 h-10">
            <div className="p-2 w-10 h-10">
              <button onClick={handleClose}>←</button>
            </div>
            <div className="p-2 w-10 h-10">
              <button onClick={startSlideShow}>▶️</button>
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
              <div className="text-lg font-bold text-gray-800 border-b">
                共有
              </div>
              <div className="flex flex-row justify-between mt-5">
                <ShareButtons getUrl={handleGetShareButtonUrl} />
              </div>
              <div className="text-lg font-bold text-gray-800 border-b mt-12">
                その他
              </div>
              <div className="flex flex-row justify-between mt-5">
                <div onClick={downloadImage}>
                  <div className="p-3 rounded-md shadow-md bg-gray-50 w-12 h-12">
                    <DownloadSvg />
                  </div>
                  <div className="text-xs text-gray-600 text-center mt-1">
                    保存
                  </div>
                </div>
                {isMine && (
                  <>
                    <div>
                      {onSetIcon && (
                        <div onClick={handleSetIcon}>
                          <div className="p-3 rounded-md shadow-md bg-gray-50 w-12 h-12">
                            <ImageSvg />
                          </div>
                          <div className="text-xs text-gray-600 text-center mt-1">
                            <p>アイコン</p>
                            <p>に設定</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      {onDelete && (
                        <DeleteButton onDelete={handleDeleteImage} />
                      )}
                    </div>
                  </>
                )}
              </div>
            </Modal>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default GalleryModal;
