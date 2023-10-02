"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import ShareSvg from "./svg/ShareSvg";

interface ShareButtonProps {
  getUrl: () => string;
}
const ShareButtons: React.FC<ShareButtonProps> = ({ getUrl }) => {
  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(getUrl());
    toast.success("URLコピー完了");
  };

  const shareOnTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      getUrl()
    )}`;
    window.open(tweetUrl, "_blank");
  };

  const shareOnLINE = () => {
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(
      getUrl()
    )}`;
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
