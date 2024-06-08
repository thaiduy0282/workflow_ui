import ReactFlow, {
  Controls,
  Edge,
  MarkerType,
  Node,
  ReactFlowProvider,
  XYPosition,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { useCallback, useEffect, useState } from "react";

import ActionNode from "./node/ActionNode";
import AddNewCondition from "./node/AddNewCondition";
import { v4 as uuidV4 } from "uuid";

let id = 1;
const getId = () => `${id++}`;

const nodeTypes = {
  actionNode: ActionNode,
  addNewCondition: AddNewCondition,
};

const position: XYPosition = { x: 0, y: 0 };

const initialChildNodes: Node[] = [
  {
    id: "id_" + uuidV4(),
    type: "actionNode",
    data: {
      typeNode: "ActionSetup",
      label: "Action",
      order: 1,
    },
    position,
  },
  {
    id: "id_" + uuidV4(),
    type: "addNewCondition",
    data: { typeNode: "add-new-condition" },
    position: { x: position.x, y: position.y + 250 },
  },
];

const initialChildEdges: Edge[] = [
  {
    id: "id_" + uuidV4(),
    source: initialChildNodes[0].id,
    target: initialChildNodes[1].id,
    animated: true,
    type: "smoothstep",
    label: "",
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

const ReactFlowChild = ({
  curNode,
  isOpenDrawer,
  workflowNodes,
  setWorkflowNodes,
}: any) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    curNode?.data?.nodes?.length !== 0
      ? curNode?.data?.nodes
      : initialChildNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    curNode?.data?.edges?.length !== 0
      ? curNode?.data?.edges
      : initialChildEdges
  );

  const {
    fitView,
    addNodes,
    setNodes: setNodesHook,
    addEdges,
    getNodes,
    getEdges,
    deleteElements,
  } = useReactFlow();

  useEffect(() => {
    if (
      curNode?.data?.nodes?.length !== 0 &&
      curNode?.data?.edges?.length !== 0
    ) {
      setNodes(curNode?.data?.nodes);
      setEdges(curNode?.data?.edges);
    } else {
      setNodes(initialChildNodes);
      setEdges(initialChildEdges);
    }
  }, [curNode?.id]);

  const editWorkflowNode = () => {
    const newWorkflowNodes = workflowNodes?.map((nd: any, index: number) => {
      if (nd.id === curNode.id) {
        nd.position = {
          ...nd.position,
          x: !nd.data.isTrueNode ? 0 : nd.position.x,
        };
        nd.data = { ...nd.data, nodes, edges };
      }
      return nd;
    });
    return newWorkflowNodes;
  };

  useEffect(() => {
    if (!isOpenDrawer) setWorkflowNodes(editWorkflowNode());
  }, [isOpenDrawer]);

  const onNodeClick: any = useCallback((_: MouseEvent, node: Node) => {
    if (node.data.typeNode.includes("add")) {
      onAddNode(node);
    }
  }, []);

  // Add new condition
  const actionContinue = (newNode: Node) => {
    const newCondition = {
      id: "id_" + uuidV4(),
      type: "addNewCondition",
      data: {
        typeNode: "add-new-condition",
      },
      position: {
        x: newNode?.position?.x,
        y: newNode?.position?.y + 250,
      },
    };
    addNodes([newCondition]);

    addEdges({
      id: "id_" + uuidV4(),
      source: newNode.id,
      target: newCondition.id,
      animated: true,
      type: "smoothstep",
      label: "",
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

        const countAction = getNodes().filter(
          (n) => n.data.typeNode === "ActionSetup"
        ).length;

        const highestOrder = getNodes()
          .filter((i) => i.data.typeNode !== "add-new-condition")
          .sort((a, b) => a?.data?.order - b?.data?.order)[
          getNodes().length - 2
        ];

        const newNode = {
          id: "id_" + uuidV4(),
          type: "actionNode",
          position: {
            x: getNodes()[0]?.position?.x,
            y: getNodes()[0]?.position?.y + (countAction === 1 ? 250 : 0),
          },
          data: {
            typeNode: "ActionSetup",
            label: "Action",
            order: getNodes().length === 2 ? 2 : highestOrder.data.order + 1,
          },
        };

        addNodes(newNode);

        const filteredNodes = getNodes().filter(
          (n) => n.data.typeNode === "ActionSetup"
        );

        addEdges({
          id: "id_" + uuidV4(),
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
      className="reactflow__setup-container"
    >
      <Controls
        onFitView={() => fitView({ duration: 1200, padding: 1 })}
        showInteractive={false}
      />
    </ReactFlow>
  );
};

const ActionSetup = ({
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

export default ActionSetup;
