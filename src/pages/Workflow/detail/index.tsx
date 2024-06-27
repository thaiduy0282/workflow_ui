import "./style.css";

import { Button, Flex, Spin, Tooltip } from "antd";
import {
  LayoutOutlined,
  LoadingOutlined,
  LoginOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  ReactFlowProvider,
  XYPosition,
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useEdgesState,
  useKeyPress,
  useNodesState,
  useReactFlow,
} from "reactflow";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  handleGetWorkflowById,
  handlePublishWorkflow,
  handleUpdateWorkflow,
} from "../../Home/handleApi";

import ActionGroup from "../components/reactflow/nodes/ActionGroup";
import AddNewNode from "../components/reactflow/nodes/AddNewNode";
import ConditionNode from "../components/reactflow/nodes/ConditionNode";
import DrawerLayout from "../../../components/layout/Drawer";
import EndEventNode from "../components/reactflow/nodes/EndEventNode";
import ModalTrigger from "../components/modal/ModalTrigger";
import { PageHeader } from "../../../components/layout/PageHeader";
import { SmartSmoothEdge } from "../components/reactflow/sidebar/edges/SmartStepSmoothEdges";
import StartEventNode from "../components/reactflow/nodes/StartEventNode";
import { getEdgeStyle } from "../../../common/GetEdgeStyle";
import handleNotificationMessege from "../../../utils/notification";
import { handleSaveNodeConfigurationById } from "./handleApi";
import { useParams } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

interface FlowContextType {
  isDisableAddAction: boolean;
  setOpenTrigger: (open: boolean) => void;
  setDisableAddAction: (isDisableAddAction: boolean) => void;
  onNodesDelete: (deleted: any) => void;
  handleChangeActionId: (data: any, actionDraft: any) => void;
  handleDeleteNode: (node: any) => void;
}

