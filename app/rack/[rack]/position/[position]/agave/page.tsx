"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, Input, Button, Row, Table } from "antd";
import { useSession } from "next-auth/react";
import { addAgave, updatePosition } from "./api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Agave } from "@prisma/client";
import { AgaveType } from "@/app/type/AgaveType";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import Image from "next/image";
import NoImage from "@/app/components/NoImage";
import TextArea from "antd/es/input/TextArea";

export default function Page() {
  const { rack, position } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [agaveName, setAgaveName] = useState<string>("");
  const [agaveDescription, setAgaveDescription] = useState<string>("");
  const [agaves, setAgaves] = useState<AgaveType[]>([]);
  const [dataSource, setDataSource] = useState<AgaveType[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    try {
      fetch("/api/agave/list")
        .then((response) => response.json())
        .then((data) => {
          setAgaves(data.ownedAgaves);
          setDataSource(data.ownedAgaves);
        });
    } catch (error) {
      console.error("Error fetching agave:", error);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // アップロードした画像の URL をサーバーに送信する
    const agave = await addAgave({
      name: agaveName,
      description: agaveDescription,
      ownerId: session?.user?.id,
      rackCode: rack.toString(),
      rackPosition: parseInt(position.toString()),
    });

    toast.success("登録完了！");
    router.push("/agave/" + agave.slug); // 例: ホームページにリダイレクト
  };

  const handleSetAgaveClick = async (slug: string) => {
    try {
      await updatePosition(
        slug,
        rack.toString(),
        parseInt(position.toString())
      );
      toast.success("設置が完了しました");
      router.back();
    } catch (error) {
      console.error("Error fetching agave:", error);
    }
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const currValue = e.target.value;
    setValue(currValue);
    if (currValue) {
      const filteredData = agaves.filter(
        (entry) =>
          entry.name?.includes(currValue) ||
          entry.description?.includes(currValue)
      );
      setDataSource(filteredData);
    } else {
      setDataSource(agaves);
    }
  };

  const columns: ColumnsType<AgaveType> = [
    {
      title: "サムネ",
      width: "30%",
      render: (agave: Agave) => (
        <div className="">
          {agave.iconUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${agave.iconUrl}`}
              alt={`Image icon`}
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          ) : (
            <NoImage />
          )}
        </div>
      ),
    },
    {
      title: "名前",
      width: "30%",
      filterSearch: true,
      render: (agave: Agave) => (
        <Link href={`/agave/${agave.slug}`}>{agave.name}</Link>
      ),
    },
    {
      title: "詳細",
      dataIndex: "description",
      width: "30%",
      filterSearch: true,
    },
    {
      width: "10%",
      render: (agave: Agave) => (
        <Button onClick={() => handleSetAgaveClick(agave.slug)}>設置</Button>
      ),
    },
  ];

  return (
    <div>
      <Card title="新しいアガベを設置" className="text-center">
        <form className="mb-4 space-y-3" onSubmit={handleSubmit}>
          <Input
            value={agaveName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAgaveName(e.target.value)
            }
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="名称..."
          />
          <TextArea
            value={agaveDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setAgaveDescription(e.target.value)
            }
            className="w-full px-4 py-2 rounded focus:outline-none focus:border-blue-400"
            placeholder="詳細・メモ..."
            rows={3}
          />
          <button className="w-full px-4 py-2 text-white bg-blue-500 rounded transform transition-transform duration-200 hover:bg-blue-400 hover:scale-95">
            登録
          </button>
        </form>
      </Card>
      <Card title="既存のアガベを設置" className="text-center">
        <Row>
          <Input
            placeholder="検索..."
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e)}
            className="rounded m-2 focus:outline-none"
          />
        </Row>
        <Table
          showHeader={false}
          dataSource={dataSource}
          columns={columns}
          rowKey={(agave) => agave!.slug!}
          pagination={{
            pageSize: 10,
          }}
        />
      </Card>
    </div>
  );
}
