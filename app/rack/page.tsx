"use client";

import { useState, useEffect } from "react";
import { Card } from "antd";
import Image from "next/image";
import Link from "next/link";
import NoImage from "@/app/components/NoImage";
import { toast } from "react-toastify";
import { RackPlanType } from "../type/RackPlanType";
import { useRouter } from "next/navigation";
import { RackType } from "../type/RackType";

const { Meta } = Card;

export default function Page() {
  const [rackPlans, setRackPlans] = useState<RackPlanType[]>([]);
  const [myRacks, setMyRacks] = useState<RackType[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/rack/plan")
      .then((response) => response.json())
      .then((data) => setRackPlans(data));
    fetch("/api/myracks")
      .then((response) => response.json())
      .then((data) => setMyRacks(data));
  }, []);

  const handleAddRack = async (id: number) => {
    const res = await fetch(`/api/rack`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });
    const code = await res.json();
    toast.success("棚を追加しました");
    router.push("/rack/" + code);
  };

  return (
    <div className="bg-black">
      <div>
        <div className="text-center text-lg p-2 text-gray-200">
          - 所有している棚 -
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3列
            gap: "1px", // グリッド間の間隔
          }}
        >
          {myRacks &&
            myRacks.map((rack) => (
              <Link key={rack.code} href={"/rack/" + rack.code}>
                <Card
                  key={rack.code}
                  hoverable
                  style={{ width: "33vw" }}
                  cover={
                    <div className="text-center" style={{ height: "20vw" }}>
                      <div className="font-bold">{rack.name}</div>
                      <div>
                        アガベの数：{rack._count?.agaves + "/" + rack.size}
                      </div>
                    </div>
                  }
                ></Card>
              </Link>
            ))}
        </div>
        <div className="text-center text-lg p-2 text-gray-200">
          - 追加できる棚 -
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3列
            gap: "1px", // グリッド間の間隔
          }}
        >
          {rackPlans &&
            rackPlans.map((plan) => (
              <Card
                key={plan.id}
                onClick={() => handleAddRack(plan.id)}
                hoverable
                style={{ width: "33vw" }}
                cover={
                  <div className="text-center" style={{ height: "20vw" }}>
                    <div className="font-bold">{plan.name}</div>
                    <div>月額：{plan.monthlyFee}円</div>
                    <div>サイズ：{plan.size}株分</div>
                    <div>現在の所持数：{}</div>
                  </div>
                }
              ></Card>
            ))}
        </div>
      </div>
    </div>
  );
}
