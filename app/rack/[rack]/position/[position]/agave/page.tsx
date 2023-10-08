"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, Input, Button, Row, Table, Tabs } from "antd";
import { useSession } from "next-auth/react";
import { addAgave, updatePosition } from "./api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Agave } from "@prisma/client";
import { AgaveType } from "@/app/type/AgaveType";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import NoImage from "@/app/components/NoImage";
import TextArea from "antd/es/input/TextArea";

const { TabPane } = Tabs;

export default function Page() {
  const { rack, position } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [agaveName, setAgaveName] = useState<string>("");
  const [agaveDescription, setAgaveDescription] = useState<string>("");
  const [agaves, setAgaves] = useState<AgaveType[]>([]);
  const [dataSource, setDataSource] = useState<AgaveType[]>([]);
  const [value, setValue] = useState("");
  const [activeTab, setActiveTab] = useState("1");

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
      width: "60%",
      filterSearch: true,
      render: (agave: AgaveType) => (
        <div>
          <Row>
            {agave.name!.length > 20
              ? agave.name!.slice(0, 20) + "..."
              : agave.name}
          </Row>
          <Row className="text-xs text-gray-500">{agave.description}</Row>
          {agave.rack && (
            <Row className="text-xs text-green-500">
              ●{agave.rack.name}に配置済み
            </Row>
          )}
        </div>
      ),
    },
    {
      width: "10%",
      render: (agave: AgaveType) => (
        <Button onClick={() => handleSetAgaveClick(agave.slug!)}>設置</Button>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        className="bg-white"
        centered={true}
        tabBarGutter={100}
        indicatorSize={130}
      >
        <TabPane tab="一覧から選択" key="1">
          <Card className="text-center border-none" bodyStyle={{ padding: 0 }}>
            <Row className="p-2 text-gray-700 flex items-center justify-center">
              <div className="font-bold text-base">
                配置するアガベを選択してください
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="-1 -1 30 30"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Row>
            <Row className="p-2">
              <Input
                placeholder="検索..."
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                className="rounded m-2"
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
        </TabPane>
        <TabPane tab="新規登録" key="2">
          <Card className="text-center border-none">
            <Row className="p-2 text-gray-700 flex items-center justify-center">
              <div className="font-bold text-base">
                配置するアガベを登録してください
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="-1 -1 30 30"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Row>
            <form className="mb-4 space-y-3" onSubmit={handleSubmit}>
              <Row className="p-2">
                <Input
                  value={agaveName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAgaveName(e.target.value)
                  }
                  className="m-2 rounded"
                  type="text"
                  placeholder="名称..."
                />
              </Row>
              <Row className="p-2">
                <TextArea
                  value={agaveDescription}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setAgaveDescription(e.target.value)
                  }
                  className="m-2 rounded"
                  placeholder="詳細・メモ..."
                  rows={3}
                />
              </Row>
              <button className="w-full px-4 py-2 text-white bg-blue-500 rounded transform transition-transform duration-200 hover:bg-blue-400 hover:scale-95">
                登録
              </button>
            </form>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}
