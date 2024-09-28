import { EdgeProps, Position } from "@xyflow/react";

export const CurvedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) => {
  // Calculate the control points manually
  const controlXOffset = 50;
  const controlYOffset = 0;

  const controlX1 =
    sourceX +
    (sourcePosition === Position.Right ? controlXOffset : -controlXOffset);
  const controlY1 = sourceY + controlYOffset;
  const controlX2 =
    targetX +
    (targetPosition === Position.Left ? -controlXOffset : controlXOffset);
  const controlY2 = targetY + controlYOffset;

  const edgePath = `M ${sourceX},${sourceY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${targetX},${targetY}`;

  // Position for the label
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {label && (
        <text
          x={labelX}
          y={labelY}
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle"
          style={{
            pointerEvents: "none",
            userSelect: "none",
            fontSize: "10px",
          }}
        >
          {label}
        </text>
      )}
    </>
  );
};
