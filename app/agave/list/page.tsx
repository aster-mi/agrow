'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Card, Row, Col, Input, Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface DataType {
  slug: string;
  name: string;
  description: string;
  owner: {
    name: string;
  }
}

export default function Page(){
  const [content, setContent] = useState('');
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleGetAgaves = async () => {
    const response = await fetch('/api/agave/list');
    const agaves = await response.json();
    setDataSource(agaves);
  };

  const handleGetAgaveClick = async (slug: string) => {
      const response = await fetch(`/api/agave/${slug}`);
      const agave = await response.json();
      alert(JSON.stringify(agave));
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '名前',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: '詳細',
      dataIndex: 'description',
      width: '40%',
    },
    {
      title: '所有者',
      dataIndex: 'owner',
      width: '10%',
      render: (owner) => owner.name,
    },
    {
      width: '5%',
      render: (record: DataType) => (
        <Button danger onClick={() => handleGetAgaveClick(record.slug)}>
          Get
        </Button>
      ),
    },
  ];

    return (
    <div>
      <Card title='Agaves'>
        <Row>
          <Col span={16}>
            <Button onClick={handleGetAgaves}>一覧取得</Button>
          </Col>
        </Row>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={(record) => record.slug}
          pagination={{
            pageSize: 5,
          }}
        />
      </Card>
    </div>
  ); 
}