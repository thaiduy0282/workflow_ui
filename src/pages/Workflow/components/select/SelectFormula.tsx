import "./style.css";

import { Select, Tag } from "antd";
import { useEffect, useState } from "react";

import { handleGetMetadata } from "../../../../components/metadata/handleAPI";
import { v4 as uuid } from "uuid";

type Props = {
  formula: any;
  setFormula: (value: any) => void;
  step: any;
  setStep: (value: any) => void;
};

const SelectFormula: React.FC<Props> = (props) => {
  const { formula, setFormula, step, setStep } = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const { data }: any = handleGetMetadata();

  const getNextStep = (stepGroup: any) => {
    switch (stepGroup) {
      case "metadata":
        return "operator";
      case "operator":
        return "value";
      case "value":
        return "next";
      case "next":
        return "metadata";
      default:
        return "metadata";
    }
  };

  const getPrevStep = (stepGroup: any) => {
    switch (stepGroup) {
      case "metadata":
        if (formula.length > 1) return "next";
        break;
      case "operator":
        return "metadata";
      case "value":
        return "operator";
      case "next":
        return "value";
      default:
        return "metadata";
    }
  };

  const onChange = (value: any) => {
    setFormula(value);
  };

  const onSelect = () => {
    // getNextStep();
  };

  const validateCalculationChar = (char: string) => {
    const allowedChars = "+-*/";

    return allowedChars.includes(char);
  };

  const onDeselect = (deletedValue: any) => {
    // if (
    //   deletedValue.key !== "(" &&
    //   deletedValue.key !== ")" &&
    //   !validateCalculationChar(deletedValue.key)
    // )
    //   getPrevStep();
  };

  const onSearch = (value: string) => {
    setValue(value);
  };

  const handleBlur = () => {
    setOpen(false);
  };

  const handleFocus = () => {
    setOpen(true);
  };

  const getStepGroup = () => {
    let stepGroup = "value";
    if (value !== "(" && value !== ")" && !validateCalculationChar(value)) {
      if (formula.length > 0) {
        if (formula[formula.length - 1].value) {
          stepGroup = getNextStep(
            formula[formula.length - 1].value.split("#")[0]
          );
        } else {
          if (formula[formula.length - 1] == "(") {
            stepGroup = "metadata";
          } else if (
            formula[formula.length - 1] == ")" ||
            !validateCalculationChar(formula[formula.length - 1])
          ) {
            stepGroup = "next";
          }
        }
      } else {
        stepGroup = "metadata";
      }
    }
    return stepGroup;
  };

  const getOptions: any = () => {
    const stepGroup = getStepGroup();
    console.log("stepGroup", stepGroup);
    // if (value === "(" || value === ")" || validateCalculationChar(value)) {
    //   return [];
    // } else {
    switch (stepGroup) {
      case "metadata":
        return [
          {
            label: <span>Metadata</span>,
            title: "metadata",
            options: data?.data?.fieldDefinitions.map((field: any) => {
              return {
                value: "metadata#" + JSON.stringify(field) + "#" + uuid(),
                label: field.label,
                displayName: field.label,
              };
            }),
          },
        ];
      case "operator":
        return [
          {
            label: <span>Operator</span>,
            title: "operator",
            options: [
              {
                value: "operator#" + "equal" + "#" + uuid(),
                label: "is equal to (==)",
                displayName: "==",
              },
              {
                value: "operator#" + "notEqual" + "#" + uuid(),
                label: "is not equal to (!=)",
                displayName: "!=",
              },
              {
                value: "operator#" + "isGreaterOrEqual" + "#" + uuid(),
                label: "is greater than or equal to (>=)",
                displayName: ">=",
              },
              {
                value: "operator#" + "isLessOrEqual" + "#" + uuid(),
                label: "is less than or equal to (<=)",
                displayName: "<=",
              },
            ],
          },
        ];
      case "next":
        return [
          {
            value: "next#" + "or" + "#" + uuid(),
            label: "OR",
            displayName: "OR",
          },
          {
            value: "next#" + "and" + "#" + uuid(),
            label: "AND",
            displayName: "AND",
          },
        ];
      default:
        return [];
    }
    // }
  };

  return (
    <Select
      optionLabelProp="displayName"
      open={getStepGroup() == "value" ? true : open}
      onBlur={handleBlur}
      onFocus={handleFocus}
      labelInValue
      showSearch
      allowClear
      removeIcon
      searchValue={value}
      suffixIcon={<></>}
      notFoundContent={getStepGroup() === "value" && <></>}
      value={formula}
      mode="multiple"
      placeholder="Write Condition"
      onClick={() => setOpen(!open)}
      onChange={onChange}
      onSearch={onSearch}
      onSelect={onSelect}
      onDeselect={onDeselect}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          if (validateCalculationChar(value)) {
            setFormula((prevValue: any) => {
              if (validateCalculationChar(prevValue[formula.length - 1])) {
                return prevValue;
              }
              return [...prevValue, value];
            });
          } else if (value === "(" || value === ")") {
            setFormula((prevValue: any) => [...prevValue, value]);
          } else {
            if (getStepGroup() === "value") {
              setFormula((prevValue: any) => [...prevValue, value]);
              // getNextStep();
            }
          }
          setValue("");
        }
      }}
      tagRender={(props) => (
        <Tag
          className={
            props?.value === "(" || props?.value === ")"
              ? "bracket"
              : ["metadata", "operator", "next"].includes(
                  props?.value?.split("#")[0]
                )
              ? props?.value?.split("#")[0]
              : "value"
          }
        >
          {props.label}
        </Tag>
      )}
      options={getOptions()}
    />
  );
};

export default SelectFormula;
