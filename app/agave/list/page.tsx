"use client";

import { useState, useEffect } from "react";
import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import { AgaveType } from "../../type/AgaveType";
import DummyImage from "@/components/DummyImage";
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
    <div>
      <Card title="アガベ一覧">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3列
            gap: "5px", // グリッド間の間隔
          }}
        >
          {dataSource.map((agave) => (
            <div key={agave.slug}>
              <Link href={agave.slug}>
                <Card
                  hoverable
                  style={{ width: 100 }}
                  cover={
                    agave.iconUrl ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${agave.iconUrl}`}
                        alt={`Image icon`}
                        width={100}
                        height={75}
                      />
                    ) : (
                      <NoImage />
                    )
                  }
                >
                  <Meta title={agave.name} />
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
