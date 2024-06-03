import { Handle, NodeProps, Position } from "reactflow";

import { FC } from "react";
import { PlusOutlined } from "@ant-design/icons";

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px dashed",
  borderRadius: "10px",
  width: 50,
  height: 50,
};

const AddNewCondition: FC<NodeProps> = () => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={labelStyle}>
        <PlusOutlined style={{ fontSize: "32px" }} />
      </div>
    </>
  );
};

export default AddNewCondition;
