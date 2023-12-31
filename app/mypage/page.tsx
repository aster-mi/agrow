"use client";

import { useState } from "react";
import supabase from "@/app/utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { Input } from "antd";
import "cropperjs/dist/cropper.css";
import { toast } from "react-toastify";
import Loading from "../loading";
import compressImage from "../utils/compressImage";
import { signOut } from "next-auth/react";
import useProfile, { mutateProfile } from "../hooks/useProfile";

export default function Page() {
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState<Blob | null>(null);
  const [newName, setNewName] = useState("");
  const [newPublicId, setNewPublicId] = useState("");
  const [loading, setLoading] = useState(false);
  const { profile, profileError, profileLoading } = useProfile();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const blob = await compressImage(e.target.files[0]);
      setNewImage(blob);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handlePublicIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPublicId(e.target.value);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNewName(profile?.name!);
    setNewPublicId(profile!.publicId!);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewImage(null);
    setNewName("");
    setNewPublicId("");
  };

  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      // validate publicId
      if (newPublicId && newPublicId !== profile.publicId) {
        // 文字数
        if (newPublicId.length < 5 || newPublicId.length > 20) {
          toast.error("ユーザーIDは5~20文字の間で設定してください");
          return;
        }
        // 形式 (半角英数字とアンダースコアのみ)
        if (!newPublicId.match(/^[a-zA-Z0-9_]+$/)) {
          toast.error(
            "ユーザーIDは半角英数字とアンダースコア(_)のみ使用できます"
          );
          return;
        }
        // 全て小文字に変換
        setNewPublicId(newPublicId.toLowerCase());
        try {
          await fetch(`/api/user/${newPublicId}`)
            .then((res) => res.json())
            .then((data) => {
              if (data !== null) {
                throw new Error("このユーザーIDは既に使用されています");
              }
            });
        } catch (e) {
          toast.error((e as Error).message);
          return;
        }
      }
      // validate name
      if (newName && newName !== profile.name) {
        if (newName.length < 1 || newName.length > 20) {
          toast.error("名前は1~20文字の間で設定してください");
          return;
        }
      }
      // upload image
      if (newImage) {
        const fileName = `${uuidv4()}.webp`;
        const filePath = `avatars/${fileName}`;
        const { data, error } = await supabase.storage
          .from("photos")
          .upload(filePath, newImage, {
            cacheControl: "2592000",
            upsert: false,
          });
        if (error) {
          toast.error("アイコンの更新に失敗しました");
          return;
        }
        try {
          await fetch("/api/mypage", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: filePath,
            }),
          });
        } catch (e) {
          toast.error("アイコンの更新に失敗しました");
          return;
        }
      }
      // update name and publicId
      if (newName || newPublicId) {
        try {
          await fetch("/api/mypage", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newName,
              publicId: newPublicId,
            }),
          });
        } catch (e) {
          toast.error("名前またはユーザーIDの更新に失敗しました");
          return;
        }
      }

      mutateProfile();
      toast.success("変更を保存しました");
      setIsEditing(false);
      setNewImage(null);
      setNewName("");
      setNewPublicId("");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading || loading) return <Loading />;
  if (profileError) return <div>failed to load</div>;
  if (!profile) return <div>no profile</div>;

  return (
    <div className="m-3 space-y-4">
      <div>
        {isEditing ? (
          <div className="flex flex-row w-full">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <label
                htmlFor="dropzone-file"
                style={{ position: "relative", display: "inline-block" }}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden flex justify-center">
                  <div className="absolute z-20 w-full h-full flex flex-col justify-center bg-black bg-opacity-50">
                    <div className="flex flex-row justify-center text-lg">
                      📷
                    </div>
                  </div>
                  {newImage ? (
                    <img
                      src={URL.createObjectURL(newImage)}
                      alt="User avatar"
                      className="absolute z-10 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={profile.image}
                      alt="User avatar"
                      className="absolute z-10 w-full h-full object-cover"
                    />
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept=".jpeg, .jpg, .png, .webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div className="ml-2 mt-3">
              <div className="flex text-gray-400 text-xm">
                @
                <Input
                  type="text"
                  value={newPublicId}
                  onChange={handlePublicIdChange}
                  maxLength={20}
                  rootClassName="bg-transparent border-none text-gray-400 text-xm p-0 focus:ring-0 underline"
                />
              </div>
              <Input
                type="text"
                value={newName}
                className="flex"
                onChange={handleNameChange}
                maxLength={20}
                rootClassName="bg-transparent border-none text-white text-lg p-0 focus:ring-0 underline"
              />
            </div>
            <div className="flex flex-col justify-center">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-1 py-2 rounded text-sm"
              >
                保存
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white px-1 py-2 rounded text-sm"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div>
              <div className="flex flex-row w-full">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={profile.image}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                    onClick={handleEdit}
                  />
                </div>
                <div className="ml-2 mt-3">
                  <div className="text-gray-400 text-sm" onClick={handleEdit}>
                    @{profile.publicId}
                  </div>
                  <div className="text-lg" onClick={handleEdit}>
                    {profile.name}
                  </div>
                </div>
                <span
                  onClick={handleEdit}
                  className="absolute right-0 m-3 underline cursor-pointer"
                >
                  編集
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <button className="text-red" onClick={() => signOut()}>
        ログアウト
      </button>
    </div>
  );
}
