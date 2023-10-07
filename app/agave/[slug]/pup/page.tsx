"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, Input, Row, Col, Button, Table } from "antd";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import Image from "next/image";
import { AgaveType } from "@/app/type/AgaveType";
import NoImage from "@/app/components/NoImage";
import { addAgave, getAgave } from "../../api";
import { toast } from "react-toastify";

interface Agave {
  name: string;
  description: string;
  slug: string;
}

export default function Page() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const [dataSource, setDataSource] = useState<AgaveType[]>([]);

  useEffect(() => {
    try {
      fetch(`/api/agave/${slug}/pup`)
        .then((response) => response.json())
        .then((data) => setDataSource(data));
    } catch (error) {
      console.error("Error fetching agave:", error);
    }
  }, []);

  const handleAddPup = async (e: FormEvent) => {
    e.preventDefault();

    const parent = await getAgave(slug as string);
    const pupName = parent.name! + " pup:#" + (parent.pups!.length + 1);

    // アップロードした画像の URL をサーバーに送信する
    const agave = await addAgave({
      name: pupName,
      ownerId: session?.user?.id,
      parentId: parent.id,
    });
    const newDataSource = [agave, ...dataSource];
    setDataSource(newDataSource);
    toast.success("登録完了！");
  };

  const columns: ColumnsType<AgaveType> = [
    {
      title: "サムネ",
      width: "30%",
      render: (agave: AgaveType) => (
        <div className="">
          <Link href={`/agave/${agave.slug}`}>
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
          </Link>
        </div>
      ),
    },
    {
      title: "名前/詳細",
      width: "30%",
      filterSearch: true,
      render: (agave: Agave) => (
        <Link href={`/agave/${agave.slug}`}>
          <div>{agave.name}</div>
          <div>{agave.description}</div>
        </Link>
      ),
    },
    {
      title: "詳細",
      dataIndex: "description",
      width: "30%",
      filterSearch: true,
    },
  ];

  return (
    <div>
      <Card title="子株一覧">
        <Row>
          <Button
            className="ml-auto m-1 border-none bg-green-700 text-white"
            onClick={handleAddPup}
          >
            子株を追加
          </Button>
        </Row>
        <Table
          dataSource={dataSource}
          showHeader={false}
          columns={columns}
          rowKey={(agave) => agave.slug!}
        />
      </Card>
    </div>
  );
}
