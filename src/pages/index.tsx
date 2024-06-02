import { MouseEvent, useCallback, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
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
import AddNewNode from "../components/node/AddNewNode";
import { Button } from "antd";
import DrawerLayout from "../components/layout/Drawer";
import IfConditionNode from "../components/node/ifConditionNode";
import { v4 as uuidv4 } from "uuid";

const nodeTypes = {
  addNewNode: AddNewNode,
  actionGroup: ActionGroup,
  ifConditionNode: IfConditionNode,
};

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleChangeActionId = (data: any) => {
    if (data.data.typeNode) {
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
    [setCenter, nodes.length]
  );

  // Add action group
  const actionContinue = (newNode: Node) => {
    if (newNode.data.typeNode !== "stop-job") {
      const newGroup = {
        id: uuidv4(),
        type: "actionGroup",
        position: { x: newNode?.position?.x, y: newNode?.position?.y + 100 },
        data: {
          typeNode: "action__group",
          label: "Action Group",
          func: handleChangeActionId,
        },
      };

      if (newNode.data.typeNode === "trigger")
        setNodesHook([newNode, newGroup]);
      else addNodes([newGroup]);

      addEdges({
        id: uuidv4(),
        source: newNode.id,
        target: newGroup.id,
        animated: true,
        type: "smoothstep",
        label:
          newNode.data.typeNode === "trigger" ? <tspan>ACTIONS</tspan> : <></>,
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
      if (node.data.typeNode === "add-trigger") {
        const newNode = {
          id: uuidv4(),
          type: "input",
          position,
          data: { typeNode: "trigger", label: "Trigger" },
        };

        setCurrentNode(newNode);
        setTimeout(handleDrawerOpen, 200);

        actionContinue(newNode);
      } else if (
        node.data.typeNode.includes("action") &&
        node.data.typeNode !== "action__group"
      ) {
        deleteElements({
          nodes: getNodes().filter((n) => n.data.typeNode.includes("action")),
          edges: getEdges().filter((e) =>
            e.data.typeEdge.includes("animation")
          ),
        });

        const countAction = getNodes().filter((n) =>
          n.data.typeNode.includes("act__")
        ).length;

        const newNode =
          node.data.typeNode === "action__stop-job"
            ? {
                id: uuidv4(),
                type: "output",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: { typeNode: "stop-job", label: node.data.label },
              }
            : {
                id: uuidv4(),
                type: "ifConditionNode",
                position: {
                  x: getNodes()[0]?.position?.x,
                  y: getNodes()[0]?.position?.y + (countAction === 0 ? 100 : 0),
                },
                data: {
                  typeNode: "act__" + getId(),
                  label: node.data.label,
                  nodes: [],
                  edges: [],
                },
              };

        addNodes(newNode);

        const triggerNode = getNodes().filter(
          (n) => n.data.typeNode === "trigger"
        );
        const filteredNodes = getNodes().filter((n) =>
          n.data.typeNode.includes("act__")
        );

        addEdges({
          id: uuidv4(),
          source: filteredNodes[0]?.id
            ? filteredNodes[0]?.id
            : triggerNode[0].id,
          target: newNode.id,
          animated: false,
          type: "smoothstep",
          label: filteredNodes[0]?.id ? <></> : <>ACTIONS</>,
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
        fitViewOptions={{ duration: 1200, padding: 2 }}
        maxZoom={Infinity}
      >
        <Background variant={BackgroundVariant.Lines} />
        <MiniMap />
        <Controls
          onFitView={() => fitView({ duration: 1200, padding: 1 })}
          showInteractive={false}
          fitViewOptions={{ duration: 1200 }}
        />
      </ReactFlow>
      <Button
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={() =>
          console.log("nodes: ", getNodes(), "edges: ", getEdges())
        }
      >
        Save
      </Button>
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

const Main = () => (
  <ReactFlowProvider>
    <ReactFlowMain />
  </ReactFlowProvider>
);

export default Main;
