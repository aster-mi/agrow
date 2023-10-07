"use client";

import { useState, useEffect } from "react";
import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import NoImage from "@/app/components/NoImage";
import { useParams } from "next/navigation";
import { RackType } from "@/app/type/RackType";
import { toast } from "react-toastify";
import positionSetting from "@/app/utils/positionSetting";
import { AgaveType } from "@/app/type/AgaveType";

const { Meta } = Card;

export default function Page() {
  const { rack } = useParams();
  const [rackData, setRackData] = useState<RackType>();
  const [agaves, setAgaves] = useState<AgaveType[]>([]);

  useEffect(() => {
    try {
      fetch(`/api/rack/${rack}`)
        .then((response) => response.json())
        .then((data) => {
          setRackData(data);
          setAgaves(positionSetting(data.agaves, data.size));
        });
    } catch (error) {
      console.log(error);
      toast.error("棚の取得に失敗しました");
    }
  }, []);

  return (
    <div className="bg-black">
      {rackData && (
        <div>
          <div className="text-center text-lg p-2 text-gray-200">
            - {rackData?.name} -
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
