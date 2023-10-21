"use client";

import { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import { RackType } from "../type/RackType";

export default function useRack(code: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWRImmutable(
    `/api/rack/${code}`,
    fetcher
  );
  return {
    rack: data as RackType,
    rackError: error,
    rackLoading: isLoading,
  };
}

export function mutateRack(code: string) {
  return mutate(`/api/rack/${code}`);
}