export const ReactFlowContext = createContext<FlowContextType | undefined>(
  undefined
);

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

  const [isOpenTrigger, setOpenTrigger] = useState(false);
  const { isLoading, data }: any = handleGetWorkflowById(workflowId || "");

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [isDisableAddAction, setDisableAddAction] = useState(false);

  const [currentNode, setCurrentNode] = useState<Node | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDisablePublish, setDisablePublish] = useState(true);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const onCancelTrigger = () => {
    setOpenTrigger(false);
  };

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
        x: loopNode?.position?.x + 139,
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
        x: actionNode.position.x - 139,
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
          style: {
            strokeWidth: 1,
            stroke: "#b1b1b1",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: "#b1b1b1",
          },
        },
        {
          id: "id_" + uuidV4(),
          source: actionNode.id,
          target: outgoers ? outgoers.id : actionGroupNode.id,
          type: "smoothstep",
          animated: false,
          labelStyle: { fill: "black", fontWeight: 700 },
          style: {
            strokeWidth: 1,
            stroke: "#b1b1b1",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: "#b1b1b1",
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
          style: {
            strokeWidth: 1,
            stroke: "#b1b1b1",
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: "#b1b1b1",
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
        getEdgeStyle(
          "id_" + uuidV4(),
          ifNode.id,
          trueNode.id,
          "",
          false,
          "yes",
          "Yes"
        ),
        getEdgeStyle(
          "id_" + uuidV4(),
          ifNode.id,
          elseNode.id,
          "e-action-group__" + getId(),
          false,
          "no",
          "No"
        ),
        getEdgeStyle(
          "id_" + uuidV4(),
          trueNode.id,
          elseNode.id,
          "e-action-group__" + getId(),
          false
        ),
        getEdgeStyle(
          "id_" + uuidV4(),
          elseNode.id,
          falseNode.id,
          "e-action-group__" + getId(),
          false,
          "yes"
        ),
        getEdgeStyle(
          "id_" + uuidV4(),
          elseNode.id,
          outgoers ? outgoers.id : actionGroupNode.id,
          "e-action-group__" + getId(),
          false,
          "no"
        ),
        getEdgeStyle(
          "id_" + uuidV4(),
          falseNode.id,
          outgoers ? outgoers.id : actionGroupNode.id,
          "e-action-group__" + getId(),
          false
        ),
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
    if (actionDraft.data.isIfElseAction || actionDraft.data.isLoopAction)
      actionContinue(replacementNode);
  };

  // onDeleteNode
  const handleDeleteNode = (selectedNodeId?: any) => {
    let deletedNode: any = null;
    if (selectedNodeId) {
      deletedNode = getNodes().filter((node) => node.id === selectedNodeId)[0];
    } else {
      deletedNode = currentNode;
    }
    if (!deletedNode) return;
    if (
      deletedNode.data.typeNode === "StartEvent" ||
      (deletedNode.data.typeNode === "EndEvent" &&
        !deletedNode.data.isIfElseAction)
    )
      return;
    const referenceNodes: any = getNodes().filter(
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
      let replacementNode: any = {
        id: "id_" + uuidV4(),
        type: "actionGroup",
        position: {
          x: deletedNode.position.x + 114,
          y: deletedNode.position.y,
        },
        data: {
          isActionDraft: true,
          typeNode: "action__group-draft",
          label: "Action Group",
        },
      };

      if (deletedNode.data.isIfElseAction) {
        replacementNode.data.isIfElseAction = deletedNode.data.isIfElseAction;
        replacementNode.data.parentId = deletedNode.data.parentId;
        delete replacementNode.data.isActionDraft;
      } else if (deletedNode.data.isLoopAction) {
        replacementNode.data.isLoopAction = deletedNode.data.isLoopAction;
        replacementNode.data.parentId = deletedNode.data.parentId;
        delete replacementNode.data.isActionDraft;
      }

      const referenceNodeIds = referenceNodes.map((node: any) => node.id);

      const remainingNodes: any = getNodes()
        .filter((node) => !referenceNodeIds.includes(node.id))
        .map((node) => (deletedNode.id === node.id ? replacementNode : node));
      setNodes(remainingNodes);

      const filterEdgesCondition = (edge: any) =>
        ((lastNode == null
          ? deletedNode.id === edge.source
          : lastNode.id === edge.source && edge.data?.edgeType !== "yes") ||
          deletedNode.id === edge.target) &&
        edge.target !== edge.source &&
        !(deletedNode.data.typeNode === "Loop" && edge.targetHandle === "loop");

      const updatedEdges = getEdges()
        .filter((edge) => filterEdgesCondition(edge))
        .map((edge) => {
          if (filterEdgesCondition(edge)) {
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
      setEdges(
        getEdges()
          .filter(
            (edge) =>
              !(
                referenceNodeIds.includes(edge.source) ||
                referenceNodeIds.includes(edge.target) ||
                deletedNode.id === edge.target
              )
          )
          .concat(updatedEdges)
      );
    }
  };

  const deletePressed = useKeyPress(["Delete", "Backspace"]);

  useEffect(() => {
    handleDeleteNode();
  }, [deletePressed]);

  const onNodesDelete = (deleted: any) => {
    setEdges(
      deleted.reduce((acc: any, node: any) => {
        const incomers = getIncomers(node, getNodes(), getEdges());
        const outgoers = getOutgoers(node, getNodes(), getEdges());
        const connectedEdges = getConnectedEdges([node], getEdges());
        let remainingEdges = acc.filter(
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
            style: {
              strokeWidth: 1,
              stroke: "#b1b1b1",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
              color: "#b1b1b1",
            },
          }))
        );
        const incomerIds = incomers.map((item) => item.id);
        remainingEdges = remainingEdges.filter(
          (edge: any) =>
            !(
              incomerIds.includes(edge.source) &&
              edge.target !== outgoers[0].id &&
              edge.data.edgeType !== "yes"
            )
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
          x: nd.data.isIfElseAction
            ? 150
            : nd.data.isLoopAction
            ? 139
            : nd.data.typeNode === "action__group"
            ? 114
            : 0,
          y: yPos,
        };
        nd.positionAbsolute = {
          x: nd.data.isIfElseAction
            ? 150
            : nd.data.isLoopAction
            ? 139
            : nd.data.typeNode === "action__group"
            ? 114
            : 0,
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
      setDisablePublish(
        !data?.nodes?.some((nd: any) => nd.type === "endEventNode")
      );
      setEdges(data?.edges);
    }
  }, [data]);
  const handleChangeActionId = (data: any, actionDraft: any) => {
    if (data.data.typeNode) {
      if (
        actionDraft.data.isActionDraft ||
        actionDraft.data.isIfElseAction ||
        actionDraft.data.isLoopAction
      )
        onReplaceAction(data, actionDraft);
      else onAddNode(data);
    }
  };

  const nodeTypes = useMemo(
    () => ({
      startEventNode: (props: any) => <StartEventNode {...props} />,
      addNewNode: AddNewNode,
      actionGroup: (props: any) => <ActionGroup {...props} />,
      conditionNode: (props: any) => <ConditionNode {...props} />,
      endEventNode: (props: any) => <EndEventNode {...props} />,
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
    (e: any, node: Node) => {
      if (node.data.typeNode === "add-trigger") {
        onAddNode(node);
        setOpenTrigger(true);
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
        setCenter(x + 75, y + 25, { zoom: 1.25, duration: 1200 });
        setCurrentNode(node);
        if (
          e.target.className === "node__container" &&
          node.data.typeNode !== "EndEvent" &&
          node.data.typeNode !== "action__group" &&
          node.data.label !== "ELSE"
        )
          if (node.data.typeNode === "If") setTimeout(handleDrawerOpen, 200);
      }
    },
    [setCenter, nodes, edges]
  );

  // Add action group
  const actionContinue = (newNode: Node) => {
    if (newNode.data.typeNode !== "EndEvent") {
      const newGroupId = "id_" + uuidV4();
      let newGroup: any = {
        id: newGroupId,
        type: "actionGroup",
        position: {
          x: newNode?.position?.x + 114,
          y: newNode?.position?.y + 100,
        },
        data: {
          typeNode: "action__group",
          label: "Action Group",
        },
      };

      const nextNode = getOutgoers(newNode, getNodes(), getEdges())[0];

      if (newNode.data.isIfElseAction) {
        newGroup = {
          ...newGroup,
          position: {
            x: newNode?.position?.x,
            y: newNode?.position?.y + 5,
          },
          data: {
            ...newGroup.data,
            isIfElseAction: true,
            parentId: newNode.data.parentId,
          },
        };

        let foundIndexNode = 0;
        let newNodes = getNodes().map((node, index) => {
          if (node.id === newNode.id) {
            foundIndexNode = index;
            return newNode;
          } else return node;
        });

        newNodes.splice(foundIndexNode, 0, newGroup);

        let newEdges = getEdges().map((edge) => ({
          ...edge,
          animated: false,
          source:
            edge.source === newNode.id && edge.target === nextNode.id
              ? newGroupId
              : edge.source,
        }));
        setNodes(newNodes);
        setEdges(newEdges);
      } else if (newNode.data.isLoopAction) {
        newGroup = {
          ...newGroup,
          position: {
            x: newNode?.position?.x,
            y: newNode?.position?.y + 5,
          },
          data: {
            ...newGroup.data,
            isLoopAction: true,
            parentId: newNode.data.parentId,
          },
        };

        let foundIndexNode = 0;
        let newNodes = getNodes().map((node, index) => {
          if (node.id === newNode.id) {
            foundIndexNode = index;
            return newNode;
          } else return node;
        });

        newNodes.splice(foundIndexNode, 0, newGroup);

        let newEdges = getEdges().map((edge) => ({
          ...edge,
          animated: false,
          source: edge.source === newNode.id ? newGroupId : edge.source,
        }));
        setNodes(newNodes);
        setEdges(newEdges);
      } else {
        if (newNode.data.typeNode === "StartEvent")
          setNodesHook([newNode, newGroup]);
        else addNodes([newGroup]);
      }

      addEdges(
        getEdgeStyle(
          "id_" + uuidV4(),
          newNode.id,
          newGroup.id,
          "e-animation-action-group__" + getId()
        )
      );
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
        // setTimeout(handleDrawerOpen, 200);

        setOpenTrigger(true);

        actionContinue(newNode);
      } else if (
        typeNode.includes("action") &&
        typeNode !== "action__group" &&
        typeNode !== "action__group-draft"
      ) {
        const deleteActionGroupNode = getNodes().filter(
          (n) =>
            n.data.typeNode.includes("action") &&
            n.data.typeNode !== "action__group-draft" &&
            !n.data.isIfElseAction &&
            !n.data.isLoopAction
        );
        deleteElements({
          nodes: deleteActionGroupNode,
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
                type: "endEventNode",
                position: {
                  x: 0,
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

        const label = typeNode === "StartEvent" ? "ACTIONS" : "";
        const imcomers = getIncomers(
          deleteActionGroupNode[0],
          getNodes(),
          getEdges()
        );

        const newEdges: any = imcomers.map((filteredNode) => {
          return {
            id: "id_" + uuidV4(),
            source: filteredNode?.id ? filteredNode?.id : triggerNode[0].id,
            target: newNode.id,
            animated: false,
            type: "smoothstep",
            label,
            labelStyle: { fill: "black", fontWeight: 700 },
            style: {
              strokeWidth: 1,
              stroke: "#b1b1b1",
            },
            data: {
              typeEdge: "e-action-group__" + getId(),
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 10,
              height: 10,
              color: "#b1b1b1",
            },
          };
        });

        setEdges(
          getEdges()
            .filter((edge) => edge.target !== deleteActionGroupNode[0].id)
            .concat(newEdges)
        );

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
    <ReactFlowContext.Provider
      value={{
        isDisableAddAction,
        setOpenTrigger,
        setDisableAddAction,
        handleDeleteNode,
        onNodesDelete,
        handleChangeActionId,
      }}
    >
      <ModalTrigger
        isOpen={isOpenTrigger}
        onCancel={onCancelTrigger}
        currentNode={currentNode}
      />
      <PageHeader
        onBack
        breadcrumb={[{ title: "Workflows", href: "/" }, { title: data?.name }]}
        title={data?.name}
        extraAction={
          <Flex gap={5}>
            <Button
              className="btn-actions"
              size="large"
              onClick={onSave}
              disabled={isPending}
              type="primary"
              ghost
              icon={<SaveOutlined />}
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
              type="primary"
              icon={<LoginOutlined />}
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
          </Flex>
        }
      />
      <div style={{ width: "100%", height: "100%" }}>
        <ReactFlow
          deleteKeyCode={null}
          selectionKeyCode={null}
          multiSelectionKeyCode={null}
          disableKeyboardA11y={true}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
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
          <Background variant={BackgroundVariant.Dots} />
          <MiniMap />
          <Controls
            className="react-flow__controls"
            position="bottom-center"
            onFitView={() => fitView({ duration: 0, padding: 1 })}
            showInteractive={false}
            fitViewOptions={{ duration: 1200 }}
          >
            <Tooltip title="Auto Layout" placement="top">
              <ControlButton onClick={() => autoLayout()}>
                <LayoutOutlined />
              </ControlButton>
            </Tooltip>
          </Controls>
        </ReactFlow>
        <DrawerLayout
          open={drawerOpen}
          close={handleDrawerClose}
          currentNode={currentNode}
          workflowNodes={getNodes()}
          setWorkflowNodes={setNodesHook}
        />
      </div>
    </ReactFlowContext.Provider>
  );
};

const WorkflowDetail = () => (
  <ReactFlowProvider>
    <ReactFlowMain />
  </ReactFlowProvider>
);

export default WorkflowDetail;
