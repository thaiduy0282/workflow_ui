import ReactFlow, {
  Edge,
  Node,
  ReactFlowProvider,
  XYPosition,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { useCallback, useEffect } from "react";

import AddNewNode from "./nodes/AddNewNode";
import ConditionNode from "./nodes/ConditionNode";
import { getEdgeStyle } from "../../../../../common/GetEdgeStyle";
import { v4 as uuidV4 } from "uuid";

let id = 1;
const getId = () => `${id++}`;

const nodeTypes = {
  conditioNode: ConditionNode,
  addNewNode: AddNewNode,
};

const position: XYPosition = { x: 0, y: 0 };

const ReactFlowChild = ({
  curNode,
  isOpenDrawer,
  workflowNodes,
  setWorkflowNodes,
  getEdgeStyle,
}: any) => {
  const initialChildNodes: Node[] = [
    {
      id: "id_" + uuidV4(),
      type: "conditioNode",
      data: {
        typeNode: "ConditionSetup",
        label: "IF",
        order: 1,
      },
      position,
    },
    {
      id: "id_" + uuidV4(),
      type: "addNewNode",
      data: { typeNode: "add-new-node" },
      position: { x: position.x, y: position.y + 300 },
    },
  ];

  const initialChildEdges: Edge[] = [
    getEdgeStyle(
      "id_" + uuidV4(),
      initialChildNodes[0].id,
      initialChildNodes[1].id,
      "e-animation-condition__" + getId()
    ),
  ];

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
        nd.position = { ...nd.position, x: 0 };
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
      type: "addNewNode",
      data: {
        typeNode: "add-new-node",
      },
      position: {
        x: newNode?.position?.x,
        y: newNode?.position?.y + 300,
      },
    };
    addNodes([newCondition]);

    addEdges(
      getEdgeStyle(
        "id_" + uuidV4(),
        newNode.id,
        newCondition.id,
        "e-animation-action-group__" + getId()
      )
    );
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
          (n) => n.data.typeNode === "ConditionSetup"
        ).length;

        const highestOrder = getNodes()
          .filter((i) => i.data.typeNode !== "add-new-node")
          .sort((a, b) => a?.data?.order - b?.data?.order)[
          getNodes().length - 2
        ];

        const newNode = {
          id: "id_" + uuidV4(),
          type: "conditioNode",
          position: {
            x: getNodes()[0]?.position?.x,
            y: getNodes()[0]?.position?.y + (countAction === 1 ? 300 : 0),
          },
          data: {
            typeNode: "ConditionSetup",
            label: "IF",
            order: getNodes().length === 2 ? 2 : highestOrder.data.order + 1,
          },
        };

        addNodes(newNode);

        const filteredNodes = getNodes().filter(
          (n) => n.data.typeNode === "ConditionSetup"
        );

        addEdges(
          getEdgeStyle(
            "id_" + uuidV4(),
            filteredNodes[0]?.id,
            newNode.id,
            "e-action-group__" + getId(),
            false
          )
        );
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
    ></ReactFlow>
  );
};

const ConditionSetup = ({
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
      getEdgeStyle={getEdgeStyle}
    />
  </ReactFlowProvider>
);

export default ConditionSetup;
