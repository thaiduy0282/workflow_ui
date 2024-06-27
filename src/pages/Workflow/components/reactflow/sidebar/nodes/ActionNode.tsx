import "./style.css";

import { Divider, Input, Select, Space } from "antd";
import { FC, useEffect, useState } from "react";
import { Handle, NodeProps, Position, useReactFlow } from "reactflow";

import { Title } from "../../../../../../components/custom/Typography";
import { handleGetMetadata } from "../../../../../../components/metadata/handleAPI";

const ActionNode: FC<NodeProps> = ({ ...props }: any) => {
  const actionData = props.data;
  const { getNodes, setNodes } = useReactFlow();
  const { isLoading, status, data, error }: any = handleGetMetadata();

  const [action, setAction] = useState(actionData?.action || undefined);
  const [field, setField] = useState(actionData?.field || undefined);
  const [value, setValue] = useState(actionData?.value || undefined);
  const [referenceObjects, setReferenceObjects] = useState(
    actionData?.referenceObjects || []
  );

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
        <Title
          level={5}
          style={{ margin: 0, textAlign: "center", lineHeight: 1 }}
        >
          ACTION
        </Title>
        <Divider style={{ margin: 0 }} />
        <Space className="space__condition" direction="vertical">
          <Select
            placeholder="Action"
            style={{ width: "100%" }}
            value={action}
            onChange={(value) => setAction(value)}
            options={[
              {
                value: "Update data",
                label: "Update data",
              },
            ]}
          />
          <Select
            value={referenceObjects[0]?.label}
            placeholder="Field"
            style={{ width: "100%" }}
            onChange={(value) => {
              const jsonValue = JSON.parse(value);
              setField(jsonValue.apiName);
              setReferenceObjects([jsonValue]);
            }}
            options={data?.data?.fieldDefinitions.map((field: any) => {
              return {
                value: JSON.stringify(field),
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
      </Space>
      <Handle type="source" position={Position.Bottom} style={{ left: 35 }} />
    </>
  );
};

export default ActionNode;
