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

const ConditionNode: FC<NodeProps> = ({ ...props }: any) => {
  const { data } = props;
  const { getNodes, setNodes } = useReactFlow();

  const [expressionType, setExpressionType] = useState(
    data?.expressionType || undefined
  );
  const [expression, setExpression] = useState(data?.expression || undefined);
  const [referenceObjects, setReferenceObjects] = useState(
    data?.referenceObjects || []
  );
  const [condition, setCondition] = useState(data?.condition || undefined);
  const [comparisonValue, setcomparisonValue] = useState(
    data?.comparisonValue || undefined
  );

  useEffect(() => {
    setNodes(editNode);
  }, [
    expressionType,
    expression,
    condition,
    comparisonValue,
    referenceObjects,
  ]);

  const editNode = () => {
    return getNodes().map((nd: any) => {
      if (nd.id === props.id) {
        nd.data = {
          ...nd.data,
          expression,
          expressionType,
          condition,
          comparisonValue,
          referenceObjects,
        };
      }
      return nd;
    });
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={labelStyle}>
        <Row style={{ width: "100%", height: "100%" }}>
          <Col span={4} style={conditionTypeStyle}>
            IF
          </Col>
          <Col
            span={20}
            style={{ padding: "10px", maxHeight: "350px", overflowY: "auto" }}
          >
            <Space className="space__condition" direction="vertical">
              <Select
                placeholder="Expression Type"
                style={{ width: "100%" }}
                value={expressionType}
                onChange={(value) => {
                  setExpression("");
                  setExpressionType(value);
                }}
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
                referenceObjects={referenceObjects}
                setReferenceObjects={setReferenceObjects}
              />
              <Select
                value={condition}
                placeholder="Operator"
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
                value={comparisonValue}
                onDrop={(e) => e.preventDefault()}
                placeholder="Expected Value"
                onChange={(e) => setcomparisonValue(e.target.value)}
              />
            </Space>
          </Col>
        </Row>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default ConditionNode;
