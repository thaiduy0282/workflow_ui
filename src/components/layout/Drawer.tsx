import "./style.css";

import { Drawer, Select, Space } from "antd";
import { useEffect, useState } from "react";

import ActionChildWorkflow from "../reactflow/ActionChildWorkflow";
import CollapseCustom from "../collapse";
import ReactFlowIfCondition from "../reactflow/Condition";
import { useReactFlow } from "reactflow";

const DrawerLayout = ({
  open,
  close,
  currentNode,
  workflowNodes,
  setWorkflowNodes,
}: any) => {
  const [isOpenDrawer, setOpenDrawer] = useState(false);
  const [isShowMetadata, setShowMetadata] = useState(false);
  const { getNode, getNodes, setNodes } = useReactFlow();

  const [category, setCategory] = useState(
    currentNode?.data?.category || undefined
  );
  const [eventTopic, setEventTopic] = useState(
    currentNode?.data?.eventTopic || undefined
  );

  useEffect(() => {
    if (currentNode?.data?.typeNode !== "EndEvent") {
      if (open && currentNode?.data?.typeNode === "Condition") {
        setTimeout(() => setShowMetadata(true), 500);
      }
      if (!open && isShowMetadata) {
        setShowMetadata(false);
        setTimeout(() => setOpenDrawer(open), 300);
      } else if (currentNode?.data?.typeNode === "StartEvent") {
        setCategory(currentNode?.data?.category);
        setEventTopic(currentNode?.data?.eventTopic);
        setOpenDrawer(open);
      } else setOpenDrawer(open);
    }
  }, [open]);

  useEffect(() => {
    if (open && currentNode.data.typeNode === "StartEvent") setNodes(editNode);
  }, [category, eventTopic, open]);

  const editNode = () => {
    return getNodes().map((nd: any) => {
      if (nd.data.typeNode === "StartEvent") {
        nd.data = {
          ...nd.data,
          category,
          provider: "AKKA",
          eventTopic,
        };
      }
      return nd;
    });
  };

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
        {currentNode?.data?.typeNode === "StartEvent" ? (
          <Space direction="vertical" style={{ width: "100%", gap: "10px" }}>
            <Select
              placeholder="Category"
              style={{ width: "100%", height: "40px" }}
              value={category}
              onChange={setCategory}
              options={[
                { value: "QWORKS", label: "QWORKS" },
                { value: "Safeforce", label: "Safeforce" },
                { value: "Jira", label: "Jira" },
              ]}
            />
            <Select
              placeholder="Event"
              style={{ width: "100%", height: "40px" }}
              value={eventTopic}
              onChange={setEventTopic}
              options={[
                { value: "New/update account", label: "New/update account" },
                { value: "New ticket", label: "New ticket" },
              ]}
            />
          </Space>
        ) : (
          <>
            {/* <DroppableInput onShow={onShowMetadata} />
             */}
            <CollapseCustom show={isShowMetadata} />
            {currentNode?.data?.typeNode === "Condition" ? (
              <ReactFlowIfCondition
                workflowNodes={workflowNodes}
                setWorkflowNodes={setWorkflowNodes}
                currentNode={currentNode}
                isOpenDrawer={isOpenDrawer}
              />
            ) : (
              <ActionChildWorkflow
                workflowNodes={workflowNodes}
                setWorkflowNodes={setWorkflowNodes}
                currentNode={currentNode}
                isOpenDrawer={isOpenDrawer}
              />
            )}
          </>
        )}
      </Drawer>
    </>
  );
};

export default DrawerLayout;
