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
  minWidth: "300px",
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

const StartEventNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;

  const checkStartEventData = () => {
    return (
      data.category !== undefined &&
      data.provider !== undefined &&
      data.eventTopic !== undefined
    );
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={!checkStartEventData() ? defaultLabelStyle : labelStyle}>
        {!checkStartEventData() ? (
          props.data.label
        ) : (
          <Row style={{ width: "100%", height: "100%" }}>
            <Col span={4} style={conditionTypeStyle}>
              {props.data.label}
            </Col>
            <Col
              span={20}
              style={{ padding: "10px", maxHeight: "170px", overflowY: "auto" }}
            >
              {data.eventTopic + " in " + data.category}
            </Col>
          </Row>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default StartEventNode;
