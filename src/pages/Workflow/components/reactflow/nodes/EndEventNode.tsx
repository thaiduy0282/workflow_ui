import "./style.css";

import { FC, useContext, useEffect, useState } from "react";
import { Flex, Space, Tag } from "antd";
import { Handle, NodeProps, Position } from "reactflow";
import { SettingOutlined, StopOutlined } from "@ant-design/icons";

import { DropdownNode } from "../../../../../components/dropdown/DropdownNode";
import { ReactFlowContext } from "../../../detail";
import { Text } from "../../../../../components/custom/Typography";

const EndEventNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;
  const { setOpenTrigger, setDisableAddAction }: any =
    useContext(ReactFlowContext);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Flex className="trigger-title" gap={5}>
        <StopOutlined size={16} />
        <Tag>End</Tag>
      </Flex>
      <div className="node__container trigger-has-data">
        <Space className="node__space-trigger">
          <Tag color="red" bordered={false} className="tag__icon">
            <StopOutlined />
          </Tag>
          <Space direction="vertical" style={{ gap: "0px" }}>
            <Text className="node-text">End</Text>
            <Text className="node-description">ACCOUNT_EVENT</Text>
          </Space>
        </Space>
      </div>
    </>
  );
};

export default EndEventNode;
