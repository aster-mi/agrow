"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Card, Input, Modal, Row } from "antd";
import { toast } from "react-toastify";
import { RackPlanType } from "../type/RackPlanType";
import { useParams } from "next/navigation";
import { RackType } from "../type/RackType";
import Loading from "../loading";
import positionSetting from "../utils/positionSetting";
import Rack from "../components/Rack";
import SetAgave from "../components/SetAgave";
import useMyRacks, { mutateMyRacks } from "../hooks/useMyRacks";
import { mutateRack } from "../hooks/useRack";

export default function Page() {
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [rackPlans, setRackPlans] = useState<RackPlanType[]>([]);
  const { myRacks, myRacksError, myRacksLoading } = useMyRacks();
  const [showRacks, setShowRacks] = useState<RackType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rackCode, setRackCode] = useState<string>("");
  const [openRack, setOpenRack] = useState(false);
  const [racksVisible, setRacksVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [openSetPosition, setOpenSetPosition] = useState<number>(0);

  useEffect(() => {
    if (!myRacks) return;
    setShowRacks(myRacks);
    setSearchValue("");
    if (myRacks.length === 0) {
      setRacksVisible(false);
      setOpenRack(false);
      setRacksVisible(true);
      showModal();
      return;
    }
    const openedRackCode = sessionStorage.getItem("openedRackCode");
    if (openedRackCode) {
      // sessionStorageに開いているラックのcodeがある場合はそのラックを開く
      setRackCode(openedRackCode);
    } else {
      // ない場合は0番目のラックを開く
      const rackCode = myRacks[0].code;
      setRackCode(rackCode);
      sessionStorage.setItem("openedRackCode", rackCode);
    }
    setOpenRack(true);
    setPageLoading(false);
  }, [myRacks]);

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
    mutateMyRacks();
    console.log("mutate myRacks");
    setIsModalVisible(false);
    toast.success("ラックを追加しました");
    sessionStorage.setItem("openedRackCode", code);
    setRackCode(code);
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
      const filteredData = myRacks.filter((entry) =>
        entry.name?.includes(currValue)
      );
      setShowRacks(filteredData);
    } else {
      setShowRacks(myRacks);
    }
  };

  if (pageLoading || myRacksLoading) return <Loading />;
  if (myRacksError) return <div>failed to load</div>;

  return (
    <div>
      <div>
        <Row className="flex flex-row justify-end">
          <div
            onClick={() => setRacksVisible(true)}
            className="w-24 p-1 m-1 bg-green-500 rounded text-center font-bold text-white"
          >
            Myラック
          </div>
          <Modal
            title="My ラック"
            open={racksVisible}
            footer={null}
            mask={false}
            onCancel={() => setRacksVisible(false)}
          >
            <div className="text-center text-lg font-bold p-2 text-neutral-700">
              所持しているラック
            </div>
            <div className="flex flex-row px-2 pb-10 overflow-x-scroll">
              {showRacks &&
                showRacks.map((rack) => (
                  <div
                    key={rack.code}
                    onClick={() => {
                      sessionStorage.setItem("openedRackCode", rack.code);
                      setRackCode(rack.code);
                      setOpenRack(true);
                      setRacksVisible(true);
                    }}
                  >
                    <div
                      className={
                        "w-20 h-48 shadow-m flex flex-col justify-end mb-3 " +
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
                        <div className="flex-wrap w-20 text-xs h-10">
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
                placeholder="ラック名で絞り込み..."
                value={searchValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                className="rounded m-2"
              />
            </Row>
            <Modal
              title="追加できるラック"
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
          </Modal>
        </Row>
      </div>
      {openRack && (
        <Rack
          code={rackCode}
          onLoading={handleOnLoading}
          onUpdate={mutateMyRacks}
          onSetAgave={setOpenSetPosition}
        />
      )}
      {openSetPosition !== 0 && (
        <SetAgave
          rack={rackCode}
          position={openSetPosition}
          onLoading={setPageLoading}
          onUpdate={() => mutateRack(rackCode)}
          onCancel={() => setOpenSetPosition(0)}
        />
      )}
    </div>
  );
}
