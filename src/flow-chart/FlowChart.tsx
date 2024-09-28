import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ConnectionLineType,
  Controls,
  Edge,
  Position,
  ReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { CurvedEdge } from "./components/CurvedEdge.tsx";

interface StageData {
  id: string;
  label: string;
  duration: string;
}

const stagesData: StageData[] = [
  { id: "1", label: "Ringing", duration: "0 Sec" },
  { id: "2", label: "IVR Answered", duration: "0.507 Sec" },
  { id: "3", label: "IVR Script(UK)", duration: "0.004 Sec" },
  { id: "4", label: "Menu(VO / VCC)", duration: "5.495 Sec" },
  { id: "5", label: "Digit Pressed", duration: "0.002 Sec" },
  { id: "6", label: "Exit Point", duration: "0.003 Sec" },
  { id: "7", label: "Schedule", duration: "0.326 Sec" },
  { id: "8", label: "Initial Action", duration: "0.048 Sec" },
  { id: "9", label: "Dialing", duration: "2.755 Sec" },
  { id: "10", label: "In Queue", duration: "0.259 Sec" },
  { id: "11", label: "Exit Point", duration: "0.003 Sec" },
  { id: "12", label: "Digit Pressed", duration: "3.941 Sec" },
  { id: "13", label: "Menu(Fault)", duration: "0.007 Sec" },
  { id: "14", label: "Agent Connected", duration: "10.177 Sec" },
  { id: "15", label: "Hangup", duration: "3.2 Min" },
];

const nodeWidth = 100;
const nodeHeight = 60;
const nodeMargin = 100;

export const CallJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(
    window.innerWidth,
  );

  // Adjust width when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(containerRef.current?.offsetWidth || window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { nodes, edges } = useMemo(() => {
    const rowLimit = Math.max(
      1,
      Math.floor(containerWidth / (nodeWidth + nodeMargin)),
    ); // Calculate how many nodes can fit into one row

    const generatedNodes = stagesData.map((stage, index) => {
      const isEvenRow = Math.floor(index / rowLimit) % 2 === 0;
      const rowPosition = index % rowLimit;
      const row = Math.floor(index / rowLimit);

      const x = isEvenRow
        ? rowPosition * (nodeWidth + nodeMargin) // Moving to the right
        : (rowLimit - rowPosition - 1) * (nodeWidth + nodeMargin); // Moving to the left

      const y = row * (nodeHeight + nodeMargin);

      return {
        id: stage.id,
        data: { label: `${stage.label} (${stage.duration})` },
        position: { x, y },
        sourcePosition: isEvenRow ? Position.Right : Position.Left,
        targetPosition: isEvenRow ? Position.Left : Position.Right,
        style: { width: nodeWidth, height: nodeHeight },
      };
    });

    const generatedEdges = stagesData.reduce<Edge[]>((acc, stage, index) => {
      const nextNodeId = stagesData[index + 1]?.id;
      const currentRow = Math.floor(index / rowLimit);
      const nextRow = Math.floor((index + 1) / rowLimit);

      // Use bezier only if moving from one row to another
      const isCrossRow = currentRow !== nextRow;

      if (nextNodeId) {
        acc.push({
          id: `e${stage.id}-${nextNodeId}`,
          source: stage.id,
          target: nextNodeId,
          animated: false,
          type: isCrossRow ? "curved" : ConnectionLineType.Straight,
          label: stagesData[index + 1].duration,
        });
      }

      return acc;
    }, []);

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [containerWidth]);

  const edgeTypes = {
    curved: CurvedEdge,
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={containerRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        draggable={false}
        panOnDrag={false}
        proOptions={{ hideAttribution: true }}
        fitView
      >
        <Controls
          showFitView={false}
          showInteractive={false}
          position={"bottom-right"}
        />
      </ReactFlow>
    </div>
  );
};
