import "./style.css";

import { Drawer, Select, Space } from "antd";
import { useEffect, useState } from "react";

import CollapseCustom from "../collapse";
import DroppableInput from "../input/DragAndDropInput";
import ReactFlowIfCondition from "../reactflow/ifCondition";

const DrawerLayout = ({
  open,
  close,
  currentNode,
  workflowNodes,
  setWorkflowNodes,
}: any) => {
  const [isOpenDrawer, setOpenDrawer] = useState(false);
  const [isShowMetadata, setShowMetadata] = useState(false);

  useEffect(() => {
    if (open && currentNode?.data?.label === "IF") {
      setTimeout(() => setShowMetadata(true), 500);
    }
    if (!open && isShowMetadata) {
      setShowMetadata(false);
      setTimeout(() => setOpenDrawer(open), 300);
    } else setOpenDrawer(open);
  }, [open]);

  return (
    <>
      <Drawer
        title={
          <div style={{ textAlign: "center" }}>
            {currentNode?.data?.label} Setup
          </div>
        }
        placement="right"
        width={500}
        open={isOpenDrawer}
        onClose={close}
        closeIcon={false}
      >
        {currentNode?.data?.typeNode === "trigger" ? (
          <Space direction="vertical" style={{ width: "100%", gap: "10px" }}>
            <Select
              placeholder="Category"
              style={{ width: "100%", height: "40px" }}
              // onChange={handleChange}
              options={[
                { value: "qworks", label: "Qworks" },
                { value: "safeforce", label: "Safeforce" },
                { value: "jira", label: "Jira" },
              ]}
            />
            <Select
              placeholder="Event"
              style={{ width: "100%", height: "40px" }}
              // onChange={handleChange}
              options={[
                { value: "new-or-update-account", label: "New/update account" },
                { value: "new-ticket", label: "New ticket" },
              ]}
            />
          </Space>
        ) : (
          <>
            {/* <DroppableInput onShow={onShowMetadata} />
             */}
            <CollapseCustom show={isShowMetadata} />
            <ReactFlowIfCondition
              workflowNodes={workflowNodes}
              setWorkflowNodes={setWorkflowNodes}
              currentNode={currentNode}
              isOpenDrawer={isOpenDrawer}
            />
          </>
        )}
      </Drawer>
    </>
  );
};

export default DrawerLayout;
