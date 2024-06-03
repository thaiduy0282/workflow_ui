import "./style.css";

import { Collapse, Input } from "antd";

import DraggableItem from "../input/DragAndDropItem";
import { SearchProps } from "antd/es/input";
import { handleGetMetadata } from "./handleAPI";

const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

const CollapseCustom = ({ show }: any) => {
  const { isLoading, status, data, error }: any = handleGetMetadata();

  return (
    <Collapse
      items={[
        {
          key: "1",
          label: "Metadata",
          children: (
            <>
              <Search
                placeholder="input search text"
                onSearch={onSearch}
                style={{ width: "100%" }}
              />
              {data?.data?.fieldDefinitions.map((field: any) => (
                <DraggableItem
                  id={field.apiName}
                  content={field.label}
                  type={field.fieldDataType}
                />
              ))}
            </>
          ),
          showArrow: false,
        },
      ]}
      className={`collapse__expression${show ? " show" : ""}`}
      collapsible="icon"
      defaultActiveKey="1"
    />
  );
};

export default CollapseCustom;
