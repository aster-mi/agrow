"use client";

import { useState, useEffect } from "react";
import { Card, Form, Input, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import NoImage from "@/app/components/NoImage";
import { useParams } from "next/navigation";
import { RackType } from "@/app/type/RackType";
import { toast } from "react-toastify";
import positionSetting from "@/app/utils/positionSetting";
import { AgaveType } from "@/app/type/AgaveType";
import { EditOutlined } from "@ant-design/icons";

const { Meta } = Card;

export default function Page() {
  const { rack } = useParams();
  const [rackData, setRackData] = useState<RackType>();
  const [rackName, setRackName] = useState("");
  const [agaves, setAgaves] = useState<AgaveType[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    try {
      fetch(`/api/rack/${rack}`)
        .then((response) => response.json())
        .then((data) => {
          setRackData(data);
          setAgaves(positionSetting(data.agaves, data.size));
          setRackName(data.name);
        });
    } catch (error) {
      console.log(error);
      toast.error("棚の取得に失敗しました");
    }
  }, []);

  const onFinish = async () => {
    console.log("called");
    try {
      setIsEditing(false);
      const response = await fetch(`/api/rack/${rack}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: rackName }),
      });
      if (response.ok) {
        setRackData((prevRackData) => {
          if (!prevRackData) return prevRackData;
          return { ...prevRackData, name: rackName };
        });
        toast.success("棚名を更新しました");
      } else {
        toast.error("棚名の更新に失敗しました");
      }
    } catch (error) {
      console.log(error);
      toast.error("棚名の更新に失敗しました");
    }
  };

  return (
    <div className="bg-black">
      {rackData && (
        <div>
          <div className="flex justify-center m-3">
            {isEditing ? (
              <div className="flex justify-center">
                <Input
                  autoFocus
                  defaultValue={rackData.name}
                  onChange={(e) => setRackName(e.target.value)}
                  className="p-0 border-none rounded"
                />
                <Button
                  onClick={onFinish}
                  className="bg-green-600 border-none text-white rounded"
                >
                  保存
                </Button>
              </div>
            ) : (
              <div onClick={() => setIsEditing(true)}>
                {rackData.name}
                <EditOutlined className="ml-1" />
              </div>
            )}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)", // 3列
              gap: "1px", // グリッド間の間隔
            }}
          >
            {agaves.length > 0 &&
              agaves.map((agave, index) => (
                <div key={index} className="aspect-square">
                  {agave.slug ? (
                    <Link href={"/agave/" + agave.slug}>
                      <Card
                        className="w-full h-full overflow-hidden border-none"
                        hoverable
                        style={{ width: "33vw" }}
                        cover={
                          <div>
                            {agave.iconUrl ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${agave.iconUrl}`}
                                alt={`Image icon`}
                                priority={true}
                                width={500}
                                height={500}
                              />
                            ) : (
                              <NoImage />
                            )}
                          </div>
                        }
                      ></Card>
                    </Link>
                  ) : (
                    <Link href={`/rack/${rack}/position/${index + 1}/agave`}>
                      <Card
                        hoverable
                        className="flex items-center justify-center h-full w-full"
                        cover={
                          <div className="text-center text-x text-gray-500">
                            <div>+</div>
                            <div>アガベを設置</div>
                          </div>
                        }
                      />
                    </Link>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
