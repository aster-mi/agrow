import { AgaveType } from "./AgaveType";

export interface RackType {
  code: string;
  name?: string;
  ownerId: string;
  design?: string;
  size: number;
  monthlyFee?: number;
  rackPlanId?: number;
  agaves?: AgaveType[];
  _count?: _count;
}

interface _count {
  owner: number;
  agaves: number;
  rackPlan: number;
}
