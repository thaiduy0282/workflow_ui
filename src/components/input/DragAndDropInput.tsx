import "./style.css";

import React, { useEffect, useRef, useState } from "react";

import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useReactFlow } from "reactflow";

const DroppableInput = ({
  expressionType,
  expression,
  setExpression,
  referenceObjects,
  setReferenceObjects,
  onShow,
}: any) => {
  const inputRef = useRef<any>(null);

  const { fitView } = useReactFlow();

  useEffect(() => {
    setTimeout(() => fitView({ duration: 1200, padding: 0.1 }), 100);
  }, [expressionType]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (expressionType !== "") {
      const id = e.dataTransfer.getData("text/plain");
      const content = document.getElementById(id)?.textContent || "";
      const dataType =
        document.getElementById(id)?.getAttribute("data-type") || "";
      const dataField =
        document.getElementById(id)?.getAttribute("data-field") || "";
      setValueField(content, dataType, dataField);
    }
  };

  const setValueField = (
    content: string,
    dataType: string,
    dataField: string
  ) => {
    const jsonDataField = JSON.parse(dataField);
    if (dataType === "varchar" && expressionType === "string") {
      setExpression(content);
      setReferenceObjects([jsonDataField]);
    } else if (dataType !== "varchar" && expressionType !== "string") {
      if (expression === "") {
        setExpression(content);
        setReferenceObjects([jsonDataField]);
      } else {
        // Thêm expression sau toán tử
        const operator = expression.trim().slice(-1);
        if (validateCalculationChar(operator)) {
          setExpression(expression + `${content}`);
          setReferenceObjects([...referenceObjects, jsonDataField]);
        }
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const validateCalculationChar = (char: string) => {
    const allowedChars = "+-*/";

    return allowedChars.includes(char);
  };

  const handleInputKeyDown = (event: any) => {
    const char = event.key;

    const operator = expression.trim().slice(-1);
    if (char === "Backspace") {
      if (validateCalculationChar(operator))
        // xóa toán tử
        setExpression(expression.slice(0, -3));
      else {
        const hasOperator = /[+\-*\/]/.test(expression);

        if (!hasOperator) {
          // xóa value đầu tiên
          setExpression("");
          setReferenceObjects([]);
        } else {
          // xóa value sau toán tử cuối cùng
          const operators = expression.match(/[+\-*\/]/g);
          if (operators && operators.length > 0) {
            const lastOperator = operators[operators.length - 1];
            const operatorIndex = expression.lastIndexOf(lastOperator);

            if (operatorIndex !== -1) {
              const result = expression.slice(0, operatorIndex + 2);
              const newReferenceObjects = referenceObjects;
              newReferenceObjects.pop();
              setExpression(result);
              setReferenceObjects(newReferenceObjects);
            }
          }
        }
      }
    } else if (!validateCalculationChar(operator)) {
      // thêm toán tử vào chuỗi
      if (expression !== "" && validateCalculationChar(char)) {
        setExpression(expression + ` ${char} `);
      }
    }
  };

  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="drag-drop__input"
      >
        {expressionType === "string" || expressionType === "" ? (
          <Input
            type="text"
            value={expression}
            onClick={onShow}
            placeholder="Expression"
            disabled
          />
        ) : (
          <TextArea
            autoSize
            ref={inputRef}
            value={expression}
            onClick={onShow}
            placeholder="Expression"
            disabled={expressionType === "string"}
            onKeyDown={handleInputKeyDown}
          />
        )}
      </div>
    </>
  );
};

export default DroppableInput;
