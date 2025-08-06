"use client";

import { mutate } from "swr";
import useSWRImmutable from "swr/immutable";
import { AgaveType } from "../type/AgaveType";

export default function useAgave(slug: string) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, isLoading } = useSWRImmutable(
    `/api/agave/${slug}`,
    fetcher
  );
  return {
    agave: data ? buildAgave(data) : undefined,
    agaveError: error,
    agaveLoading: isLoading,
  };
}

export function mutateAgave(slug: string) {
  return mutate(`/api/agave/${slug}`, undefined, true);
}

function buildAgave(data: any): AgaveType {
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description,
    iconUrl: data.iconUrl,
    owner: data.owner,
    parentId: data.parentId,
    parent: data.parent,
    pups: data.pups,
    rack: data.rack,
    tags: data.tags.map((arg: any) => arg.tag.name),
    images: data.agaveImages.map((image: any) => image),
  };
}
