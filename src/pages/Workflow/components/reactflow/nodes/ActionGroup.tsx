import "./style.css";

import { Button, Tooltip } from "antd";
import { Handle, NodeProps, Position } from "reactflow";

import { ActionList } from "../../../../../constant/Nodes";
import { CloseOutlined } from "@ant-design/icons";
import { FC } from "react";

const ActionGroup: FC<NodeProps> = (props: any) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="node-group__container">
        {ActionList.map((node: any) =>
          props.data.isActionDraft ? (
            node.data.typeNode !== "action__EndEvent" && (
              <Button
                key={node.id}
                id={node.id}
                onClick={() => props.onSelectAction(node, props)}
                className="btn-action"
                disabled={props.isDisableAddAction}
              >
                {node.data.label}
              </Button>
            )
          ) : (
            <Button
              key={node.id}
              id={node.id}
              onClick={() => props.onSelectAction(node, props)}
              className="btn-action"
              disabled={props.isDisableAddAction}
            >
              {node.data.label}
            </Button>
          )
        )}
        {props.data.isActionDraft && (
          <Tooltip title="Delete">
            <Button
              onClick={() => props.onNodesDelete([props])}
              shape="circle"
              className="btn-delete"
              icon={<CloseOutlined style={{ fontSize: "8px" }} />}
            />
          </Tooltip>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default ActionGroup;
