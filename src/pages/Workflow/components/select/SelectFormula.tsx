import "./style.css";

import { Select, Tag } from "antd";

import { handleGetMetadata } from "../../../../components/metadata/handleAPI";
import { useState } from "react";
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

  const getNextStep = () => {
    switch (step) {
      case "metadata":
        setStep("operator");
        break;
      case "operator":
        setStep("value");
        break;
      case "value":
        setStep("next");
        setFormula((prevValue: any) => [...prevValue, ")"]);

        break;
      case "next":
        setStep("metadata");
        setFormula((prevValue: any) => [...prevValue, "("]);
        break;
      default:
        setStep("metadata");
    }
  };

  const getPrevStep = () => {
    switch (step) {
      case "metadata":
        if (formula.length > 1) setStep("next");
        break;
      case "operator":
        setStep("metadata");
        break;
      case "value":
        setStep("operator");
        break;
      case "next":
        setStep("value");
        break;
      default:
        setStep("metadata");
    }
  };

  const onChange = (value: any) => {
    setFormula(value);
  };

  const onSelect = () => {
    getNextStep();
  };

  const onDeselect = (deletedValue: any) => {
    if (deletedValue.key === "(" || deletedValue.key === ")") {
      setFormula((prevValue: any) => {
        const updatedFormula = prevValue.slice(0, -1);
        return updatedFormula;
      });
    }
    if (formula.length == 1) {
      console.log("formula", formula);

      setFormula(["("]);
    }
    getPrevStep();
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

  return (
    <Select
      open={step == "value" ? true : open}
      onBlur={handleBlur}
      onFocus={handleFocus}
      labelInValue
      showSearch
      allowClear
      removeIcon
      searchValue={value}
      suffixIcon={<></>}
      notFoundContent={step === "value" && <></>}
      value={formula}
      mode="multiple"
      placeholder="Select a person"
      onClick={() => setOpen(!open)}
      onChange={onChange}
      onSearch={onSearch}
      onSelect={onSelect}
      onDeselect={onDeselect}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          if (step === "value") {
            setFormula((prevValue: any) => [...prevValue, value]);
            getNextStep();
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
      options={
        step === "metadata"
          ? [
              {
                label: <span>Metadata</span>,
                title: "metadata",
                options: data?.data?.fieldDefinitions.map((field: any) => {
                  return {
                    value: "metadata#" + JSON.stringify(field) + "#" + uuid(),
                    label: field.label,
                  };
                }),
              },
            ]
          : step === "operator"
          ? [
              {
                label: <span>Operator</span>,
                title: "operator",
                options: [
                  {
                    value: "operator#" + "equals" + "#" + uuid(),
                    label: "Equals",
                  },
                  {
                    value: "operator#" + "notEquals" + "#" + uuid(),
                    label: "Not Equals",
                  },
                ],
              },
            ]
          : step === "next"
          ? [
              {
                value: "next#" + "or" + "#" + uuid(),
                label: "OR",
              },
              { value: "next#" + "and" + "#" + uuid(), label: "AND" },
            ]
          : []
      }
    />
  );
};

export default SelectFormula;
