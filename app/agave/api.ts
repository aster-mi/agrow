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
