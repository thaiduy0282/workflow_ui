import ReactFlow, {
  Connection,
  Edge,
  MarkerType,
  Node,
  ReactFlowProvider,
  XYPosition,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { useCallback, useState } from "react";

import AddNewCondition from "./node/AddNewCondition";
import IfConditionNode from "./node/ifConditionNode";

let id = 1;
const getId = () => `${id++}`;

const nodeTypes = {
  IfConditionNode: IfConditionNode,
  addNewCondition: AddNewCondition,
};

const position: XYPosition = { x: 0, y: 0 };

const initialNodes: Node[] = [
  {
    id: "if-condition",
    type: "IfConditionNode",
    data: { label: "If" },
    position,
  },
  {
    id: "add-new-condition",
    type: "addNewCondition",
    data: {},
    position: { x: position.x - 7, y: position.y + 250 },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e-animation-condition__" + getId(),
    source: initialNodes[0].id,
    target: initialNodes[1].id,
    animated: true,
    type: "smoothstep",
    label: <></>,
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
];

const ReactFlowChild = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);

  const handleChangeActionId = (data: any) => {
    if (data.id) {
      onAddNode(data);
    }
  };

  const onConnect = (params: Connection | Edge) =>
    setEdges((eds) => addEdge(params, eds));

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

  const onNodeClick: any = useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.id === "add-trigger") {
        onAddNode(node);
        setTimeout(() => fitView({ duration: 1200, padding: 0.2 }), 100);
      } else if (node.id.includes("action")) {
        onAddNode(node);
        setTimeout(() => {
          fitView({ duration: 1200, padding: 0.2 });
        }, 100);
      } else if (!node.id.includes("add") && !node.id.includes("action")) {
        setTimeout(() => {
          fitView({ duration: 1200, padding: 0.2 });
        }, 100);
        setCurrentNode(node);
      }
    },
    [setCenter]
  );

  // Add action group
  const actionContinue = (newNode: Node) => {
    if (newNode.id !== "stop-job") {
      const newGroup = {
        id: "action__group",
        type: "actionGroup",
        position: { x: newNode?.position?.x, y: newNode?.position?.y + 100 },
        data: { label: "Action Group", func: handleChangeActionId },
      };

      if (newNode.id === "trigger") setNodesHook([newNode, newGroup]);
      else addNodes([newGroup]);

      addEdges({
        id: "e-animation-action-group__" + getId(),
        source: newNode.id,
        target: newGroup.id,
        animated: true,
        type: "smoothstep",
        label: newNode.id === "trigger" ? <tspan>ACTIONS</tspan> : <></>,
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
      });
    }
  };

  const onAddNode = useCallback(
    (node: any) => {
      if (node.id === "add-trigger") {
        const newNode = {
          id: "trigger",
          type: "input",
          position,
          data: { label: "Trigger" },
        };

        setCurrentNode(newNode);

        actionContinue(newNode);
      } else if (node.id.includes("action") && node.id !== "action__group") {
        deleteElements({
          nodes: getNodes().filter((n) => n.id.includes("action")),
          edges: getEdges().filter((e) => e.id.includes("animation")),
        });

        const countAction = getNodes().filter((n) =>
          n.id.includes("act__")
        ).length;

        const newNode =
          node.id === "action__stop-job"
            ? {
                id: "stop-job",
                type: "output",
                dragHandle: ".disable",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: { label: node.data.label },
              }
            : {
                id: "act__" + getId(),
                type: "default",
                dragHandle: ".disable",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: { label: node.data.label },
              };

        addNodes(newNode);

        const filteredNodes = getNodes().filter((n) => n.id.includes("act__"));

        addEdges({
          id: "e-action-group__" + getId(),
          source: filteredNodes[0]?.id ? filteredNodes[0]?.id : "trigger",
          target: newNode.id,
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
        });
        actionContinue(newNode);
      }
    },
    [addNodes, deleteElements, setNodesHook, getNodes, getEdges, addEdges]
  );

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ duration: 1200, padding: 0.3 }}
        panOnDrag={false}
        nodesDraggable={false}
        zoomOnDoubleClick={false}
        maxZoom={Infinity}
      ></ReactFlow>
    </>
  );
};

const ReactFlowIfCondition = () => (
  <ReactFlowProvider>
    <ReactFlowChild />
  </ReactFlowProvider>
);

export default ReactFlowIfCondition;
