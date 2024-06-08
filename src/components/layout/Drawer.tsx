import "./style.css";

import { Drawer, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";

import ActionSetup from "../reactflow/ActionSetup";
import CollapseCustom from "../collapse";
import ConditionSetup from "../reactflow/ConditionSetup";
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
          <Typography.Title
            level={3}
            style={{ margin: 0, textAlign: "center", lineHeight: 1 }}
          >
            {currentNode?.data?.label} Setup
          </Typography.Title>
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
              options={[{ value: "QWORKS", label: "QWORKS" }]}
            />
            <Select
              placeholder="Event"
              style={{ width: "100%", height: "40px" }}
              value={eventTopic}
              onChange={setEventTopic}
              options={[
                { value: "New/update account", label: "New/update account" },
              ]}
            />
          </Space>
        ) : (
          <>
            <CollapseCustom show={isShowMetadata} />
            {currentNode?.data?.typeNode === "Condition" ? (
              <ConditionSetup
                workflowNodes={workflowNodes}
                setWorkflowNodes={setWorkflowNodes}
                currentNode={currentNode}
                isOpenDrawer={isOpenDrawer}
              />
            ) : (
              <ActionSetup
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
