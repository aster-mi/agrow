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
          <div className="absolute top-0 left-0 right-0 flex justify-between bg-black bg-opacity-50">
            <div className="left-0 p-3">
              <button onClick={handleClose}>←</button>
            </div>
            <div className="left-0 p-3">
              <button onClick={downloadImage}>
                <DownloadSvg />
              </button>
            </div>
            <div className="left-0 p-3">
              <button onClick={startSlideShow}>▶️</button>
            </div>
            {isMine && (
              <>
                <div className="left-0 p-3">
                  {onSetIcon && <button onClick={handleSetIcon}>Icon化</button>}
                </div>
                <div className="left-0 p-3">
                  {onDelete && (
                    <DeleteButton onDelete={handleDeleteImage} title={"🗑"} />
                  )}
                </div>
              </>
            )}
            <div className="right-0">
              <MenuButton
                contents={
                  <>
                    <ShareButtons getUrl={handleGetShareButtonUrl} />
                  </>
                }
              />
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default GalleryModal;
