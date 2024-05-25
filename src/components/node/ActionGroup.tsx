import "./style.css";

import { Handle, NodeProps, Position } from "reactflow";

import { ActionList } from "../../constant/Nodes";
import { Button } from "antd";
import { FC } from "react";

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px dashed",
  borderRadius: "10px",
  width: "350px",
  height: "50px",
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
            onClick={() => props?.data?.func(node)}
            className="btn-action"
          >
            {node.data.label}
          </Button>
        ))}
      </div>
    </>
  );
};

export default ActionGroup;
