import { FC } from "react";
import { NodeProps } from "reactflow";

const labelStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "2px dashed",
  borderRadius: "10px",
  width: 50,
  height: 50,
};

const iconStyle = {
  fontSize: 50,
};

const AddNewNode: FC<NodeProps> = () => {
  return (
    <>
      <div style={labelStyle}>
        <span style={iconStyle}>+</span>
      </div>
    </>
  );
};

export default AddNewNode;
