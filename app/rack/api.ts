import { AgaveType } from "@/app/type/AgaveType";

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

export const updatePosition = async (
  slug: string,
  rackCode: string,
  rackPosition: number
): Promise<AgaveType> => {
  const res = await fetch(`${baseUrl}/${slug}/position`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ rackCode, rackPosition }),
  });
  return await res.json();
};
