import { Handle, Position } from "@xyflow/react";

export const RootNode = () => {
    return (
        <div
            style={{
                width: 10,
                height: 10,
                position: "relative",
            }}
        >
            <Handle
                // className="bg-transparent "
                style={{
                    background: "transparent",
                }}
                type="source"
                position={Position.Bottom}
                isConnectable={false}
            />
        </div>
    );
};
