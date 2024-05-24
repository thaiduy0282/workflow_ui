import { Handle, NodeProps, Position } from "reactflow";

import { FC } from "react";

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px solid",
  borderRadius: "10px",
  width: 915,
  height: 150,
};

const ActionGroup: FC<NodeProps> = () => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ left: 75 }} />
      <div style={labelStyle}></div>
    </>
  );
};

export default ActionGroup;
