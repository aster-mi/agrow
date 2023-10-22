"use client";

import { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import buildImageUrl from "../utils/buildImageUrl";
import { UserType } from "../type/UserType";

export default function useProfile() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWRImmutable("/api/mypage", fetcher);
  return {
    profile: data ? buildProfile(data) : undefined,
    profileError: error,
    profileLoading: isLoading,
  };
}

export function mutateProfile() {
  return mutate("/api/mypage");
}

function buildProfile(data: any): UserType {
  return {
    id: data.id,
    name: data.name,
    publicId: data.publicId,
    image: buildImageUrl(data.image),
  };
}
