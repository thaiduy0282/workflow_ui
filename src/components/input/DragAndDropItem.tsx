import "./style.css";

import React from "react";
import { Space } from "antd";

interface DraggableProps {
  id: string;
  content: string;
  type: string;
}

const Draggable: React.FC<DraggableProps> = ({ id, content, type }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", id);
  };

  return (
    <>
      <Space
        className="drag-drop__items"
        draggable
        onDragStart={handleDragStart}
      >
        <div id={id} className="drag-drop__item">
          {content}
        </div>
        <div className="drag-drop__item-type">({type})</div>
      </Space>
    </>
  );
};

export default Draggable;
