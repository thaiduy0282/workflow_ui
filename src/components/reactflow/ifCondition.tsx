import ReactFlow, {
  Connection,
  Controls,
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
import { useCallback, useEffect, useState } from "react";

import AddNewCondition from "./node/AddNewCondition";
import IfConditionNode from "./node/ifConditionNode";
import { v4 as uuidV4 } from "uuid";

let id = 1;
const getId = () => `${id++}`;

const nodeTypes = {
  IfConditionNode: IfConditionNode,
  addNewCondition: AddNewCondition,
};

const position: XYPosition = { x: 0, y: 0 };

const ReactFlowChild = ({
  curNode,
  isOpenDrawer,
  workflowNodes,
  setWorkflowNodes,
}: any) => {
  const initialNodes: Node[] = [
    {
      id: uuidV4(),
      type: "IfConditionNode",
      data: {
        typeNode: "if-condition",
        label: "If",
        order: 1,
      },
      position,
    },
    {
      id: uuidV4(),
      type: "addNewCondition",
      data: { typeNode: "add-new-condition" },
      position: { x: position.x - 7, y: position.y + 250 },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: uuidV4(),
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
      data: {
        typeEdge: "e-animation-condition__" + getId(),
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (!isOpenDrawer) {
      setWorkflowNodes(editWorkflowNode(workflowNodes));
    }

    if (
      curNode?.data?.nodes?.length !== 0 &&
      curNode?.data?.edges?.length !== 0
    ) {
      setNodes(curNode?.data?.nodes);
      setEdges(curNode?.data?.edges);
    }
  }, [isOpenDrawer, curNode]);

  const editWorkflowNode = (workflow: any) => {
    return workflow.map((nd: any) => {
      if (nd.id === curNode.id) {
        nd.data = { ...nd.data, nodes: getNodes(), edges: getEdges() };
      }
      return nd;
    });
  };

  const onConnect = (params: Connection | Edge) =>
    setEdges((eds) => addEdge(params, eds));

  const {
    fitView,
    addNodes,
    setNodes: setNodesHook,
    addEdges,
    getNodes,
    getEdges,
    deleteElements,
  } = useReactFlow();

  const onNodeClick: any = useCallback((_: MouseEvent, node: Node) => {
    if (node.data.typeNode.includes("add")) {
      onAddNode(node);
    }
  }, []);

  // Add new condition
  const actionContinue = (newNode: Node) => {
    const newCondition = {
      id: uuidV4(),
      type: "addNewCondition",
      data: {
        typeNode: "add-new-condition",
      },
      position: {
        x: newNode?.position?.x - 7,
        y: newNode?.position?.y + 250,
      },
    };
    addNodes([newCondition]);

    addEdges({
      id: uuidV4(),
      source: newNode.id,
      target: newCondition.id,
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
      data: {
        typeEdge: "e-animation-action-group__" + getId(),
      },
    });
  };

  const onAddNode = useCallback(
    (node: any) => {
      if (node.data.typeNode.includes("add")) {
        deleteElements({
          nodes: getNodes().filter((n) => n.data.typeNode.includes("add")),
          edges: getEdges().filter((e) =>
            e.data.typeEdge.includes("animation")
          ),
        });

        const countAction = getNodes().filter((n) =>
          n.data.typeNode.includes("if-condition")
        ).length;

        const highestOrder = getNodes()
          .filter((i) => i.data.typeNode !== "add-new-condition")
          .sort((a, b) => a?.data?.order - b?.data?.order)[
          getNodes().length - 2
        ];

        const newNode = {
          id: uuidV4(),
          type: "IfConditionNode",
          position: {
            x: getNodes()[0]?.position?.x + (countAction === 1 ? 0 : 7),
            y: getNodes()[0]?.position?.y + (countAction === 1 ? 250 : 0),
          },
          data: {
            typeNode: "new-if-condition-" + getId(),
            label: node.data.label,
            order: getNodes().length === 2 ? 2 : highestOrder.data.order + 1,
          },
        };

        addNodes(newNode);

        const filteredNodes = getNodes().filter((n) =>
          n.data.typeNode.includes("if-condition")
        );

        addEdges({
          id: uuidV4(),
          source: filteredNodes[0]?.id,
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
          data: {
            typeEdge: "e-action-group__" + getId(),
          },
        });
        actionContinue(newNode);
      }
    },
    [addNodes, deleteElements, setNodesHook, getNodes, getEdges, addEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      defaultViewport={{ x: 65, y: 0, zoom: 1.5 }}
      panOnDrag={false}
      nodesDraggable={false}
      zoomOnDoubleClick={false}
      elementsSelectable={false}
      nodesConnectable={false}
      selectNodesOnDrag={false}
      panOnScroll={true}
      maxZoom={1.5}
      minZoom={1.5}
    >
      <Controls
        onFitView={() => fitView({ duration: 1200, padding: 1 })}
        showInteractive={false}
      />
    </ReactFlow>
  );
};

const ReactFlowIfCondition = ({
  currentNode,
  isOpenDrawer,
  workflowNodes,
  setWorkflowNodes,
}: any) => (
  <ReactFlowProvider>
    <ReactFlowChild
      curNode={currentNode}
      isOpenDrawer={isOpenDrawer}
      workflowNodes={workflowNodes}
      setWorkflowNodes={setWorkflowNodes}
    />
  </ReactFlowProvider>
);

export default ReactFlowIfCondition;
