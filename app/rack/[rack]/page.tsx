"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Rack from "@/app/components/Rack";
import Loading from "@/app/loading";

export default function Page() {
  const { rack } = useParams();
  const [pageLoading, setPageLoading] = useState<boolean>(true);

  return (
    <>
      {pageLoading && <Loading />}
      <Rack
        code={rack as string}
        onLoading={setPageLoading}
        onSetAgave={() => {}}
      />
    </>
  );
}
