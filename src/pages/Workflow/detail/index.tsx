import "./style.css";

import { Button, Space, Spin, Tooltip } from "antd";
import { LayoutOutlined, LoadingOutlined } from "@ant-design/icons";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  Panel,
  ReactFlowProvider,
  XYPosition,
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
import { handleSaveNodeConfigurationById } from "./handleApi";
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

  const [isDisableAddAction, setDisableAddAction] = useState(false);

  const autoLayout = () => {
    if (nodes.length > 2) {
      const cloneNodes: any = getNodes().reverse();
      let yPos = 0;

      const sortNewWorkFlowNodes = cloneNodes.map((nd: any, index: any) => {
        yPos = index === 0 ? 0 : yPos + 60 + cloneNodes[index - 1].height;
        nd.position = {
          x: nd.data.isTrueNode ? 150 : 0,
          y: yPos,
        };
        nd.positionAbsolute = {
          x: nd.data.isTrueNode ? 150 : 0,
          y: yPos,
        };
        return nd;
      });
      setNodes(sortNewWorkFlowNodes.reverse());
    }
  };

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
      startEventNode: (props: any) => (
        <StartEventNode setDisableAddAction={setDisableAddAction} {...props} />
      ),
      addNewNode: AddNewNode,
      actionGroup: (props: any) => (
        <ActionGroup
          isDisableAddAction={isDisableAddAction}
          func={handleChangeActionId}
          {...props}
        />
      ),
      conditionNode: ConditionNode,
    }),
    [isDisableAddAction]
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
        if (node.data.typeNode !== "EndEvent" && node.data.label !== "ELSE")
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

          case "action__If-Else-Condtion":
            return "If-Else-Condition";

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
            e.data?.typeEdge?.includes("animation")
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
                  typeNode:
                    getTypeNode() === "If-Else-Condition"
                      ? "Condition"
                      : getTypeNode(),
                  label: node.data.label !== "IF/ELSE" ? node.data.label : "IF",
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

        const isTrueNode = filteredNodes[0]?.data?.isTrueNode;

        const label = typeNode === "StartEvent" ? "ACTIONS" : "";

        const newEdges = {
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
        };

        if (!isTrueNode) addEdges(newEdges);
        else
          addEdges([
            newEdges,
            {
              id: uuidv4(),
              source: filteredNodes[1]?.id,
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
            },
          ]);

        if (getTypeNode() === "If-Else-Condition") {
          const elseTrueNode = {
            id: uuidv4(),
            type: "conditionNode",
            position: {
              x: newNode?.position?.x + 150,
              y: newNode?.position?.y + 100,
            },
            data: {
              isTrueNode: true,
              typeNode: "Action",
              label: "Action",
              nodes: [],
              edges: [],
            },
          };
          const elseNode = {
            id: uuidv4(),
            type: "conditionNode",
            position: {
              x: elseTrueNode?.position?.x - 150,
              y: elseTrueNode?.position?.y + 100,
            },
            data: {
              typeNode: "Condition",
              label: "ELSE",
              nodes: [],
              edges: [],
            },
          };
          const trueNode = {
            id: uuidv4(),
            type: "conditionNode",
            position: {
              x: elseNode?.position?.x + 150,
              y: elseNode?.position?.y + 100,
            },
            data: {
              isTrueNode: true,
              typeNode: "Action",
              label: "Action",
              nodes: [],
              edges: [],
            },
          };

          const falseNode = {
            id: uuidv4(),
            type: "actionGroup",
            position: {
              x: trueNode.position.x - 150,
              y: trueNode.position.y + 100,
            },
            data: {
              typeNode: "action__group",
              label: "Action Group",
            },
          };

          addNodes([falseNode, trueNode, elseNode, elseTrueNode]);

          addEdges([
            {
              id: uuidv4(),
              source: newNode.id,
              target: elseTrueNode.id,
              type: "smoothstep",
              animated: false,
              label: "Yes",
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
            },
            {
              id: uuidv4(),
              source: newNode.id,
              target: elseNode.id,
              animated: false,
              type: "smoothstep",
              label: "No",
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
            },
            {
              id: uuidv4(),
              source: elseTrueNode.id,
              target: elseNode.id,
              animated: false,
              type: "smoothstep",
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
            },
            {
              id: uuidv4(),
              source: elseNode.id,
              target: trueNode.id,
              type: "smoothstep",
              animated: false,
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
            },
            {
              id: uuidv4(),
              source: elseNode.id,
              target: falseNode.id,
              animated: false,
              type: "smoothstep",
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
            },
            {
              id: uuidv4(),
              source: trueNode.id,
              target: falseNode.id,
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
            },
          ]);
        } else actionContinue(newNode);
      }
    },
    [addNodes, deleteElements, setNodesHook, getNodes, getEdges, addEdges]
  );

  const onSuccess = () => handleNotificationMessege("Save successfully!");
  const { isPending, mutate, isSuccess } = handleUpdateWorkflow(onSuccess);
  const {
    isPendingSaveNodeConfig,
    mutateSaveNodeConfig,
    isSuccessSaveNodeConfig,
  } = handleSaveNodeConfigurationById(onSuccess);

  const onSave = () => {
    const data = {
      id: workflowId,
      nodes: getNodes(),
      edges: getEdges(),
    };
    const dataNodeConfigurations = {
      id: workflowId,
      data: {
        nodeConfigurations: mapToNodeConfigurations(),
      },
    };
    mutateSaveNodeConfig(dataNodeConfigurations);
    mutate(data);
  };

  const mapToNodeConfigurations = () => {
    const filteredTriggerNode = getNodes().filter(
      (nd: any) => nd.data.typeNode === "StartEvent"
    )[0];

    const triggerConfiguration = {
      category: filteredTriggerNode.data.category,
      provider: filteredTriggerNode.data.provider,
      eventTopic: filteredTriggerNode.data.eventTopic,
    };

    const handleReplaceExpression = (
      expression: string,
      referenceObjects: any
    ) => {
      let clonedExpression: any = expression;
      referenceObjects.forEach((obj: any) => {
        if (clonedExpression.includes(obj.label)) {
          clonedExpression = clonedExpression.replace(obj.label, obj.apiName);
        }
      });
      return clonedExpression;
    };

    const collectConditionChild = (nodes: any) =>
      nodes
        .filter((nd: any) => nd.data.typeNode === "ConditionSetup")
        .map((item: any) => ({
          expression: handleReplaceExpression(
            item.data.expression,
            item.data.referenceObjects
          ),
          condition: item.data.condition,
          expressionType: item.data.expressionType,
          comparisonValue: item.data.comparisonValue,
          referenceObjects: item.data.referenceObjects,
        }));

    const collectActionChild = (nodes: any) =>
      nodes
        .filter((nd: any) => nd.data.typeNode === "ActionSetup")
        .map((item: any) => ({
          actionType: item.data.action,
          key: item.data.field,
          value: item.data.value,
          referenceObjects: item.data.referenceObjects,
        }));
    return getNodes()
      .filter((nd: any) => nd.data.typeNode !== "action__group")
      .map((node) => {
        switch (node.data.typeNode) {
          case "StartEvent":
            return {
              workflowId: "",
              nodeId: node.id,
              triggerConfiguration,
              conditions: [],
              actions: [],
              errorConfiguration: {
                customMessage: "[Trigger]: It's a custom error",
              },
            };
          case "Condition":
            return {
              workflowId: "",
              nodeId: node.id,
              triggerConfiguration,
              conditions: collectConditionChild(node.data.nodes),
              actions: [],
              errorConfiguration: {
                customMessage: "[Condition]: It's a custom error",
              },
            };
          case "Action":
            return {
              workflowId: "",
              nodeId: node.id,
              triggerConfiguration,
              conditions: [],
              actions: collectActionChild(node.data.nodes),
              errorConfiguration: {
                customMessage: "[Action]: It's a custom error",
              },
            };
          case "EndEvent":
            return {
              workflowId: "",
              nodeId: node.id,
              triggerConfiguration,
              conditions: [],
              actions: [],
              errorConfiguration: {
                customMessage: "[End]: It's a custom error",
              },
            };
          default:
            break;
        }
      });
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
        <Panel position="top-left">
          <div style={{ width: "100%", padding: "0 24px" }}>
            <div
              style={{ color: "black", fontSize: "20px", fontWeight: "bold" }}
            >
              {data?.name}
            </div>
          </div>
        </Panel>
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls
          position="top-right"
          onFitView={() => fitView({ duration: 0, padding: 1 })}
          showInteractive={false}
          fitViewOptions={{ duration: 1200 }}
        >
          <Tooltip title="Auto Layout" placement="left">
            <ControlButton onClick={() => autoLayout()}>
              <LayoutOutlined />
            </ControlButton>
          </Tooltip>
        </Controls>
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
        <Button
          className="btn-actions"
          size="large"
          onClick={onSave}
          disabled={isPending}
        >
          {isPending ? (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: "#000" }}
                  spin={isPending}
                />
              }
            />
          ) : (
            "Save as draft"
          )}
        </Button>
        <Button
          className="btn-actions"
          size="large"
          onClick={onPublish}
          disabled={isDisablePublish || isPendingPublish}
        >
          {isPendingPublish ? (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: "#000" }}
                  spin={isPendingPublish}
                />
              }
            />
          ) : (
            "Publish"
          )}
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
