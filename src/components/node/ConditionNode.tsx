import "./style.css";

import { Col, Flex, Row, Space, Tag, Tooltip } from "antd";
import { Handle, NodeProps, Position } from "reactflow";

import { FC } from "react";

const ConditionNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;

  const filteredNodes = data.nodes
    .filter((i: any) => i.data.typeNode !== "add-new-condition")
    .sort((a: any, b: any) => a?.data?.order - b?.data?.order);

  const checkCondition = () => {
    const isConditionSetup =
      filteredNodes[0]?.data?.typeNode === "ConditionSetup";
    const hasValidCondition =
      filteredNodes.length === 0 ||
      (filteredNodes.length < 2 &&
        !(isConditionSetup
          ? filteredNodes[0].data.expression &&
            filteredNodes[0].data.condition &&
            filteredNodes[0].data.comparisonValue
          : filteredNodes[0].data.action &&
            filteredNodes[0].data.field &&
            filteredNodes[0].data.value));
    return hasValidCondition;
  };

  const checkConditionChild = (node: any) => {
    const isConditionSetup =
      filteredNodes[0]?.data?.typeNode === "ConditionSetup";
    const hasValidChildCondition = isConditionSetup
      ? node.data.expressionType !== undefined &&
        node.data.expression !== undefined &&
        node.data.expression !== "" &&
        node.data.condition !== undefined &&
        node.data.comparisonValue !== undefined &&
        node.data.comparisonValue !== ""
      : node.data.action !== undefined &&
        node.data.field !== undefined &&
        node.data.value !== undefined &&
        node.data.value !== "";
    return hasValidChildCondition;
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className={`node__container${
          !checkCondition() ? " condition-has-data" : ""
        }`}
      >
        {data.label === "ELSE" ? (
          <Space className="node__space-container">
            <span className="node__label">{props.data.label}</span>
            <span className="node__text">do the following steps</span>
          </Space>
        ) : checkCondition() ? (
          data.label
        ) : (
          <Space className="node__space-container">
            <span className="node__label">{props.data.label}</span>
            <Space direction="vertical" style={{ width: "100%", gap: 4 }}>
              {filteredNodes.map(
                (nd: any) =>
                  checkConditionChild(nd) && (
                    <Flex key={nd.id} gap="2px 2px">
                      {nd.data.order !== 1 ? (
                        <Tag color="default">
                          {nd.data.typeNode === "ConditionSetup" ? "OR" : "AND"}
                        </Tag>
                      ) : (
                        <></>
                      )}
                      {nd.data.typeNode === "ConditionSetup" ? (
                        <>
                          <Tooltip title={nd.data.expression}>
                            <Tag color="default" className="truncate">
                              {nd.data.expression}
                            </Tag>
                          </Tooltip>
                          <Tag color="default" bordered={false}>
                            {nd.data.condition}
                          </Tag>
                          <Tooltip title={nd.data.comparisonValue}>
                            <Tag color="default" className="truncate">
                              {nd.data.comparisonValue}
                            </Tag>
                          </Tooltip>
                        </>
                      ) : (
                        <>
                          <Tooltip title={nd.data.action}>
                            <Tag color="default" className="truncate">
                              {nd.data.action}
                            </Tag>
                          </Tooltip>
                          <Tooltip title={nd.data.field}>
                            <Tag
                              style={{ background: "white" }}
                              color="default"
                            >
                              {nd.data.field}
                            </Tag>
                          </Tooltip>
                          <Tooltip title={nd.data.value}>
                            <Tag color="default" className="truncate">
                              {nd.data.value}
                            </Tag>
                          </Tooltip>
                        </>
                      )}
                    </Flex>
                  )
              )}
            </Space>
          </Space>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default ConditionNode;
