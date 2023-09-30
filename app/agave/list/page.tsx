"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Card, Row, Col, Input, Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import Link from "next/link";

interface DataType {
  ownedAgaves: Agave[];
  name: string;
}

interface Agave {
  name: string;
  description: string;
  slug: string;
  iconUrl?: string;
}

export default function Page() {
  const [dataSource, setDataSource] = useState<Agave[]>([]);

  useEffect(() => {
    try {
      fetch("/api/agave/list")
        .then((response) => response.json())
        .then((data) => setDataSource(data.ownedAgaves));
    } catch (error) {
      console.error("Error fetching agave:", error);
    }
  }, []);

  const columns: ColumnsType<Agave> = [
    {
      title: "icon",
      width: "20%",
      render: (agave: Agave) => (
        <>
          {agave.iconUrl ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${agave.iconUrl}`}
              alt={`Image icon`}
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          ) : (
            <div>ICON未設定</div>
          )}
        </>
      ),
    },
    {
      title: "名前",
      width: "30%",
      render: (agave: Agave) => <Link href={agave.slug}>{agave.name}</Link>,
    },
  ];

  return (
    <div>
      <Card title="アガベ一覧">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={(agave) => agave.slug}
          pagination={{
            pageSize: 10,
          }}
        />
      </Card>
    </div>
  );
}
