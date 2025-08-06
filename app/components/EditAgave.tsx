"use client";

import { Modal } from "antd";
import { AgaveType } from "../type/AgaveType";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TagSvg from "./svg/TagSvg";

type Props = {
  target: AgaveType;
  onLoading: (loading: boolean) => void;
  onUpdated: () => void;
  onCanceled: () => void;
};

const Pups = ({ target, onLoading, onUpdated, onCanceled }: Props) => {
  const [open, setOpen] = useState(true);
  const [inputTagName, setInputTagName] = useState<string>("");
  const [tags, setTags] = useState<string[]>(target.tags || []);
  const [agave, setAgave] = useState<AgaveType>({
    name: target.name,
    description: target.description,
    tags: tags,
  });

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleSave = async () => {
    onLoading(true);
    const res = await fetch(`/api/agave/${target.slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agave: {
          name: agave.name,
          description: agave.description,
          tags: tags,
        },
      }),
    });
    if (res.ok) {
      onUpdated();
      toast.success("更新しました");
      setOpen(false);
    } else {
      toast.error("更新に失敗しました");
    }
    onLoading(false);
  };

  const addTag = () => {
    if (inputTagName.length < 1) {
      toast.error("タグ名は1文字以上で入力してください");
      return;
    }
    if (inputTagName.length > 10) {
      toast.error("タグ名は10文字以内で入力してください");
      return;
    }
    if (tags.includes(inputTagName)) {
      toast.warn("指定のタグは設定済みです");
      return;
    }
    setTags([...tags, inputTagName]);
    setInputTagName("");
  };

  return (
    <Modal
      onOk={handleSave}
      okText="保存"
      open={open}
      onCancel={() => {
        setOpen(false);
        onCanceled();
      }}
      cancelText="キャンセル"
    >
      {/* name */}
      <div className="mb-3">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          名前
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={agave.name}
          onChange={(e) => setAgave({ ...agave, name: e.target.value })}
        />
      </div>
      {/* description */}
      <div className="mb-3">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          詳細
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={agave.description}
          onChange={(e) => setAgave({ ...agave, description: e.target.value })}
        />
      </div>
      {/* tags */}
      <div className="mb-3">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          タグ
        </label>
        <div className="flex flex-wrap">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex flex-row bg-white m-1 pr-2 border rounded-full text-gray-800 text-center cursor-pointer hover:bg-gray-100 hover:"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
            >
              <TagSvg />
              {tag}
            </div>
          ))}
        </div>
        <div className="flex flex-row mb-10">
          <input
            className="shadow appearance-none border rounded w-full p-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-3"
            placeholder="タグを追加"
            value={inputTagName}
            max={10}
            onChange={(e) => setInputTagName(e.target.value)}
          />
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-3"
            onClick={addTag}
          >
            +
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Pups;
