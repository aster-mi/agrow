import { ImageType } from "./ImageType";

export interface AgaveType {
  id?: number;
  slug?: string;
  name?: string;
  description?: string;
  iconUrl?: string;
  images?: ImageType[];
  ownerId?: string;
  ownerName?: string;
  parentId?: number;
  parentName?: string;
  parentSlug?: string;
}
