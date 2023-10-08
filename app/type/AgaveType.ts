import { ImageType } from "./ImageType";
import { RackType } from "./RackType";

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
  rackPosition?: number;
  rackCode?: string;
  pups?: AgaveType[];
  rack?: RackType;
}
