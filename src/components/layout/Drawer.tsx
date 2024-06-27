import "./style.css";

import { Drawer, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";

import ActionSetup from "../../pages/Workflow/components/reactflow/sidebar/ActionSetup";
import CollapseCustom from "../metadata";
import ConditionSetup from "../../pages/Workflow/components/reactflow/sidebar/ConditionSetup";
import { Title } from "../custom/Typography";
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
  const [inputList, setInputList] = useState(
    currentNode?.data?.inputList || undefined
  );

  useEffect(() => {
    if (currentNode?.data?.typeNode !== "EndEvent") {
      if (
        open &&
        (currentNode?.data?.typeNode === "If" ||
          currentNode?.data?.typeNode === "If/else")
      ) {
        setTimeout(() => setShowMetadata(true), 500);
      }
      if (!open && isShowMetadata) {
        setShowMetadata(false);
        setTimeout(() => setOpenDrawer(open), 300);
      } else if (currentNode?.data?.typeNode === "StartEvent") {
        setCategory(currentNode?.data?.category);
        setEventTopic(currentNode?.data?.eventTopic);
        setOpenDrawer(open);
      } else if (currentNode?.data?.typeNode === "Loop") {
        setInputList(currentNode?.data?.inputList);
        setOpenDrawer(open);
      } else setOpenDrawer(open);
    }
  }, [open]);
  useEffect(() => {
    if (
      open &&
      (currentNode.data.typeNode === "StartEvent" ||
        currentNode.data.typeNode === "Loop")
    )
      setNodes(editNode);
  }, [category, eventTopic, inputList, open]);

  const editNode = () => {
    return getNodes().map((nd: any) => {
      if (
        nd.data.typeNode === "StartEvent" &&
        nd.id === currentNode.id &&
        currentNode.data.typeNode === "StartEvent"
      ) {
        nd.data = {
          ...nd.data,
          category,
          provider: "AKKA",
          eventTopic,
        };
      } else if (
        nd.data.typeNode === "Loop" &&
        nd.id === currentNode.id &&
        currentNode.data.typeNode === "Loop"
      ) {
        nd.data = {
          ...nd.data,
          inputList,
        };
      }
      return nd;
    });
  };

  return (
    <>
      <Drawer
        title={
          <Title
            level={3}
            style={{ margin: 0, textAlign: "center", lineHeight: 1 }}
          >
            {currentNode?.data?.label} Setup
          </Title>
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
              options={[{ value: "ACCOUNT_EVENT", label: "ACCOUNT_EVENT" }]}
            />
          </Space>
        ) : currentNode?.data?.typeNode === "Loop" ? (
          <Space direction="vertical" style={{ width: "100%", gap: "10px" }}>
            <Select
              placeholder="Input list"
              style={{ width: "100%", height: "40px" }}
              value={inputList}
              onChange={setInputList}
              options={[{ value: "Elements", label: "Elements" }]}
            />
          </Space>
        ) : (
          <>
            <CollapseCustom show={isShowMetadata} />
            {currentNode?.data?.typeNode === "If" ||
            currentNode?.data?.typeNode === "If/else" ? (
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
