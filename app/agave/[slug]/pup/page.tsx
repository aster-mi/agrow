"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, Input, Row, Col, Button, Table } from "antd";
import { useSession } from "next-auth/react";
import { addAgave, getAgave } from "../../api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

interface Agave {
  name: string;
  description: string;
  slug: string;
}

export default function Page() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [agaveName, setAgaveName] = useState<string>("");
  const [agaveDescription, setAgaveDescription] = useState<string>("");
  const [dataSource, setDataSource] = useState<Agave[]>([]);

  useEffect(() => {
    try {
      fetch(`/api/agave/${slug}/pup`)
        .then((response) => response.json())
        .then((data) => setDataSource(data));
    } catch (error) {
      console.error("Error fetching agave:", error);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const parent = await getAgave(slug as string);

    // アップロードした画像の URL をサーバーに送信する
    const agave = await addAgave({
      name: agaveName,
      description: agaveDescription,
      ownerId: session?.user?.id,
      parentId: parent.id,
    });

    toast.success("登録完了！");
    setAgaveDescription("");
    setAgaveName("");
    fetch(`/api/agave/${slug}/pup`)
      .then((response) => response.json())
      .then((data) => setDataSource(data));
  };

  const handleGetAgaveClick = async (slug: string) => {
    const response = await fetch(`/api/agave/${slug}`);
    const agave = await response.json();
    alert(JSON.stringify(agave));
  };

  const columns: ColumnsType<Agave> = [
    {
      title: "名前",
      width: "30%",
      render: (agave: Agave) => (
        <Link href={`/agave/${agave.slug}`}>{agave.name}</Link>
      ),
    },
    {
      title: "詳細",
      dataIndex: "description",
      width: "30%",
    },
    {
      width: "5%",
      render: (agave: Agave) => (
        <Button danger onClick={() => handleGetAgaveClick(agave.slug)}>
          Get
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="子株一覧">
        <Row></Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={(agave) => agave.slug}
          pagination={{
            pageSize: 5,
          }}
        />
      </Card>
      <Card title="子株登録">
        <form className="mb-4 space-y-3" onSubmit={handleSubmit}>
          <input
            value={agaveName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAgaveName(e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="name..."
          />
          <input
            value={agaveDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAgaveDescription(e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="description..."
          />
          <button className="w-full px-4 py-2 text-white bg-blue-500 rounded transform transition-transform duration-200 hover:bg-blue-400 hover:scale-95">
            登録
          </button>
        </form>
      </Card>
    </div>
  );
}
