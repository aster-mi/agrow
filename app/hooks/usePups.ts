"use client";

import { mutate, preload } from "swr";
import useSWRImmutable from "swr/immutable";
import { AgaveType } from "../type/AgaveType";

export default function usePups(slug: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWRImmutable(
    `/api/agave/${slug}/pup`,
    fetcher
  );
  return {
    pups: data ? (data.pups as AgaveType[]) : undefined,
    pupsError: error,
    pupsLoading: isLoading,
  };
}

export function mutatePups(slug: string) {
  return mutate(`/api/agave/${slug}/pup`, undefined, true);
}
