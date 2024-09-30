import { Handle, Position } from "@xyflow/react";
import { FC } from "react";

type StageNodeProps = {
  data: any;
  sourcePosition?: Position;
  targetPosition?: Position;
};

export const StageNode: FC<StageNodeProps> = ({
  data,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "#e0e0e0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid #888",
          position: "relative",
        }}
      >
        {/* Placeholder for the icon in the center */}
        <div style={{ fontSize: "24px", color: "#333" }}>🔔</div>
      </div>

      {/* Label underneath, truncated if too long */}
      <div
        style={{
          width: "100px",
          marginTop: "8px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: "12px",
          color: "#333",
        }}
        title={data.label} // Tooltip for full label
      >
        {data.label}
      </div>

      {/* Handle for connection on left and right */}
      <Handle
        type="source"
        position={sourcePosition}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={targetPosition}
        style={{ background: "#555" }}
      />
    </div>
  );
};
