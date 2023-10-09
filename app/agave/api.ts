import { AgaveType } from "../type/AgaveType";

const baseUrl = "/api/agave";

export const addAgave = async (agave: AgaveType): Promise<AgaveType> => {
  const res = await fetch(`${baseUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agave),
  });
  const newagave = await res.json();
  return newagave;
};

export const getAgave = async (slug: string): Promise<AgaveType> => {
  const res = await fetch(`${baseUrl}/${slug}`);
  const agave = await res.json();
  const result: AgaveType = {
    id: agave.id,
    slug: agave.slug,
    name: agave.name,
    description: agave.description,
    iconUrl: agave.iconUrl,
    ownerName: agave.owner?.name,
    ownerId: agave.ownerId,
    parentId: agave.parentId,
    parent: agave.parent,
    pups: agave.pups,
    images: agave.agaveImages.map((image: any) => image), // images プロパティを url の配列に変換
  };
  return result;
};

export const addImages = async (agave: AgaveType) => {
  await fetch(`${baseUrl}/images/${agave.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(agave),
  });
};

export const updateAgave = async (
  slug: string,
  agave: AgaveType
): Promise<AgaveType> => {
  const res = await fetch(`${baseUrl}/${slug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ agave }),
  });
  return await res.json();
};

export const deleteAgave = async (slug: string): Promise<AgaveType> => {
  const res = await fetch(`${baseUrl}/${slug}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

export const deleteImage = async (
  slug: string,
  image: string
): Promise<AgaveType> => {
  const res = await fetch(`${baseUrl}/${slug}/image/${image}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
};

export const setAgaveIcon = async (
  slug: string,
  image: string
): Promise<AgaveType> => {
  const res = await fetch(`${baseUrl}/${slug}/icon`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image }),
  });
  return await res.json();
};
