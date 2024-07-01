import { MarkerType } from "reactflow";
import { v4 as uuidV4 } from "uuid";

export const getNodeStyle = (
  type: any,
  data: any,
  position: any,
  id: any = "id_" + uuidV4()
) => {
  return {
    id,
    type,
    data,
    position,
  };
};
