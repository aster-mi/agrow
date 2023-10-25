"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Modal, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import Image from "next/image";
import { AgaveType } from "@/app/type/AgaveType";
import NoImage from "@/app/components/NoImage";
import { addAgave, getAgave } from "@/app/agave/api";
import { toast } from "react-toastify";
import buildImageUrl from "@/app/utils/buildImageUrl";
import UserView from "./UserView";
import { mutateAgave } from "../hooks/useAgave";
import React from "react";
import usePups, { mutatePups } from "../hooks/usePups";
import { useSession } from "next-auth/react";

type PupsProps = {
  slug: string;
  children: JSX.Element;
  isMine: boolean;
};

interface Agave {
  name: string;
  description: string;
  slug: string;
}

const Pups = ({ slug, children, isMine }: PupsProps) => {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { pups, pupsError, pupsLoading } = usePups(slug as string);

  const handleAddPup = async () => {
    setLoading(true);
    const parent = await getAgave(slug as string);
    const pupName = parent.name! + " pup:#" + (parent.pups!.length + 1);
    const agave = await addAgave({
      name: pupName,
      parentId: parent.id,
    });
    mutateAgave(slug as string);
    mutatePups(slug as string);
    setLoading(false);
    toast.success("子株の追加が完了しました");
  };

  const columns: ColumnsType<AgaveType> = [
    {
      title: "サムネ",
      width: "25%",
      render: (agave: AgaveType) => (
        <div className="h-20 w-20">
          <Link href={`/agave/${agave.slug}`}>
            <div className="rounded-lg overflow-hidden">
              {agave.iconUrl ? (
                <Image
                  src={buildImageUrl(agave.iconUrl)}
                  alt={`Image icon`}
                  className="w-full h-full object-cover"
                  width={50}
                  height={50}
                />
              ) : (
                <NoImage />
              )}
            </div>
          </Link>
        </div>
      ),
    },
    {
      title: "名前/詳細",
      width: "75%",
      filterSearch: true,
      render: (agave: AgaveType) => (
        <Link className="h-20 top-0" href={`/agave/${agave.slug}`}>
          <div className="flex flex-row justify-between">
            <div className="font-bold">{agave.name}</div>
            {agave.owner?.id === session?.data?.user?.id && (
              <div className="text-green-500 text-xs font-bold">所有中</div>
            )}
          </div>
          <div className="h-16 overflow-hidden">{agave.description}</div>
        </Link>
      ),
    },
  ];

  if (pupsLoading) {
    return <div>loading...</div>;
  }
  if (pupsError) {
    return <div>error...</div>;
  }

  return (
    <>
      {children &&
        React.cloneElement(children, { onClick: () => setVisible(true) })}

      <Modal open={visible} onCancel={() => setVisible(false)} footer={null}>
        <div>
          {isMine && (
            <Row className="flex flex-row justify-center">
              <button
                className="m-2 px-10 py-3 rounded-full border-none bg-green-700 text-white font-bold disabled:opacity-50"
                onClick={handleAddPup}
                disabled={loading}
              >
                子株を追加
              </button>
            </Row>
          )}
          <Table
            dataSource={pups}
            showHeader={false}
            columns={columns}
            rowKey={(agave) => agave.slug!}
            pagination={false}
          />
        </div>
      </Modal>
    </>
  );
};

export default Pups;
