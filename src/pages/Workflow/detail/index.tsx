import { Button, Space, Spin } from "antd";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  ReactFlowProvider,
  XYPosition,
  addEdge,
  updateEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import {
  handleGetWorkflowById,
  handlePublishWorkflow,
  handleUpdateWorkflow,
} from "../../Home/handleApi";

import ActionGroup from "../../../components/node/ActionGroup";
import AddNewNode from "../../../components/node/AddNewNode";
import ConditionNode from "../../../components/node/ConditionNode";
import DrawerLayout from "../../../components/layout/Drawer";
import StartEventNode from "../../../components/node/StartEventNode";
import handleNotificationMessege from "../../../utils/notification";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const position: XYPosition = { x: 0, y: 0 };

const initialNodes: Node[] = [
  {
    id: uuidv4(),
    type: "addNewNode",
    data: { typeNode: "add-trigger", label: "Add Trigger" },
    position,
  },
];

const initialEdges: Edge[] = [];

let id = 1;
const getId = () => `${id++}`;

const ReactFlowMain = () => {
  const { workflowId } = useParams();

  const { isLoading, data }: any = handleGetWorkflowById(workflowId || "");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (data?.nodes && data?.edges) {
      setNodes(data?.nodes);
      setEdges(data?.edges);
    }

    setDisablePublish(!data?.nodes?.some((nd: any) => nd.type === "output"));
  }, [data]);

  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDisablePublish, setDisablePublish] = useState(true);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleChangeActionId = (data: any) => {
    if (data.data.typeNode) {
      onAddNode(data);
    }
  };

  const nodeTypes = useMemo(
    () => ({
      startEventNode: StartEventNode,
      addNewNode: AddNewNode,
      actionGroup: (props: any) => (
        <ActionGroup func={handleChangeActionId} {...props} />
      ),
      conditionNode: ConditionNode,
    }),
    []
  );

  const {
    setCenter,
    fitView,
    addNodes,
    setNodes: setNodesHook,
    addEdges,
    getNodes,
    getEdges,
    deleteElements,
  } = useReactFlow();

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.data.typeNode === "add-trigger") {
        onAddNode(node);
        setTimeout(() => fitView({ duration: 1200, padding: 1 }), 100);
      } else if (node.data.typeNode.includes("action")) {
        onAddNode(node);
        if (nodes.length <= 3) {
          setTimeout(() => {
            fitView({ duration: 1200, padding: 1 });
          }, 100);
        }
      } else if (
        !node.data.typeNode.includes("add") &&
        !node.data.typeNode.includes("action")
      ) {
        const { x, y } = node.position;
        setCenter(x + 75, y + 25, { zoom: 1.85, duration: 1200 });
        setTimeout(handleDrawerOpen, 200);

        setCurrentNode(node);
      }
    },
    [setCenter, nodes, edges]
  );

  // Add action group
  const actionContinue = (newNode: Node) => {
    if (newNode.data.typeNode !== "EndEvent") {
      const newGroup = {
        id: uuidv4(),
        type: "actionGroup",
        position: { x: newNode?.position?.x, y: newNode?.position?.y + 100 },
        data: {
          typeNode: "action__group",
          label: "Action Group",
        },
      };

      if (newNode.data.typeNode === "StartEvent")
        setNodesHook([newNode, newGroup]);
      else addNodes([newGroup]);

      const label = newNode.data.typeNode === "StartEvent" ? "ACTIONS" : "";

      addEdges({
        id: uuidv4(),
        source: newNode.id,
        target: newGroup.id,
        animated: true,
        type: "smoothstep",
        label,
        labelStyle: { fill: "black", fontWeight: 700 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#b1b1b1",
        },
        style: {
          strokeWidth: 2,
          stroke: "#b1b1b1",
        },
        data: {
          typeEdge: "e-animation-action-group__" + getId(),
        },
      });
    }
  };

  const onAddNode = useCallback(
    (node: any) => {
      const typeNode = node.data.typeNode;

      const getTypeNode = () => {
        switch (typeNode) {
          case "action__Condition":
            return "Condition";

          case "action__Action":
            return "Action";

          case "action__Loop":
            return "Loop";

          default:
            return "EndEvent";
        }
      };

      if (typeNode === "add-trigger") {
        const newNode = {
          id: uuidv4(),
          type: "startEventNode",
          position,
          data: { typeNode: "StartEvent", label: "Trigger" },
        };

        setCurrentNode(newNode);
        setTimeout(handleDrawerOpen, 200);

        actionContinue(newNode);
      } else if (typeNode.includes("action") && typeNode !== "action__group") {
        deleteElements({
          nodes: getNodes().filter((n) => n.data.typeNode.includes("action")),
          edges: getEdges().filter((e) =>
            e.data.typeEdge.includes("animation")
          ),
        });

        const countAction = getNodes().filter(
          (n) =>
            !n.data.typeNode.includes("StartEvent") &&
            !n.data.typeNode.includes("action__group")
        ).length;

        const newNode =
          getTypeNode() === "EndEvent"
            ? {
                id: uuidv4(),
                type: "output",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: { typeNode: "EndEvent", label: node.data.label },
              }
            : {
                id: uuidv4(),
                type: "conditionNode",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: {
                  typeNode: getTypeNode(),
                  label: node.data.label,
                  nodes: [],
                  edges: [],
                },
              };

        addNodes(newNode);

        const triggerNode = getNodes().filter(
          (n) => n.data.typeNode === "StartEvent"
        );
        const filteredNodes = getNodes().filter(
          (n) =>
            !n.data.typeNode.includes("StartEvent") &&
            !n.data.typeNode.includes("action__group")
        );

        const label = typeNode === "StartEvent" ? "ACTIONS" : "";

        addEdges({
          id: uuidv4(),
          source: filteredNodes[0]?.id
            ? filteredNodes[0]?.id
            : triggerNode[0].id,
          target: newNode.id,
          animated: false,
          type: "smoothstep",
          label,
          labelStyle: { fill: "black", fontWeight: 700 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#b1b1b1",
          },
          style: {
            strokeWidth: 2,
            stroke: "#b1b1b1",
          },
          data: {
            typeEdge: "e-action-group__" + getId(),
          },
        });
        actionContinue(newNode);
      }
    },
    [addNodes, deleteElements, setNodesHook, getNodes, getEdges, addEdges]
  );

  const onSuccess = () => handleNotificationMessege("Save successfully!");
  const { isPending, mutate, isSuccess } = handleUpdateWorkflow(onSuccess);

  const onSave = () => {
    const data = {
      id: workflowId,
      nodes: getNodes(),
      edges: getEdges(),
    };
    mutate(data);
  };

  const onPublishSuccess = () =>
    handleNotificationMessege("Publish successfully!");
  const { isPendingPublish, mutatePublish, isSuccessPublish } =
    handlePublishWorkflow(onPublishSuccess);
  const onPublish = () => {
    const data = {
      id: workflowId,
      isPublished: true,
    };
    mutatePublish(data);
  };

  return isLoading ? (
    <Spin spinning={isLoading} fullscreen />
  ) : (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{
          duration: 1200,
          padding: !data?.nodes || data?.nodes?.length === 0 ? 3 : 0.5,
          nodes: data?.nodes,
        }}
        maxZoom={Infinity}
      >
        <Background variant={BackgroundVariant.Lines} />
        <MiniMap />
        <Controls
          onFitView={() => fitView({ duration: 0, padding: 1 })}
          showInteractive={false}
          fitViewOptions={{ duration: 1200 }}
        />
      </ReactFlow>
      <Space
        direction="horizontal"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Button type="primary" size="large" onClick={onSave}>
          Save as draft
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={onPublish}
          disabled={isDisablePublish}
        >
          Publish
        </Button>
      </Space>
      <DrawerLayout
        open={drawerOpen}
        close={handleDrawerClose}
        currentNode={currentNode}
        workflowNodes={getNodes()}
        setWorkflowNodes={setNodesHook}
      />
    </>
  );
};

const WorkflowDetail = () => (
  <ReactFlowProvider>
    <ReactFlowMain />
  </ReactFlowProvider>
);

export default WorkflowDetail;
