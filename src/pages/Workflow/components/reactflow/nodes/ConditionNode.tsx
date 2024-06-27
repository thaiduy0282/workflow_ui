import "./style.css";

import {
  DeleteOutlined,
  NodeIndexOutlined,
  RetweetOutlined,
  RocketOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Divider, Flex, Space, Tag } from "antd";
import { FC, useContext, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";

import { DropdownNode } from "../../../../../components/dropdown/DropdownNode";
import ModalConfig from "../../modal/ModalConfig";
import { ReactFlowContext } from "../../../detail";
import TagComponent from "../../tag/Tag";
import { Text } from "../../../../../components/custom/Typography";

const ConditionNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;
  const { handleDeleteNode }: any = useContext(ReactFlowContext);
  const [isOpenConfig, setOpenConfig] = useState(false);

  const onSaveConfig = async () => {};
  const onCancelConfig = () => {
    setOpenConfig(false);
  };

  const itemsDropdown = [
    {
      key: "1",
      label: (
        <Flex
          gap={5}
          onClick={() => {
            setOpenConfig(true);
          }}
        >
          <SettingOutlined />
          <Text>Configure</Text>
        </Flex>
      ),
    },
    {
      key: "2",
      label: (
        <Flex gap={5} onClick={() => handleDeleteNode(props.id)}>
          <DeleteOutlined />
          <Text>Delete</Text>
        </Flex>
      ),
    },
  ];

  const filteredNodes = data.nodes
    .filter((i: any) => i.data.typeNode !== "add-new-node")
    .sort((a: any, b: any) => a?.data?.order - b?.data?.order);

  const checkCondition = () => {
    const typeNode = filteredNodes[0]?.data?.typeNode;

    switch (typeNode) {
      case "ConditionSetup":
        return (
          filteredNodes[0].data.expressionType &&
          filteredNodes[0].data.expression &&
          filteredNodes[0].data.condition &&
          filteredNodes[0].data.comparisonValue
        );
      default:
        return false;
    }
  };

  const hasActionData = () => {
    return (
      data.typeNode === "Action" &&
      data.displayName !== undefined &&
      data.actionType !== undefined &&
      data.fields.length > 0
    );
  };

  const hasLoopData = () => {
    return data.typeNode === "Loop" && !!data.inputList;
  };

  const getTag = (label: string) => {
    switch (label) {
      case "IF":
        return (
          <Tag color="gold" className="trigger-title">
            {label}
          </Tag>
        );
      case "Action":
        return (
          <Tag color="purple" className="trigger-title">
            {label}
          </Tag>
        );
      case "Loop":
        return (
          <Tag color="cyan" className="trigger-title">
            {label}
          </Tag>
        );
    }
  };

  const getIcon = (label: string) => {
    switch (label) {
      case "IF":
        return (
          <Tag color="volcano" bordered={false} className="tag__icon">
            <NodeIndexOutlined />
          </Tag>
        );
      case "Action":
        return (
          <Tag color="purple" bordered={false} className="tag__icon">
            <RocketOutlined />
          </Tag>
        );
      case "Loop":
        return (
          <Tag color="cyan" bordered={false} className="tag__icon">
            <RetweetOutlined />
          </Tag>
        );
    }
  };

  return (
    <>
      <ModalConfig
        isOpen={isOpenConfig}
        onCancel={onCancelConfig}
        currentNode={props}
      />
      <Handle type="target" position={Position.Top} />
      {data.isLoopAction && (
        <Handle
          type="target"
          position={Position.Top}
          className="node__loop-handle"
          id="loop"
        />
      )}
      {checkCondition() && getTag(props.data.label)}
      <div
        className={`node__container${
          checkCondition() || hasActionData() ? " condition-has-data" : ""
        }`}
      >
        {data.label === "ELSE" && (
          <Space className="node__space-container">
            <span className="node__label">{props.data.label}</span>
            <span className="node__text">do the following steps</span>
          </Space>
        )}
        {!(hasActionData() || hasLoopData() || checkCondition())
          ? data.label
          : getTag(props.data.label)}
        {hasLoopData() && (
          <Flex vertical className="node__space-container" gap={5}>
            <Space className="node__space-trigger">
              {getIcon(props.data.label)}
              <Space direction="vertical" style={{ gap: "0px" }}>
                <Text className="node-text">{data.displayName}</Text>
                <Text className="node-description">{data.inputList}</Text>
              </Space>
            </Space>
          </Flex>
        )}
        {checkCondition() && (
          <Flex vertical className="node__space-container" gap={5}>
            <Flex gap={5}>
              {getIcon(props.data.label)}
              <Text className="node-text">Display Name</Text>
            </Flex>
            <Divider />
            <Flex gap={5} vertical className="node__tag-container">
              {filteredNodes.map(
                (nd: any) => checkCondition() && <TagComponent data={nd.data} />
              )}
            </Flex>
          </Flex>
        )}
        {hasActionData() && (
          <Flex vertical className="node__space-container" gap={5}>
            <Flex gap={5}>
              {getIcon(props.data.label)}
              <Text className="node-text">{data.displayName}</Text>
            </Flex>
            <Divider />
            <Flex gap={5} vertical className="node__tag-container">
              <TagComponent data={data} />
            </Flex>
          </Flex>
        )}
        {data.label !== "ELSE" && <DropdownNode items={itemsDropdown} />}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default ConditionNode;
