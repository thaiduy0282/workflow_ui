import "./style.css";

import { Col, Input, Row, Select, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

import DroppableInput from "../../input/DragAndDropInput";

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
  const { data } = props;
  const { getNodes, setNodes } = useReactFlow();

  const [expressionType, setExpressionType] = useState("");
  const [expression, setExpression] = useState("");
  const [condition, setCondition] = useState("");
  const [comparisionValue, setComparisionValue] = useState("");

  // useEffect(() => {
  //   if (
  //     data.expressionType !== "" ||
  //     data.expression !== "" ||
  //     data.condition !== "" ||
  //     data.comparisionValue !== ""
  //   ) {
  //     setExpressionType(data.expressionType);
  //     setExpression(data.expression);
  //     setCondition(data.condition);
  //     setComparisionValue(data.comparisionValue);
  //   } else {
  //     setExpressionType("");
  //     setExpression("");
  //     setCondition("");
  //     setComparisionValue("");
  //   }
  // }, [props]);

  useEffect(() => {
    setNodes(editNode);
  }, [expressionType, expression, condition, comparisionValue]);

  const editNode = () => {
    return getNodes().map((nd: any) => {
      if (nd.id === props.id) {
        nd.data = {
          ...nd.data,
          expression,
          expressionType,
          condition,
          comparisionValue,
        };
      }
      return nd;
    });
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ left: 20, visibility: "hidden" }}
      />
      <div style={labelStyle}>
        <Row style={{ width: "100%", height: "100%" }}>
          <Col span={4} style={conditionTypeStyle}>
            IF
          </Col>
          <Col
            span={20}
            style={{ padding: "10px", maxHeight: "170px", overflowY: "auto" }}
          >
            <Space className="space__condition" direction="vertical">
              <Select
                defaultValue="Expression Type"
                style={{ width: "100%" }}
                onChange={(value) => setExpressionType(value)}
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
              <DroppableInput
                expressionType={expressionType}
                expression={expression}
                setExpression={setExpression}
              />
              <Select
                defaultValue="Operator"
                style={{ width: "100%" }}
                onChange={setCondition}
                options={[
                  {
                    value: "Equals",
                    label: "Equals",
                  },
                  { value: "Not Equals", label: "Not Equals" },
                ]}
              />
              <Input
                placeholder="Expected Value"
                onChange={(e) => setComparisionValue(e.target.value)}
              />
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
