import { Handle, NodeProps, Position } from "reactflow";

import { ActionList } from "../../constant/Nodes";
import { Button } from "@mui/material";
import { FC } from "react";

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px dashed",
  borderRadius: "10px",
  width: "420px",
  height: "100px",
  gap: 4,
};

const ActionGroup: FC<NodeProps> = ({ ...props }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ left: 75 }} />
      <div style={labelStyle}>
        {ActionList.map((node) => (
          <Button
            id={"action__" + node.id}
            variant="contained"
            onClick={() => props?.data?.func(node)}
          >
            {node.data.label}
          </Button>
        ))}
      </div>
    </>
  );
};

export default ActionGroup;
