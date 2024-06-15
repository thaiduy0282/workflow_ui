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
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import {
  handleGetWorkflowById,
  handlePublishWorkflow,
  handleUpdateWorkflow,
} from "../../Home/handleApi";

import ActionGroup from "../components/reactflow/nodes/ActionGroup";
import AddNewNode from "../components/reactflow/nodes/AddNewNode";
import ConditionNode from "../components/reactflow/nodes/ConditionNode";
import DrawerLayout from "../../../components/layout/Drawer";
import { SmartSmoothEdge } from "../components/reactflow/sidebar/edges/SmartStepSmoothEdges";
import StartEventNode from "../components/reactflow/nodes/StartEventNode";
import handleNotificationMessege from "../../../utils/notification";
import { handleSaveNodeConfigurationById } from "./handleApi";
import { useParams } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const edgeTypes = {
  smart: SmartSmoothEdge,
};

const position: XYPosition = { x: 0, y: 0 };

const initialNodes: Node[] = [
  {
    id: "id_" + uuidV4(),
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
  const getTypeNode = (typeNode: any) => {
    switch (typeNode) {
      case "action__Condition":
        return "If";

      case "action__If-Else-Condtion":
        return "If/else";

      case "action__Action":
        return "Action";

      case "action__Loop":
        return "Loop";

      default:
        return "EndEvent";
    }
  };
  const onConnect = useCallback(
    (params: any) => setEdges(addEdge(params, edges)),
    [edges]
  );

  const handleLoopNode = (loopNode: any, outgoers?: any) => {
    const actionNode = {
      id: "id_" + uuidV4(),
      type: "actionGroup",
      position: {
        x: loopNode?.position?.x + 50,
        y: loopNode?.position?.y + 100,
      },
      data: {
        isLoopAction: true,
        typeNode: "action__group",
        label: "Action Group",
        parentId: loopNode.id,
      },
    };

    const actionGroupNode = {
      id: "id_" + uuidV4(),
      type: "actionGroup",
      position: {
        x: actionNode.position.x - 50,
        y: actionNode.position.y + 100,
      },
      data: {
        typeNode: "action__group",
        label: "Action Group",
      },
    };

    return {
      nodes: outgoers ? [actionNode] : [actionGroupNode, actionNode],
      edges: [
        {
          id: "id_" + uuidV4(),
          source: loopNode.id,
          target: actionNode.id,
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
          id: "id_" + uuidV4(),
          source: actionNode.id,
          target: outgoers ? outgoers.id : actionGroupNode.id,
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
          id: "id_" + uuidV4(),
          source: actionNode.id,
          target: actionNode.id,
          targetHandle: "loop",
          type: "smart",
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
      ],
    };
  };

  const handleIfElseNode = (ifNode: any, outgoers?: any) => {
    const trueNode = {
      id: "id_" + uuidV4(),
      type: "actionGroup",
      position: {
        x: ifNode?.position?.x + 150,
        y: ifNode?.position?.y + 100,
      },
      data: {
        isIfElseAction: true,
        typeNode: "action__group",
        label: "Action Group",
        parentId: ifNode.id,
      },
    };

    const elseNode = {
      id: "id_" + uuidV4(),
      type: "conditionNode",
      position: {
        x: trueNode?.position?.x - 150,
        y: trueNode?.position?.y + 100,
      },
      data: {
        typeNode: "If/else",
        label: "ELSE",
        nodes: [],
        edges: [],
        parentId: ifNode.id,
      },
    };

    const falseNode = {
      id: "id_" + uuidV4(),
      type: "actionGroup",
      position: {
        x: elseNode?.position?.x + 150,
        y: elseNode?.position?.y + 100,
      },
      data: {
        isIfElseAction: true,
        typeNode: "action__group",
        label: "Action Group",
        parentId: ifNode.id,
      },
    };

    const actionGroupNode = {
      id: "id_" + uuidV4(),
      type: "actionGroup",
      position: {
        x: falseNode.position.x - 150,
        y: falseNode.position.y + 100,
      },
      data: {
        typeNode: "action__group",
        label: "Action Group",
      },
    };

    return {
      nodes: outgoers
        ? [falseNode, elseNode, trueNode]
        : [actionGroupNode, falseNode, elseNode, trueNode],
      edges: [
        {
          id: "id_" + uuidV4(),
          source: ifNode.id,
          target: trueNode.id,
          type: "smoothstep",
          animated: false,
          label: "Yes",
          labelStyle: { fill: "black", fontWeight: 700 },
          data: { edgeType: true },
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
          id: "id_" + uuidV4(),
          source: ifNode.id,
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
            edgeType: false,
          },
        },
        {
          id: "id_" + uuidV4(),
          source: trueNode.id,
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
          id: "id_" + uuidV4(),
          source: elseNode.id,
          target: falseNode.id,
          type: "smoothstep",
          animated: false,
          labelStyle: { fill: "black", fontWeight: 700 },
          data: { edgeType: true },
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
          id: "id_" + uuidV4(),
          source: elseNode.id,
          target: outgoers ? outgoers.id : actionGroupNode.id,
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
            edgeType: false,
          },
        },
        {
          id: "id_" + uuidV4(),
          source: falseNode.id,
          target: outgoers ? outgoers.id : actionGroupNode.id,
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
      ],
    };
  };

  const onReplaceAction = (newNode: any, actionDraft: any) => {
    const replacementNode: any = {
      id: actionDraft.id,
      type: "conditionNode",
      position: { x: actionDraft.xPos, y: actionDraft.yPos },
      data: {
        typeNode: getTypeNode(newNode.data.typeNode),
        label: newNode.data.label !== "IF/ELSE" ? newNode.data.label : "IF",
        nodes: [],
        edges: [],
      },
    };

    if (actionDraft.data.isIfElseAction) {
      replacementNode.data.isIfElseAction = actionDraft.data.isIfElseAction;
      replacementNode.data.parentId = actionDraft.data.parentId;
    } else if (actionDraft.data.isLoopAction) {
      replacementNode.data.isLoopAction = actionDraft.data.isLoopAction;
      replacementNode.data.parentId = actionDraft.data.parentId;
    }

    if (
      getTypeNode(newNode.data.typeNode) === "If/else" ||
      getTypeNode(newNode.data.typeNode) === "Loop"
    ) {
      let nodesData: any = [];
      let indexIfNode: number = 0;
      const remainingNodes = getNodes().map((node, index) => {
        if (actionDraft.id === node.id) {
          indexIfNode = index;
          const outgoers = getOutgoers(node, getNodes(), getEdges());
          const newEdges = getEdges().filter(
            (edge) => edge.target !== outgoers[0].id
          );
          setEdges(newEdges);
          if (getTypeNode(newNode.data.typeNode) === "If/else")
            nodesData = handleIfElseNode(replacementNode, outgoers[0]);
          else if (getTypeNode(newNode.data.typeNode) === "Loop")
            nodesData = handleLoopNode(replacementNode, outgoers[0]);
          return replacementNode;
        }
        return node;
      });
      remainingNodes.splice(indexIfNode, 0, ...nodesData.nodes);
      setNodes(remainingNodes);
      addEdges(nodesData.edges);
    } else {
      const remainingNodes = getNodes().map((node, index) => {
        if (actionDraft.id === node.id) {
          return replacementNode;
        }
        return node;
      });
      setNodes(remainingNodes);
    }
  };

  const onActionDraft = useCallback(
    (deleted: any) => {
      const deletedNode: any = deleted[0];
      const referenceNodes: any = nodes.filter(
        (node) => deletedNode.id === node.data?.parentId
      );
      let lastNode: any = null;
      if (deletedNode.data.typeNode === "If/else") {
        lastNode = referenceNodes.filter(
          (node: any) => node.data.label === "ELSE"
        )[0];
      } else if (deletedNode.data.typeNode === "Loop") {
        lastNode = referenceNodes[0];
      }
      if (deletedNode.data.typeNode !== "action__group") {
        const replacementNode = {
          id: "id_" + uuidV4(),
          type: "actionGroup",
          position: deletedNode.position,
          data: {
            isActionDraft: true,
            typeNode: "action__group-draft",
            label: "Action Group",
          },
        };
        const remainingNodes: any = nodes
          .map((node) => {
            if (deletedNode.id === node.id) {
              // Replace with a new node
              return replacementNode;
            } else if (deletedNode.id === node.data?.parentId) {
              return undefined;
            }
            return node;
          })
          .filter((node) => node !== undefined);
        setNodes(remainingNodes);

        const updatedEdges = edges.map((edge) => {
          if (
            (lastNode == null
              ? deletedNode.id === edge.source
              : lastNode.id === edge.source) ||
            deletedNode.id === edge.target
          ) {
            return {
              ...edge,
              source: (
                lastNode == null
                  ? deletedNode.id === edge.source
                  : lastNode.id === edge.source
              )
                ? replacementNode.id
                : edge.source,
              target:
                edge.target === deletedNode.id
                  ? replacementNode.id
                  : edge.target,
            };
          }
          return edge;
        });
        setEdges(updatedEdges);
      }
    },
    [nodes, edges]
  );

  const onNodesDelete = (deleted: any) => {
    setEdges(
      deleted.reduce((acc: any, node: any) => {
        const incomers = getIncomers(node, getNodes(), getEdges());
        const outgoers = getOutgoers(node, getNodes(), getEdges());
        const connectedEdges = getConnectedEdges([node], getEdges());
        const remainingEdges = acc.filter(
          (edge: any) => !connectedEdges.includes(edge)
        );

        const createdEdges = incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => ({
            id: "id_" + uuidV4(),
            source,
            target,
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
          }))
        );

        return [...remainingEdges, ...createdEdges];
      }, getEdges())
    );
    const newNodes = getNodes().filter((node) => node.id !== deleted[0].id);
    setNodes(newNodes);
  };

  const autoLayout = () => {
    if (nodes.length > 2) {
      const cloneNodes: any = getNodes().reverse();
      let yPos = 0;

      const sortNewWorkFlowNodes = cloneNodes.map((nd: any, index: any) => {
        yPos =
          index === 0
            ? 0
            : yPos +
              60 +
              (nd.data.typeNode === "Loop" || nd.data.isLoopAction
                ? 40
                : cloneNodes[index - 1].height);
        nd.position = {
          x: nd.data.isIfElseAction ? 150 : nd.data.isLoopAction ? 50 : 0,
          y: yPos,
        };
        nd.positionAbsolute = {
          x: nd.data.isIfElseAction ? 150 : nd.data.isLoopAction ? 50 : 0,
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

  const handleChangeActionId = (data: any, actionDraft: any) => {
    if (data.data.typeNode) {
      if (actionDraft.data.isActionDraft || actionDraft.data.isIfElseAction || actionDraft.data.isLoopAction)
        onReplaceAction(data, actionDraft);
      else onAddNode(data);
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
          onSelectAction={handleChangeActionId}
          onNodesDelete={onNodesDelete}
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

  useEffect(() => {
    autoLayout();
  }, [getNodes().length]);

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
        setCurrentNode(node);
        if (node.data.typeNode !== "EndEvent" && node.data.label !== "ELSE")
          setTimeout(handleDrawerOpen, 200);
      }
    },
    [setCenter, nodes, edges]
  );

  // Add action group
  const actionContinue = (newNode: Node) => {
    if (newNode.data.typeNode !== "EndEvent") {
      const newGroup = {
        id: "id_" + uuidV4(),
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
        id: "id_" + uuidV4(),
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

      if (typeNode === "add-trigger") {
        const newNode = {
          id: "id_" + uuidV4(),
          type: "startEventNode",
          position,
          data: { typeNode: "StartEvent", label: "Trigger" },
        };

        setCurrentNode(newNode);
        setTimeout(handleDrawerOpen, 200);

        actionContinue(newNode);
      } else if (
        typeNode.includes("action") &&
        typeNode !== "action__group" &&
        typeNode !== "action__group-draft"
      ) {
        deleteElements({
          nodes: getNodes().filter(
            (n) =>
              n.data.typeNode.includes("action") &&
              n.data.typeNode !== "action__group-draft"
          ),
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
          getTypeNode(typeNode) === "EndEvent"
            ? {
                id: "id_" + uuidV4(),
                type: "output",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: { typeNode: "EndEvent", label: node.data.label },
              }
            : {
                id: "id_" + uuidV4(),
                type: "conditionNode",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: {
                  typeNode: getTypeNode(typeNode),
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

        const isIfElseAction = filteredNodes[0]?.data?.isIfElseAction;

        const label = typeNode === "StartEvent" ? "ACTIONS" : "";

        const newEdges = {
          id: "id_" + uuidV4(),
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

        if (!isIfElseAction) addEdges(newEdges);
        else
          addEdges([
            newEdges,
            {
              id: "id_" + uuidV4(),
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
        // ===================== ADD IF/ELSE NODE =====================
        if (getTypeNode(typeNode) === "If/else") {
          const ifElseData = handleIfElseNode(newNode);
          addNodes(ifElseData.nodes);
          addEdges(ifElseData.edges);
        } else if (getTypeNode(typeNode) === "Loop") {
          const loopData = handleLoopNode(newNode);
          addNodes(loopData.nodes);
          addEdges(loopData.edges);
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
          case "If":
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
        edgeTypes={edgeTypes}
        onNodesDelete={onActionDraft}
        onConnect={onConnect}
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
