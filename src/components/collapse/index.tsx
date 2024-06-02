import "./style.css";

import { Collapse, Input } from "antd";

import Draggable from "../input/DragAndDropItem";
import DroppableInput from "../input/DragAndDropInput";
import { MetadataList } from "../../constant/Metadata";
import { SearchProps } from "antd/es/input";
import { handleGetMetadata } from "./handleAPI";
import { useState } from "react";

const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

const CollapseCustom = ({ show }: any) => {
  const [metadate, setMetadata] = useState();

  const { isLoading, status, data, error } = handleGetMetadata();

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
              {MetadataList.map((data, index) => (
                <Draggable
                  id={`draggable-${index + 1}`}
                  content={data.content}
                  type={data.type}
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
