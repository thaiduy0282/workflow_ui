import "./style.css";

import React, { useState } from "react";

import { Input } from "antd";

type PartialDroppableInputProps = Partial<{
  onShow: () => void;
}>;

const DroppableInput: React.FC<PartialDroppableInputProps> = ({
  onShow,
}: any) => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const content = document.getElementById(id)?.textContent || "";
    setInputValue(content);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="drag-drop__input"
      >
        <Input
          type="text"
          placeholder="Expression"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onClick={onShow}
        />
      </div>
    </>
  );
};

export default DroppableInput;
