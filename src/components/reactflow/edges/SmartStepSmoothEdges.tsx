import {
  SmartEdge,
  SmartEdgeOptions,
  pathfindingAStarDiagonal,
  pathfindingAStarNoDiagonal,
  pathfindingJumpPointNoDiagonal,
  svgDrawSmoothLinePath,
} from "@tisoap/react-flow-smart-edge";
import { StepEdge, useNodes } from "reactflow";

import type { EdgeProps } from "reactflow";

const StepConfiguration: SmartEdgeOptions = {
  drawEdge: svgDrawSmoothLinePath,
  generatePath: pathfindingJumpPointNoDiagonal,
  fallback: StepEdge,
};

export function SmartSmoothEdge<EdgeDataType = unknown, NodeDataType = unknown>(
  props: EdgeProps<EdgeDataType>
) {
  const nodes = useNodes<NodeDataType>();

  return (
    <SmartEdge<EdgeDataType, NodeDataType>
      {...props}
      options={StepConfiguration}
      nodes={nodes}
    />
  );
}
