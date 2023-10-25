"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import ShareSvg from "./svg/ShareSvg";
import XSvg from "./svg/XSvg";
import LineSvg from "./svg/LineSvg";
import CopySvg from "./svg/CopySvg";

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
      <div>
        <div
          onClick={shareOnTwitter}
          className="p-3 rounded-md shadow-md bg-gray-50 w-12 h-12"
        >
          <XSvg />
        </div>
        <div className="text-xs text-gray-600 text-center mt-1">x</div>
      </div>
      <div>
        <div
          onClick={shareOnLINE}
          className="p-3 rounded-md shadow-md bg-gray-50 w-12 h-12"
        >
          <LineSvg />
        </div>
        <div className="text-xs text-gray-600 text-center mt-1">line</div>
      </div>
      <div>
        <div
          onClick={copyUrlToClipboard}
          className="p-3 rounded-md shadow-md bg-gray-50 w-12 h-12"
        >
          <CopySvg />
        </div>
        <div className="text-xs text-gray-600 text-center mt-1">copy</div>
      </div>
    </>
  );
};

export default ShareButtons;
