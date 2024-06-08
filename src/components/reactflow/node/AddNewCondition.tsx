import { Handle, NodeProps, Position } from "reactflow";

import { FC } from "react";
import { PlusOutlined } from "@ant-design/icons";

const AddNewCondition: FC<NodeProps> = () => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="handle__top-addNewCondition"
      />
      <PlusOutlined style={{ fontSize: "32px" }} />
    </>
  );
};

export default AddNewCondition;
