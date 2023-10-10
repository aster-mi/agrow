"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Card, Input, Modal, Progress, Row } from "antd"; // Import Progress component
import Image from "next/image";
import Link from "next/link";
import NoImage from "@/app/components/NoImage";
import { toast } from "react-toastify";
import { RackPlanType } from "../type/RackPlanType";
import { useRouter } from "next/navigation";
import { RackType } from "../type/RackType";
import Loading from "../loading";
import LoadingAnime from "../components/LoadingAnime";
import positionSetting from "../utils/positionSetting";
import Rack from "../components/Rack";
import ModalButton from "../components/ModalButton";

const { Meta } = Card;

export default function Page() {
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [rackPlans, setRackPlans] = useState<RackPlanType[]>([]);
  const [myRacks, setMyRacks] = useState<RackType[]>([]);
  const [allRacks, setAllRacks] = useState<RackType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rackCode, setRackCode] = useState<string>("");
  const [openRack, setOpenRack] = useState(false);
  const [racksVisible, setRacksVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchMyRack();
    setPageLoading(false);
  }, []);

  const fetchMyRack = async () => {
    fetch("/api/myracks")
      .then((response) => response.json())
      .then((data) => {
        setMyRacks(data);
        setAllRacks(data);
        setSearchValue("");
        if (data.length > 0 && !openRack) {
          setRackCode(data[0].code);
          setOpenRack(true);
        }
      });
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

  const handleOnLoading = (loading: boolean) => {
    setPageLoading(loading);
    setRacksVisible(false);
  };

  const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const currValue = e.target.value;
    setSearchValue(currValue);
    if (currValue) {
      const filteredData = allRacks.filter((entry) =>
        entry.name?.includes(currValue)
      );
      setMyRacks(filteredData);
    } else {
      setMyRacks(allRacks);
    }
  };

  return (
    <div>
      {pageLoading && <Loading />}
      <div>
        <Row className="flex flex-row justify-end">
          <ModalButton
            buttonChildren={
              <div className="w-20 p-1 m-1 bg-green-500 rounded text-center text-lg text-white">
                棚一覧
              </div>
            }
            isVisible={racksVisible}
          >
            <div className="text-center text-lg font-bold p-2 text-neutral-700">
              所持している棚
            </div>
            <div
              className="flex flex-row px-24"
              style={{ overflowX: "scroll" }}
            >
              {myRacks &&
                myRacks.map((rack) => (
                  <div
                    key={rack.code}
                    onClick={() => {
                      setRackCode(rack.code);
                      setOpenRack(true);
                      setRacksVisible(true);
                    }}
                  >
                    <div
                      className={
                        "w-20 h-36 shadow-m flex flex-col justify-end mb-3 " +
                        (rackCode === rack.code
                          ? "border-2 border-yellow-300 bg-yellow-50"
                          : "border")
                      }
                    >
                      <div className="text-center">
                        <div className="font-bold"></div>
                        <div className="flex flex-row justify-center">
                          <div className="flex flex-col justify-items-end">
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "1px",
                                width: "32px",
                              }}
                            >
                              {positionSetting(rack.agaves!, rack.size).map(
                                (agave, index) =>
                                  agave.rackPosition ? (
                                    <div
                                      key={index}
                                      className="bg-green-500"
                                      style={{ height: "10px", width: "10px" }}
                                    ></div>
                                  ) : (
                                    <div
                                      key={index}
                                      className="bg-neutral-300"
                                      style={{ height: "10px", width: "10px" }}
                                    ></div>
                                  )
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex-wrap w-20 text-xs">
                          {rack.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="ml-4 w-10 h-36 flex flex-col justify-center">
                <button
                  onClick={showModal}
                  className="rounded-full font-bold text-2xl bg-green-600 text-white w-10 h-10"
                >
                  +
                </button>
              </div>
            </div>
            <Row className="p-2">
              <Input
                placeholder="棚名で絞り込み..."
                value={searchValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                className="rounded m-2"
              />
            </Row>
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
          </ModalButton>
        </Row>
      </div>
      {openRack && (
        <Rack
          rack={rackCode}
          onLoading={handleOnLoading}
          onUpdate={() => fetchMyRack()}
        />
      )}
    </div>
  );
}
