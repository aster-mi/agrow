import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import ShareMenuButton from "./ShareMenuButton";
import DownloadSvg from "./svg/DownloadSvg";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  shareUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  shareUrl,
}) => {
  const downloadImage = () => {
    // 画像のURLからファイル名を取得
    const fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

    // 画像を取得
    fetch(imageUrl)
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
        className="fixed inset-0 z-50 backdrop-blur-3xl bg-gray-900 bg-opacity-50"
        onClose={onClose}
        open={isOpen}
      >
        <div
          onClick={onClose}
          className="fixed inset-0 flex items-center justify-center"
        >
          <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl relative">
            <Image
              src={imageUrl}
              alt="Selected Image"
              className="w-full max-h-96"
              width={1000}
              height={1000}
            />
          </div>
          {shareUrl && (
            <div onClick={handleChildClick}>
              <div className="absolute top-0 left-0 right-0 bg-gray-900 bg-opacity-50 flex justify-between">
                <div className="left-0 p-3">
                  <button onClick={downloadImage}>
                    <DownloadSvg />
                  </button>
                </div>
                <div className="right-0 p-3">
                  <ShareMenuButton url={shareUrl} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ImageModal;
