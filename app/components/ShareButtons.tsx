"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import ShareSvg from "./svg/ShareSvg";

interface ShareButtonProps {
  url: string;
}
const ShareButtons: React.FC<ShareButtonProps> = ({ url }) => {
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success("URLコピー完了");
  };

  const shareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}`;
    window.open(tweetUrl, "_blank");
  };

  const shareOnLINE = () => {
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(url)}`;
    window.open(lineUrl, "_blank");
  };

  return (
    <>
      <button
        onClick={copyUrlToClipboard}
        className="text-blue-500 w-full border-b border-gray-300 p-2"
      >
        URLをコピーする
      </button>
      <button
        onClick={shareOnTwitter}
        className="text-blue-500 w-full border-b border-gray-300 p-2"
      >
        ツイッターに共有
      </button>
      <button
        onClick={shareOnLINE}
        className="text-blue-500 w-full border-b border-gray-300 p-2"
      >
        LINEに共有する
      </button>
    </>
  );
};

export default ShareButtons;
