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
          <div className="grid grid-cols-3 gap-1 w-full h-full">
            {agaves.length > 0 &&
              agaves.map((agave, index) => (
                <div
                  key={index}
                  className="aspect-square rounded overflow-hidden relative"
                >
                  {agave.slug ? (
                    <Link href={"/agave/" + agave.slug}>
                      {agave.iconUrl ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${agave.iconUrl}`}
                          alt={`Image icon`}
                          priority={true}
                          width={500}
                          height={500}
                          className="relative w-full h-full object-cover"
                        />
                      ) : (
                        <NoImage />
                      )}
                      <div className="absolute text-xs bottom-0 left-0 text-white bg-black bg-opacity-70 pr-1 mb-1 rounded-r-full">
                        {agave.name}
                      </div>
                    </Link>
                  ) : (
                    <Link href={`/rack/${rack}/position/${index + 1}/agave`}>
                      <Card
                        hoverable
                        className="flex items-center justify-center h-full w-full border-gray-500 border-2 bg-transparent"
                        cover={
                          <div className="text-center text-x text-gray-200">
                            <div>+</div>
                            <div>設置</div>
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
