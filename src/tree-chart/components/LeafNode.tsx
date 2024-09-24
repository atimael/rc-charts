import { Handle, Position } from "@xyflow/react";

export const LeafNode: React.FC<{ data: any }> = ({ data }) => {
    console.log("Leaf DATA", [data, data.depth, data.hasChildren, data.label]);
    return (
        <div
            // className={`w-[172px] h-[44px] p-2  border border-gray-500 rounded flex items-center justify-center text-center`}

            style={{
                backgroundColor: data.color || "#ffffff",
                width: "172px",
                height: "44px",
                padding: "8px",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
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
                // className="truncate w-full text-xs"
                style={{
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: "12px",
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
