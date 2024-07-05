import "./style.css";

import {
  DeleteOutlined,
  NodeIndexOutlined,
  PlusOutlined,
  RetweetOutlined,
  RocketOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import { FC, useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { ReactFlowContext } from "../../../detail";

type MenuItem = Required<MenuProps>["items"][number];

const ActionGroup: FC<NodeProps> = (props: any) => {
  const { handleChangeActionId, onNodesDelete }: any =
    useContext(ReactFlowContext);

  const initItems: MenuItem[] = [
    {
      key: "condition",
      icon: <NodeIndexOutlined />,
      label: "Condition",
      children: [
        {
          key: "condition-1-1",
          label: "IF",
          onClick: () =>
            handleChangeActionId(
              {
                id: "action__condition",
                data: { typeNode: "action__Condition", label: "IF" },
              },
              props
            ),
        },
        {
          key: "condition-1-2",
          label: "IF/ELSE",
          onClick: () =>
            handleChangeActionId(
              {
                id: "action__if-else-condition",
                data: {
                  typeNode: "action__If-Else-Condtion",
                  label: "IF/ELSE",
                },
              },
              props
            ),
        },
      ],
    },
    {
      key: "action",
      icon: <RocketOutlined />,
      label: "Action",
      onClick: () =>
        handleChangeActionId(
          {
            id: "action__action",
            data: { typeNode: "action__Action", label: "Action" },
          },
          props
        ),
    },
    {
      key: "loop",
      label: "Loop",
      icon: <RetweetOutlined />,
      onClick: () =>
        handleChangeActionId(
          {
            id: "action__loop",
            data: { typeNode: "action__Loop", label: "Loop" },
          },
          props
        ),
    },
  ];

  const endNode: MenuItem = {
    key: "end",
    label: "End",
    icon: <StopOutlined />,
    onClick: () =>
      handleChangeActionId(
        {
          id: "action__endEvent",
          data: { typeNode: "action__EndEvent", label: "End" },
        },
        props
      ),
  };

  const removeNode: MenuItem = {
    key: "remove",
    label: "Remove",
    icon: <DeleteOutlined />,
    onClick: () => onNodesDelete([props]),
  };

  const items: MenuItem[] =
    props.data.isActionDraft || props.data.isLoopAction
      ? [...initItems, removeNode]
      : [...initItems, endNode];
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} id="no" />
      <Dropdown
        menu={{ items }}
        placement="bottomRight"
        trigger={["click"]}
        className="node-group__container"
      >
        <PlusOutlined style={{ fontSize: "8px" }} />
      </Dropdown>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} id="no" />
    </>
  );
};

export default ActionGroup;
