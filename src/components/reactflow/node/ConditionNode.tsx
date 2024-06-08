import "./style.css";

import { Divider, Input, Select, Space, Typography } from "antd";
import { FC, useEffect, useState } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

import DroppableInput from "../../input/DragAndDropInput";

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
      <Space direction="vertical" className="space__setup-container">
        <Typography.Title
          level={5}
          style={{ margin: 0, textAlign: "center", lineHeight: 1 }}
        >
          IF
        </Typography.Title>
        <Divider style={{ margin: 0 }} />
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
      </Space>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default ConditionNode;
