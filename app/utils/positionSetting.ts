import { AgaveType } from "../type/AgaveType";

const positionSetting = (agaves: AgaveType[], rackSize: number) => {
  if (agaves.length === 0) {
    return Array.from({ length: rackSize }, () => ({} as AgaveType));
  }
  const result: AgaveType[] = Array.from({ length: rackSize }, (_, index) => {
    const foundAgave = agaves.find((agave) => agave.rackPosition === index + 1);
    return foundAgave || {};
  });
  return result;
};
export default positionSetting;
