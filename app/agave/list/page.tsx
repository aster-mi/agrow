"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Card, Row, Col, Input, Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";

interface DataType {
  ownedAgaves: Agave[];
  name: string;
}

interface Agave {
  name: string;
  description: string;
  slug: string;
}

export default function Page() {
  const [dataSource, setDataSource] = useState<Agave[]>([]);

  const handleGetAgaves = async () => {
    fetch("/api/agave/list")
      .then((response) => response.json())
      .then((data) => setDataSource(data.ownedAgaves));
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
      render: (agave: Agave) => <Link href={agave.slug}>{agave.name}</Link>,
    },
    {
      title: "詳細",
      dataIndex: "description",
      width: "30%",
    },
    // {
    //   title: "所有者",
    //   dataIndex: "owner",
    //   width: "10%",
    //   render: (owner) => owner.name,
    // },
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
      <Card title="Agaves">
        <Row>
          <Col span={16}>
            <Button onClick={handleGetAgaves}>一覧取得</Button>
          </Col>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={(agave) => agave.slug}
          pagination={{
            pageSize: 5,
          }}
        />
      </Card>
    </div>
  );
}
