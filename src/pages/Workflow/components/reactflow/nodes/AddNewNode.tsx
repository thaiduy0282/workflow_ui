import { FC } from "react";
import { NodeProps } from "reactflow";
import { PlusOutlined } from "@ant-design/icons";

const AddNewNode: FC<NodeProps> = () => {
  return (
    <>
      <PlusOutlined className="node__start-icon" />
    </>
  );
};

export default AddNewNode;
