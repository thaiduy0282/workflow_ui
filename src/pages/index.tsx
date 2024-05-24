import "../styles/style.css";

import { MouseEvent, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  Panel,
  ReactFlowProvider,
  XYPosition,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";

import ActionGroup from "../components/node/ActionGroup";
import { ActionList } from "../constant/Nodes";
import ActionNode from "../components/node/ActionNode";
import AddNewNode from "../components/node/AddNewNode";
import DrawerLayout from "../components/layout/Drawer";
import PopupTrigger from "../components/popup/PopupTrigger";
import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeTypes = {
  addNewNode: AddNewNode,
  actionGroup: ActionGroup,
  actionNode: ActionNode,
};

const position: XYPosition = { x: 0, y: 0 };

const initialNodes: Node[] = [
  {
    id: "add-trigger",
    type: "addNewNode",
    data: { label: "Add Trigger" },
    position,
  },
];

const initialEdges: Edge[] = [];

let id = 1;
const getId = () => `${id++}`;

const UseZoomPanHelperFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [nodeName, setNodeName] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [openPopupTrigger, setOpenPopupTrigger] = useState(false);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n?.id === currentNode?.id
          ? { ...n, data: { ...n.data, label: nodeName } }
          : n
      )
    );
  }, [nodeName]);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleClickOpenPopupTrigger = () => {
    setOpenPopupTrigger(true);
  };
  const handleClosePopupTrigger = () => {
    if (currentNode) {
      onAddNode(currentNode);
      setTimeout(() => fitView({ duration: 1200, padding: 1 }), 100);
    }
    setOpenPopupTrigger(false);
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

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      if (node.id === "add-trigger") handleClickOpenPopupTrigger();
      else if (node.id.includes("action")) {
        onAddNode(node);
        setTimeout(() => fitView({ duration: 1200, padding: 1 }), 100);
      } else if (!node.id.includes("add") && !node.id.includes("action")) {
        const { x, y } = node.position;
        setCenter(x + 75, y + 25, { zoom: 1.85, duration: 1200 });
        setTimeout(handleDrawerOpen, 200);
      }

      setCurrentNode(node);
    },
    [setCenter]
  );

  const actionContinue = (newNode: Node) => {
    if (newNode.id !== "stop-job") {
      const newGroup = {
        id: "action__group",
        type: "actionGroup",
        position: { x: newNode?.position?.x, y: newNode?.position?.y + 100 },
        data: { label: "Action Group" },
      };

      const anotherNode = ActionList.map((data, index) => ({
        id: "action__" + data.id,
        type: "actionNode",
        dragHandle: "disable",
        position: { x: position.x + (100 * index + 10), y: position.y + 12 },
        data: { label: data.label },
        parentId: newGroup.id,
      }));

      if (newNode.id === "trigger")
        setNodesHook([newNode, newGroup, ...anotherNode]);
      else addNodes([newGroup, ...anotherNode]);

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
    } else {
      addNodes(newNode);
    }
  };

  const onAddNode = useCallback(
    (node: Node) => {
      if (node.id === "add-trigger") {
        const newNode = {
          id: "trigger",
          type: "input",
          position,
          data: { label: "Trigger" },
        };

        setCurrentNode(newNode);
        setTimeout(handleDrawerOpen, 200);

        actionContinue(newNode);
      } else if (node.id.includes("action")) {
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
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: { label: node.data.label },
              }
            : {
                id: "act__" + getId(),
                type: "default",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: { label: node.data.label },
              };

        addNodes(newNode);

        const filteredNodes = getNodes().filter((n) =>
          n.id.includes("false-case")
        );

        if (filteredNodes.length > 0) {
          const falseNode = filteredNodes.reduce((prev: any, current: any) => {
            const prevId = parseInt(prev.id.match(/\d+$/)[0]);
            const currentId = parseInt(current.id.match(/\d+$/)[0]);
            return prevId > currentId ? prev : current;
          });

          addEdges({
            id: "e-action-group__" + getId(),
            source: falseNode.id,
            target: newNode.id,
            animated: false,
            labelStyle: { fill: "black", fontWeight: 700 },
            type: "smoothstep",
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
        } else
          addEdges({
            id: "e-action-group__" + getId(),
            source: getNodes()[0].id,
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

        if (
          node.id === "action__if-condition" ||
          node.id === "action__else-if-condition"
        ) {
          const trueNode = {
            id: "true-case__" + getId(),
            type: "default",
            position: {
              x: newNode?.position?.x + 150,
              y: newNode?.position?.y + 100,
            },
            data: { label: "If true" },
          };

          const falseNode = {
            id: "false-case__" + getId(),
            type: "default",
            position: {
              x: trueNode.position.x - 150,
              y: trueNode.position.y + 100,
            },
            data: { label: "If false" },
          };

          addNodes([trueNode, falseNode]);

          addEdges([
            {
              id: "e-true-act__" + getId(),
              source: newNode.id,
              target: trueNode.id,
              type: "smoothstep",
              animated: false,
              label: <tspan>Yes</tspan>,
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
              id: "e-false-act__" + getId(),
              source: newNode.id,
              target: falseNode.id,
              type: "smoothstep",
              animated: false,
              label: <tspan>No</tspan>,
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
              id: "e-final-act__" + getId(),
              source: trueNode.id,
              target: falseNode.id,
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
          ]);

          actionContinue(falseNode);
        } else {
          actionContinue(newNode);
        }
      }
    },
    [addNodes, deleteElements, setNodesHook, getNodes, getEdges, addEdges]
  );

  const deleteSelectedElements = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);
    deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  }, [deleteElements, nodes, edges]);

  const onResetNodes = useCallback(
    () => setNodesHook(initialNodes),
    [setNodesHook]
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
        fitViewOptions={{ duration: 1200, padding: 1 }}
        maxZoom={Infinity}
      >
        <Panel position="top-right">
          <PopupTrigger
            open={openPopupTrigger}
            handleClose={handleClosePopupTrigger}
          />
          {/* <button onClick={onResetNodes}>Reset Nodes</button>
          <button onClick={deleteSelectedElements}>
            Delete Selected Elements
          </button> */}
        </Panel>
        <Background />
        <MiniMap />
        <Controls
          onFitView={() => fitView({ duration: 1200, padding: 1 })}
          showInteractive={false}
          fitViewOptions={{ duration: 1200 }}
        />
      </ReactFlow>
      <DrawerLayout
        open={drawerOpen}
        close={handleDrawerClose}
        currentNode={currentNode}
        onChangeNodeName={setNodeName}
      />
    </>
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UseZoomPanHelperFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;
