import { Handle, Position } from "@xyflow/react";

export const CircleNode: React.FC<{ data: any }> = ({ data }) => {
    return (
        <div
            // className={`w-[172px] h-[44px] p-2 bg-white border border-gray-500 rounded-full flex items-center justify-center text-center`}
            style={{
                backgroundColor: data.color || "#ffffff",
                width: "172px",
                height: "44px",
                padding: "8px",
                border: "1px solid #e2e8f0",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
            }}
        >
            {data.depth !== 0 && (
                <Handle
                    type="target"
                    position={Position.Top}
                    isConnectable={false}
                    style={{ background: data.color }}
                />
            )}
            <div
                // className="truncate w-full"
                style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                }}
            >
                {data.label}
            </div>
            {data.hasChildren && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    isConnectable={false}
                    style={{ background: data.color }}
                />
            )}
        </div>
    );
};
