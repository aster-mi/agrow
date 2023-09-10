"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Card, Row, Col, Input, Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { AgaveType } from "../type/AgaveType";
import { addAgave } from "./api";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [dataSource, setDataSource] = useState<AgaveType[]>([]);
  const [agaveName, setAgaveName] = useState<string>("");
  const [agaveDescription, setAgaveDescription] = useState<string>("");

  const handleGetAgaves = async () => {
    const response = await fetch("/api/agave/list");
    const agaves = await response.json();
    setDataSource(agaves);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await addAgave({ name: agaveName, description: agaveDescription });
    setAgaveName("");
    setAgaveDescription("");
    router.refresh;
  };

  return (
    <div>
      <Card title="Agave">
        <form className="mb-4 space-y-3" onSubmit={handleSubmit}>
          <input
            value={agaveName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAgaveName(e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="name..."
          />
          <input
            value={agaveDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAgaveDescription(e.target.value)
            }
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
            type="text"
            placeholder="description..."
          />
          <button className="w-full px-4 py-2 text-white bg-blue-500 rounded transform transition-transform duration-200 hover:bg-blue-400 hover:scale-95">
            Add new agave!
          </button>
        </form>
      </Card>
    </div>
  );
}
