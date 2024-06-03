import "./style.css";

import { Col, Flex, Row, Space, Tag } from "antd";
import { Handle, NodeProps, Position } from "reactflow";

import { FC } from "react";

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid",
  borderRadius: "3px",
  width: "100%",
  minWidth: "320px",
  minHeight: "35px",
  fontSize: "12px",
  gap: 4,
};

const defaultLabelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid",
  borderRadius: "3px",
  width: "150px",
  height: "35px",
  fontSize: "12px",
  gap: 4,
};

const conditionTypeStyle: any = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  borderRight: "1px solid",
  minHeight: "35px",
};

const ConditionNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;

  const filteredNodes = data.nodes
    .filter((i: any) => i.data.typeNode !== "add-new-condition")
    .sort((a: any, b: any) => a?.data?.order - b?.data?.order);

  const checkCondition = () => {
    return (
      filteredNodes.length === 0 ||
      (filteredNodes.length < 2 &&
        !(
          filteredNodes[0].data.expression &&
          filteredNodes[0].data.condition &&
          filteredNodes[0].data.comparisionValue
        ))
    );
  };

  const checkConditionChild = (node: any) => {
    return (
      node.data.expressionType !== undefined &&
      node.data.expression !== undefined &&
      node.data.condition !== undefined &&
      node.data.comparisionValue !== undefined
    );
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        // style={{ visibility: "hidden" }}
      />
      <div style={checkCondition() ? defaultLabelStyle : labelStyle}>
        {checkCondition() ? (
          data.label
        ) : (
          <Row style={{ width: "100%", height: "100%" }}>
            <Col span={4} style={conditionTypeStyle}>
              {props.data.label}
            </Col>
            <Col
              span={20}
              style={{ padding: "10px", maxHeight: "170px", overflowY: "auto" }}
            >
              {filteredNodes.map(
                (nd: any) =>
                  checkConditionChild(nd) && (
                    <Flex
                      key={nd.id}
                      style={{ marginBottom: "4px" }}
                      gap="2px 2px"
                    >
                      {nd.data.order !== 1 ? (
                        <Tag bordered={false}>OR</Tag>
                      ) : (
                        <></>
                      )}
                      <Tag
                        bordered={false}
                        style={{ maxWidth: "100px" }}
                        className="truncate"
                      >
                        {nd.data.expression}
                      </Tag>
                      <Tag style={{ background: "white" }} bordered={false}>
                        {nd.data.condition}
                      </Tag>
                      <Tag
                        bordered={false}
                        style={{ maxWidth: "100px" }}
                        className="truncate"
                      >
                        {nd.data.comparisionValue}
                      </Tag>
                    </Flex>
                  )
              )}
            </Col>
          </Row>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        // style={{ visibility: "hidden" }}
      />
    </>
  );
};

export default ConditionNode;
