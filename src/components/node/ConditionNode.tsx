import "./style.css";

import { Col, Flex, Row, Space, Tag } from "antd";
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
            filteredNodes[0].data.comparisionValue
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
        node.data.comparisionValue !== undefined &&
        node.data.comparisionValue !== ""
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
        {checkCondition() ? (
          data.label
        ) : (
          <Row
            justify="space-around"
            align="middle"
            style={{ width: "100%", height: "100%" }}
          >
            <Col
              span={props.data.label.length > 4 ? 6 : 4}
              className="node__condition-label"
            >
              <span className="node__label">{props.data.label}</span>
            </Col>
            <Col
              span={props.data.label.length > 4 ? 18 : 20}
              className="node__condition-container"
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {filteredNodes.map(
                  (nd: any) =>
                    checkConditionChild(nd) && (
                      <Flex key={nd.id} gap="2px 2px">
                        {nd.data.order !== 1 ? (
                          <Tag color="default">
                            {nd.data.typeNode === "ConditionSetup"
                              ? "OR"
                              : "AND"}
                          </Tag>
                        ) : (
                          <></>
                        )}
                        {nd.data.typeNode === "ConditionSetup" ? (
                          <>
                            <Tag color="default" className="truncate">
                              {nd.data.expression}
                            </Tag>
                            <Tag color="default" bordered={false}>
                              {nd.data.condition}
                            </Tag>
                            <Tag color="default" className="truncate">
                              {nd.data.comparisionValue}
                            </Tag>
                          </>
                        ) : (
                          <>
                            <Tag color="default" className="truncate">
                              {nd.data.action}
                            </Tag>
                            <Tag
                              style={{ background: "white" }}
                              color="default"
                            >
                              {nd.data.field}
                            </Tag>
                            <Tag color="default" className="truncate">
                              {nd.data.value}
                            </Tag>
                          </>
                        )}
                      </Flex>
                    )
                )}
              </Space>
            </Col>
          </Row>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default ConditionNode;
