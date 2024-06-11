import "./style.css";

import { Handle, NodeProps, Position } from "reactflow";

import { ActionList } from "../../constant/Nodes";
import { Button } from "antd";
import { FC } from "react";

const ActionGroup: FC<NodeProps> = ({ isDisableAddAction, func }: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="node-group__container">
        {ActionList.map((node) => (
          <Button
            key={node.id}
            id={node.id}
            onClick={() => func(node)}
            className="btn-action"
            disabled={
              isDisableAddAction ||
              node.id === "action__if-else-condition" ||
              node.id === "action__loop"
            }
          >
            {node.data.label}
          </Button>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default ActionGroup;
