"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import ShareSvg from "./svg/ShareSvg";

interface ShareMenuButtonProps {
  url: string;
}
const ShareMenuButton: React.FC<ShareMenuButtonProps> = ({ url }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(url);
    setIsMenuOpen(false);
    toast.success("URLコピー完了");
  };

  const shareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}`;
    window.open(tweetUrl, "_blank");
    setIsMenuOpen(false);
  };

  const shareOnLINE = () => {
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(url)}`;
    window.open(lineUrl, "_blank");
    setIsMenuOpen(false);
  };

  // メニューが開いている場合に表示する内容
  const menuContent = isMenuOpen && (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="absolute z-10 right-4 top-4">
        <div className="bg-white border rounded-lg shadow-lg">
          <div className="flex flex-col space-y-2 p-3">
            <button
              onClick={copyUrlToClipboard}
              className="text-blue-500 hover:text-blue-700 focus:outline-none border-b border-gray-300"
            >
              URLをコピーする
            </button>
            <button
              onClick={shareOnTwitter}
              className="text-blue-500 hover:text-blue-700 focus:outline-none border-b border-gray-300"
            >
              ツイッターに共有
            </button>
            <button
              onClick={shareOnLINE}
              className="text-blue-500 hover:text-blue-700 focus:outline-none border-b border-gray-300"
            >
              LINEに共有する
            </button>
            <button
              onClick={handleMenuClick}
              className="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={handleMenuClick}>
        <ShareSvg />
      </button>
      <div>{menuContent}</div>
    </>
  );
};

export default ShareMenuButton;
