import "./style.css";

import { Col, Input, Row, Select, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

import { handleGetMetadata } from "../../collapse/handleAPI";

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

const ActionNode: FC<NodeProps> = ({ ...props }: any) => {
  const actionData = props.data;
  const { getNodes, setNodes } = useReactFlow();
  const { isLoading, status, data, error }: any = handleGetMetadata();

  const [action, setAction] = useState(actionData?.action || undefined);
  const [field, setField] = useState(actionData?.field || undefined);
  const [value, setValue] = useState(actionData?.value || undefined);

  useEffect(() => {
    setNodes(editNode);
  }, [action, field, value]);

  const editNode = () => {
    return getNodes().map((nd: any) => {
      if (nd.id === props.id) {
        nd.data = {
          ...nd.data,
          action,
          field,
          value,
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
          <Col span={6} style={conditionTypeStyle}>
            ACTION
          </Col>
          <Col
            span={18}
            style={{ padding: "10px", maxHeight: "350px", overflowY: "auto" }}
          >
            <Space className="space__condition" direction="vertical">
              <Select
                placeholder="Action"
                style={{ width: "100%" }}
                value={action}
                onChange={(value) => setAction(value)}
                options={[
                  {
                    value: "Update account",
                    label: "Update account",
                  },
                ]}
              />
              <Select
                value={field}
                placeholder="Field"
                style={{ width: "100%" }}
                onChange={setField}
                options={data?.data?.fieldDefinitions.map((field: any) => {
                  return {
                    value: field.label,
                    label: field.label,
                  };
                })}
              />
              <Input
                value={value}
                onDrop={(e) => e.preventDefault()}
                placeholder="Value"
                onChange={(e) => setValue(e.target.value)}
              />
            </Space>
          </Col>
        </Row>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ left: 35 }} />
    </>
  );
};

export default ActionNode;
