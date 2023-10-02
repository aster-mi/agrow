"use client";

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import MenuButton from "./MenuButton";
import DownloadSvg from "./svg/DownloadSvg";
import ShareButtons from "./ShareButtons";
import DeleteButton from "./DeleteButton";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MutableRefObject, useRef, useState } from "react";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (index: number) => void;
  onSetIcon?: (index: number) => void;
  getShareUrl: (index: number) => string;
  items: Item[];
  startIndex: number;
}

interface Item {
  original: string;
  thumbnail: string;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  onSetIcon,
  getShareUrl,
  items,
  startIndex,
}) => {
  const galleryRef = useRef<Gallery>(null);
  const [playSlideShow, setPlaySlideShow] = useState(false);

  const getCurrentIndex = () => {
    return galleryRef!.current!.getCurrentIndex();
  };

  const getCurrentItem = () => {
    return items[getCurrentIndex()].original;
  };

  const handleGetShareButtonUrl = () => {
    onClose();
    return getShareUrl(getCurrentIndex());
  };

  const handleSetIcon = () => {
    onSetIcon!(getCurrentIndex());
    onClose();
  };

  const handleToggleSlideShow = () => {
    playSlideShow ? galleryRef!.current!.pause() : galleryRef!.current!.play();
    setPlaySlideShow(!playSlideShow);
  };

  const handleDeleteImage = async () => {
    onDelete!(getCurrentIndex());
    onClose();
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

  const handleChildClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  };

  return (
    <div>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 backdrop-blur-2xl"
        onClose={onClose}
        open={isOpen}
      >
        <div
          className="flex justify-center items-center h-screen"
          onClick={onClose}
        >
          {items && (
            <div onClick={handleChildClick} className="w-full">
              <Gallery
                items={items}
                showBullets={false}
                showIndex={true}
                showThumbnails={true}
                showFullscreenButton={false}
                showPlayButton={false}
                thumbnailPosition={"bottom"}
                slideDuration={200}
                slideInterval={2000}
                startIndex={startIndex}
                ref={galleryRef}
              />
            </div>
          )}
        </div>
        <div onClick={handleChildClick}>
          <div className="absolute top-0 left-0 right-0 flex justify-between bg-black bg-opacity-50">
            <div className="left-0 p-3">
              <button onClick={onClose}>←</button>
            </div>
            <div className="left-0 p-3">
              <button onClick={downloadImage}>
                <DownloadSvg />
              </button>
            </div>
            <div className="left-0 p-3">
              <button onClick={handleToggleSlideShow}>
                {playSlideShow ? "■ 停止" : "▶️ 再生"}
              </button>
            </div>
            <div className="left-0 p-3">
              {onSetIcon && <button onClick={handleSetIcon}>Icon化</button>}
            </div>
            <div className="left-0 p-3">
              {onDelete && (
                <DeleteButton onDelete={handleDeleteImage} title={"🗑"} />
              )}
            </div>
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
      </Dialog>
    </div>
  );
};

export default GalleryModal;
