export interface AgaveType {
  id?: number;
  slug?: string;
  name?: string;
  description?: string;
  iconUrl?: string;
  images?: string[];
  ownerId?: string;
  ownerName?: string;
  parentId?: number;
  parentName?: string;
  parentSlug?: string;
}
