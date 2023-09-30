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
    ownerName: agave.owner?.name,
    parentId: agave.parentId,
    parentName: agave.parent?.name,
    parentSlug: agave.parent?.slug,
    images: agave.agaveImages.map((image: any) => image.url), // images プロパティを url の配列に変換
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
  const updatedagave = await res.json();
  return updatedagave;
};

export const deleteAgave = async (slug: string): Promise<AgaveType> => {
  const res = await fetch(`${baseUrl}/${slug}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const deleteagave = await res.json();
  return deleteagave;
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
  const deleteImage = await res.json();
  return deleteImage;
};
