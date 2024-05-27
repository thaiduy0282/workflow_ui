import { FC } from "react";
import { NodeProps } from "reactflow";
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

const AddNewNode: FC<NodeProps> = () => {
  return (
    <>
      <div style={labelStyle}>
        <PlusOutlined style={{ fontSize: "32px" }} />
      </div>
    </>
  );
};

export default AddNewNode;
