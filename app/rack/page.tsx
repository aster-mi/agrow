"use client";

import { useState, useEffect } from "react";
import { Card, Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import NoImage from "@/app/components/NoImage";
import { toast } from "react-toastify";
import { RackPlanType } from "../type/RackPlanType";
import { useRouter } from "next/navigation";
import { RackType } from "../type/RackType";
import Loading from "../loading";
import LoadingAnime from "../components/LoadingAnime";

const { Meta } = Card;

export default function Page() {
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [rackPlans, setRackPlans] = useState<RackPlanType[]>([]);
  const [myRacks, setMyRacks] = useState<RackType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMyRack();
    setPageLoading(false);
  }, []);

  const fetchMyRack = async () => {
    fetch("/api/myracks")
      .then((response) => response.json())
      .then((data) => setMyRacks(data));
  };

  const fetchRackPlan = async () => {
    fetch("/api/rack/plan")
      .then((response) => response.json())
      .then((data) => setRackPlans(data));
  };

  const handleAddRack = async (id: number) => {
    const res = await fetch(`/api/rack`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(id),
    });
    const code = await res.json();
    fetchMyRack();
    setIsModalVisible(false);
    toast.success("棚を追加しました");
  };

  const showModal = () => {
    setPageLoading(true);
    fetchRackPlan();
    setIsModalVisible(true);
    setPageLoading(false);
  };

  return (
    <div className="bg-black">
      {pageLoading && <Loading />}
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
        <Modal
          title="追加できる棚"
          open={isModalVisible}
          footer={null}
          mask={true}
          onCancel={() => setIsModalVisible(false)}
        >
          {rackPlans.map((plan) => (
            <Card
              className="bg-gray-100 m-2 shadow-md"
              key={plan.id}
              onClick={() => handleAddRack(plan.id)}
              hoverable
              cover={
                <div className="text-center">
                  <div className="font-bold">{plan.name}</div>
                  <div>月額：{plan.monthlyFee}円</div>
                  <div>サイズ：{plan.size}株分</div>
                </div>
              }
            ></Card>
          ))}
        </Modal>
        <div className="text-center">
          <button
            onClick={showModal}
            className="mt-5 p-2 border-2 border-green-600 bg-black hover:bg-green-600 rounded-full text-white"
          >
            棚を追加
          </button>
        </div>
      </div>
    </div>
  );
}
