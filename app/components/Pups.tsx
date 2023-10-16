"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Row, Table } from "antd";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import Image from "next/image";
import { AgaveType } from "@/app/type/AgaveType";
import NoImage from "@/app/components/NoImage";
import { addAgave, getAgave } from "@/app/agave/api";
import { toast } from "react-toastify";
import buildImageUrl from "@/app/utils/buildImageUrl";
import ModalButton from "@/app/components/ModalButton";
import UserView from "./UserView";

type PupsProps = {
  children: JSX.Element;
  isMine: boolean;
  onLoading: (loading: boolean) => void;
};

interface Agave {
  name: string;
  description: string;
  slug: string;
}

const Pups = ({ children, isMine, onLoading }: PupsProps) => {
  const { slug } = useParams();
  const session = useSession();
  const [dataSource, setDataSource] = useState<AgaveType[]>([]);
  const router = useRouter();

  useEffect(() => {
    onLoading(true);
    try {
      fetch(`/api/agave/${slug}/pup`)
        .then((response) => response.json())
        .then((data: AgaveType) => {
          setDataSource(data.pups || []);
        });
    } catch (error) {
      toast.error("データの取得に失敗しました");
      router.back();
    }
    onLoading(false);
  }, []);

  const handleAddPup = async (e: FormEvent) => {
    onLoading(true);
    e.preventDefault();

    const parent = await getAgave(slug as string);
    const pupName = parent.name! + " pup:#" + (parent.pups!.length + 1);

    const agave = await addAgave({
      name: pupName,
      parentId: parent.id,
    });
    const newDataSource = [agave, ...dataSource];
    setDataSource(newDataSource);
    onLoading(false);
    toast.success("登録完了！");
  };

  const columns: ColumnsType<AgaveType> = [
    {
      title: "サムネ",
      width: "30%",
      render: (agave: AgaveType) => (
        <div className="">
          <Link href={`/agave/${agave.slug}`}>
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
          </Link>
        </div>
      ),
    },
    {
      title: "名前/詳細",
      width: "30%",
      filterSearch: true,
      render: (agave: AgaveType) => (
        <div className="h-full">
          <Link href={`/agave/${agave.slug}`}>
            <div className="mb-2 top-0">
              <UserView user={agave.owner} />
            </div>
            <div>{agave.name}</div>
            <div>{agave.description}</div>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <ModalButton buttonChildren={children}>
      <div>
        {isMine && (
          <Row className="flex flex-row justify-center">
            <button
              className="m-2 px-10 py-3 rounded-full border-none bg-green-700 text-white font-bold"
              onClick={handleAddPup}
            >
              子株を追加
            </button>
          </Row>
        )}
        <Table
          dataSource={dataSource}
          showHeader={false}
          columns={columns}
          rowKey={(agave) => agave.slug!}
          pagination={false}
        />
      </div>
    </ModalButton>
  );
};

export default Pups;
