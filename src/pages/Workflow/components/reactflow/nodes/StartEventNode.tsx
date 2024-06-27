import "./style.css";

import { FC, useContext, useEffect, useState } from "react";
import { Flex, Space, Tag } from "antd";
import { Handle, NodeProps, Position } from "reactflow";
import { PlayCircleOutlined, SettingOutlined } from "@ant-design/icons";

import { DropdownNode } from "../../../../../components/dropdown/DropdownNode";
import { ReactFlowContext } from "../../../detail";
import { Text } from "../../../../../components/custom/Typography";
import { images } from "../../../../../assets";

const StartEventNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;
  const { setOpenTrigger, setDisableAddAction }: any =
    useContext(ReactFlowContext);

  const itemsDropdown = [
    {
      key: "1",
      label: (
        <Flex gap={5} onClick={() => setOpenTrigger(true)}>
          <SettingOutlined />
          <Text>Configure</Text>
        </Flex>
      ),
    },
  ];

  const checkStartEventData = () => {
    return (
      data.typeNode === "StartEvent" &&
      data.category !== undefined &&
      data.provider !== undefined &&
      data.eventTopic !== undefined
    );
  };

  useEffect(() => {
    setDisableAddAction(!checkStartEventData());
  }, [data]);

  return (
    <>
      {checkStartEventData() && (
        <Flex className="trigger-title" gap={5}>
          <PlayCircleOutlined size={16} />
          <Tag>Starting Point</Tag>
        </Flex>
      )}
      <div
        className={`node__container${
          checkStartEventData() ? " trigger-has-data" : ""
        }`}
      >
        {!checkStartEventData() ? (
          <Text className="node-text">{props.data.label}</Text>
        ) : (
          <Space className="node__space-trigger">
            <img src={images.QWORKS} className="image-app" />
            <Space direction="vertical" style={{ gap: "0px" }}>
              <Text className="node-text">{data.category}</Text>
              <Text className="node-description">{data.eventTopic}</Text>
            </Space>
          </Space>
        )}
        <DropdownNode items={itemsDropdown} />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default StartEventNode;
