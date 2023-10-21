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
import buildImageUrl from "@/app/utils/buildImageUrl";
import useRack, { mutateRack } from "../hooks/useRack";
import { mutate } from "swr";

type RackProps = {
  code: string;
  onLoading: (loading: boolean) => void;
  onUpdate: () => void;
  onSetAgave: (position: number) => void;
};

const Rack = ({ code, onLoading, onUpdate, onSetAgave }: RackProps) => {
  const { rack, rackError, rackLoading } = useRack(code);
  const [rackName, setRackName] = useState("");
  const [agaves, setAgaves] = useState<AgaveType[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (code === "") return;
    setIsEditing(false);
  }, [code]);

  useEffect(() => {
    if (!rack) return;
    setAgaves(positionSetting(rack.agaves!, rack.size));
  }, [rack]);

  const onFinish = async () => {
    onLoading(true);
    try {
      setIsEditing(false);
      if (rackName === "" || rackName === rack!.name) {
        setRackName(rack!.name!);
        return;
      }
      const response = await fetch(`/api/rack/${code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: rackName }),
      });
      if (response.ok) {
        mutateRack(code);
        toast.success("ラック名を更新しました");
      } else {
        toast.error("ラック名の更新に失敗しました");
      }
    } catch (error) {
      toast.error("ラック名の更新に失敗しました");
    }
    onUpdate();
    onLoading(false);
  };

  if (rackLoading) return <div className="text-gray-400">loading...</div>;

  return (
    <div>
      {rack && (
        <div>
          <div className="flex justify-center m-3">
            {isEditing ? (
              <div className="flex justify-center">
                <Input
                  autoFocus
                  defaultValue={rack.name}
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
                {rack.name}
                <EditOutlined className="ml-1" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1 w-full h-full">
            {agaves &&
              agaves.map((agave, index) => (
                <div
                  key={index}
                  className="aspect-square rounded overflow-hidden relative"
                >
                  {agave.slug ? (
                    <Link href={"/agave/" + agave.slug}>
                      {agave.iconUrl ? (
                        <Image
                          src={buildImageUrl(agave.iconUrl)}
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
                    <Card
                      onClick={() => onSetAgave(index + 1)}
                      hoverable
                      className="flex items-center justify-center h-full w-full bg-black border-gray-500 border-2"
                      cover={
                        <div className="text-center text-x text-gray-200">
                          <div>+</div>
                          <div>設置</div>
                          <div className="floor bg-white"></div>
                        </div>
                      }
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rack;
