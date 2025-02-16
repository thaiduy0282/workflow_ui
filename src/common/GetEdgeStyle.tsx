import { MarkerType } from "reactflow";
import { v4 as uuidV4 } from "uuid";

export const getEdgeStyle = (
  source: any,
  target: any,
  typeEdge: any,
  animated: any = true,
  edgeType: any = "",
  label?: any
) => {
  return {
    id: "id_" + uuidV4(),
    source,
    target,
    animated,
    type: "smoothstep",
    label,
    labelStyle: { fill: "black", fontWeight: 700 },
    style: {
      strokeWidth: 1,
      stroke: "#b1b1b1",
    },
    data: {
      typeEdge,
      edgeType,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: "#b1b1b1",
    },
  };
};
