"use client";

import { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import { RackType } from "../type/RackType";

export default function useMyRacks() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWRImmutable("/api/myracks", fetcher);
  return {
    myRacks: data as RackType[],
    myRacksError: error,
    myRacksLoading: isLoading,
  };
}

export function mutateMyRacks() {
  return mutate("/api/myracks", undefined, true);
}
