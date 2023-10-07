import { AgaveType } from "../type/AgaveType";

const positionSetting = (agaves: AgaveType[], rackSize: number) => {
  const result: AgaveType[] = Array.from({ length: rackSize }, (_, index) => {
    const foundAgave = agaves.find((agave) => agave.rackPosition === index + 1);
    return foundAgave || {};
  });
  return result;
};
export default positionSetting;
