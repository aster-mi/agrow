"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import MenuButton from "./MenuButton";
import DownloadSvg from "./svg/DownloadSvg";
import ShareButtons from "./ShareButtons";
import DeleteButton from "./DeleteButton";
import { toast } from "react-toastify";
import { Button } from "antd";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onSetIcon?: () => void;
  imageUrl: string;
  shareUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  onSetIcon,
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

  const handleDeleteImage = async () => {
    onDelete!();
    onClose();
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
          onClick={onClose}
          className="fixed inset-0 flex items-center justify-center"
        >
          <div className="inline-block w-full h-full my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl relative">
            <Image
              src={imageUrl}
              alt="Selected Image"
              className="w-full h-full object-contain"
              width={2048}
              height={2048}
            />
          </div>
          {shareUrl && (
            <div onClick={handleChildClick}>
              <div className="absolute top-0 left-0 right-0 flex justify-between bg-black bg-opacity-50">
                <div className="left-0 p-3">
                  <button onClick={downloadImage}>
                    <DownloadSvg />
                  </button>
                </div>
                <div className="right-0">
                  <MenuButton
                    contents={
                      <>
                        <ShareButtons url={shareUrl} />
                        {onDelete && (
                          <DeleteButton
                            onDelete={handleDeleteImage}
                            name={"画像"}
                          />
                        )}
                        {onSetIcon && (
                          <button onClick={onSetIcon}>Iconに設定</button>
                        )}
                      </>
                    }
                  />
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
