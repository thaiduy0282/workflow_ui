import "./style.css";

import React from "react";
import { Space } from "antd";

interface DraggableProps {
  id: string;
  content: string;
  type: string;
  data: any;
}

const DraggableItem: React.FC<DraggableProps> = ({
  id,
  content,
  type,
  data,
}) => {
  const handleDragStart = (e: any) => {
    e.dataTransfer.setData("text/plain", id);
  };
  return (
    <>
      <Space
        className="drag-drop__items"
        draggable
        onDragStart={handleDragStart}
      >
        <div
          id={id}
          className="drag-drop__item"
          data-type={type}
          data-field={JSON.stringify(data)}
        >
          {content}
        </div>
        <div className="drag-drop__item-type">({type})</div>
      </Space>
    </>
  );
};

export default DraggableItem;
