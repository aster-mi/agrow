"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type News = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function Page() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/news")
      .then((res) => res.json())
      .then((data) => setNewsList(data));
  }, []);

  const handleAddNews = async () => {
    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    setNewsList([data, ...newsList]);
    setTitle("");
    setContent("");
    toast.success("ニュースを追加しました");
  };

  const handleUpdateNews = async () => {
    const res = await fetch(`/api/admin/news/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    setNewsList(newsList.map((news) => (news.id === editingId ? data : news)));
    setTitle("");
    setContent("");
    setIsEditing(false);
    setEditingId(null);
    toast.success("ニュースを更新しました");
  };

  const handleDeleteNews = async (id: number) => {
    const res = await fetch(`/api/admin/news/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setNewsList(newsList.filter((news) => news.id !== id));
      toast.success("ニュースを削除しました");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">ニュース管理</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isEditing) {
            handleUpdateNews();
          } else {
            handleAddNews();
          }
        }}
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-white font-bold mb-2">
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            className="w-full text-black border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-white font-bold mb-2">
            内容
          </label>
          <textarea
            id="content"
            value={content}
            className="w-full text-black border rounded py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex flex-row justify-end">
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setTitle("");
                setContent("");
              }}
              className="mr-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              キャンセル
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isEditing ? "更新" : "追加"}
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {newsList.map((news) => (
          <div key={news.id} className="bg-white rounded-lg shadow-md">
            <div className="p-4">
              <h2 className="text-lg text-black font-bold mb-2">
                {news.title}
              </h2>
              <p className="text-gray-700 text-base">{news.content}</p>
              <p className="text-gray-500 text-sm mt-2">{news.createdAt}</p>
            </div>
            <div className="bg-gray-100 px-4 py-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setTitle(news.title);
                  setContent(news.content);
                  setIsEditing(true);
                  setEditingId(news.id);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
              >
                編集
              </button>
              <button
                type="button"
                onClick={() => handleDeleteNews(news.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
