import { ImageType } from "./ImageType";
import { RackType } from "./RackType";
import { UserType } from "./UserType";

export interface AgaveType {
  id?: number;
  slug?: string;
  name?: string;
  description?: string;
  iconUrl?: string;
  images?: ImageType[];
  owner?: UserType;
  parentId?: number;
  parent?: AgaveType;
  rackPosition?: number;
  rackCode?: string;
  tags?: string[];
  pups?: AgaveType[];
  rack?: RackType;
}
