import { ReactFlow, ConnectionLineType, Controls } from "@xyflow/react";
import { treeData } from "./utils/mockData.js";

import { traverseTree } from "./utils/traverseTree.js";
import { CircleNode } from "./components/CircleNode.js";
import { LeafNode } from "./components/LeafNode.js";
import { RootNode } from "./components/RootNode.js";
import { getLayoutElements } from "./utils/getLayoutElements.js";

import "@xyflow/react/dist/style.css";

const nodeTypes = { leaf: LeafNode, circle: CircleNode, root: RootNode };

const { nodes: initialNodes, edges: initialEdges } = traverseTree({ node: treeData });
const { nodes, edges } = getLayoutElements(initialNodes, initialEdges);

export const TreeViewChart = () => {

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                cursor: "default",
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                draggable={false}
                panOnDrag={false}
                proOptions={{ hideAttribution: true }}
                fitView
            >
                <Controls showFitView={false} showInteractive={false} position={"bottom-right"} />
            </ReactFlow>
        </div>
    );
};
