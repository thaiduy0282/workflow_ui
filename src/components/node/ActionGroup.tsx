import "./style.css";

import { Handle, NodeProps, Position } from "reactflow";

import { ActionList } from "../../constant/Nodes";
import { Button } from "antd";
import { FC } from "react";

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "10px",
  padding: "12px",
  gap: 4,
};

const ActionGroup: FC<NodeProps> = ({ func }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} style={{ left: 75 }} />
      <div className="node-group__container">
        {ActionList.map((node) => (
          <Button
            key={"action__" + node.id}
            id={"action__" + node.id}
            onClick={() => func(node)}
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
