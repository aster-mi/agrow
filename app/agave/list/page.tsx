"use client";

import { useState, useEffect } from "react";
import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import NoImage from "@/app/components/NoImage";

const { Meta } = Card;

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

  return (
    <div className="bg-black">
      <div>
        <div className="text-center text-lg p-2 text-gray-200">- Agaves -</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3列
            gap: "1px", // グリッド間の間隔
          }}
        >
          {dataSource.map((agave) => (
            <div key={agave.slug}>
              <Link href={agave.slug}>
                <Card
                  hoverable
                  style={{ width: "33vw" }}
                  cover={
                    <div className="overflow-hidden" style={{ height: "20vw" }}>
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
                >
                  <div className="text-xs line-clamp-3 font-bold text-gray-800 h-12">
                    {agave.name}
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="h-10 w-full"></div>
      <div className="h-10 w-full"></div>
    </div>
  );
}
