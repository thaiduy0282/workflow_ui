import "./style.css";

import { Col, Input, Row, Select, Space } from "antd";
import { Handle, NodeProps, Position } from "reactflow";

import DroppableInput from "../../input/DragAndDropInput";
import { FC } from "react";

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px solid",
  borderRadius: "10px",
  width: "100%",
  gap: 4,
};

const conditionTypeStyle: any = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  borderRight: "2px solid",
};

const IfConditionNode: FC<NodeProps> = ({ ...props }: any) => {
  return (
    <>
      <div style={labelStyle}>
        <Row style={{ width: "100%", height: "100%" }}>
          <Col span={4} style={conditionTypeStyle}>
            IF
          </Col>
          <Col span={20} style={{ padding: "10px" }}>
            <Space className="space__condition" direction="vertical">
              <Select
                defaultValue="Expression Type"
                style={{ width: "100%" }}
                onChange={() => console.log("aaa")}
                options={[
                  {
                    value: "string",
                    label: "String",
                  },
                  {
                    value: "mathematics",
                    label: "Mathematics",
                  },
                ]}
              />
              <DroppableInput />
              <Select
                defaultValue="Operator"
                style={{ width: "100%" }}
                // onChange={handleChange}
                options={[
                  {
                    value: "equals",
                    label: "Equals",
                  },
                  { value: "not-equals", label: "Not Equals" },
                ]}
              />
              <Input placeholder="Expected Value" />
            </Space>
          </Col>
        </Row>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ left: 20, visibility: "hidden" }}
      />
    </>
  );
};

export default IfConditionNode;
