"use client";

import "cropperjs/dist/cropper.css";
import { useState } from "react";
import { toast } from "react-toastify";

// shortLinkの発行を行う画面
// adminユーザーののみアクセスできる
export default function Page() {
  const [slList, setSlList] = useState<string[]>([]);

  const handleCopyNewLink = async () => {
    fetch("/api/admin/sl", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        const sl = "agrow.jp/sl/" + data;
        navigator.clipboard.writeText(sl);
        toast.success("コピー完了: " + sl);
        setSlList([sl, ...slList]);
      });
  };
  return (
    <div>
      <div
        className="bg-white p-3 m-3 rounded text-gray-800 text-center cursor-pointer hover:bg-gray-100 hover:"
        onClick={handleCopyNewLink}
      >
        ID発行 & Copy
      </div>
      <div className="text-gray-200">発行済みID: {slList.length}</div>
      <div className="flex flex-wrap">
        {slList.map((sl) => (
          <div
            className="bg-white p-3 m-3 rounded text-gray-800 text-center cursor-pointer hover:bg-gray-100 hover:"
            onClick={() => {
              navigator.clipboard.writeText(sl);
              toast.success("コピー完了: " + sl);
            }}
          >
            {sl}
          </div>
        ))}
      </div>
    </div>
  );
}
