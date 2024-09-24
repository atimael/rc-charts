import { TreeEdges, TreeNode } from "../types.js";
import dagre from "dagre";
import { nodeHeight, nodeWidth } from "../contants.js";
import { Position } from "@xyflow/react";

export const getLayoutElements = (nodes: TreeNode[], edges: TreeEdges[], direction = "TB") => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        const width = node.data.depth === 0 ? 10 : nodeWidth;
        const height = node.data.depth === 0 ? 10 : nodeHeight;
        dagreGraph.setNode(node.id, { width, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    let newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const width = node.data.depth === 0 ? 10 : nodeWidth;
        const height = node.data.depth === 0 ? 10 : nodeHeight;
        return {
            ...node,
            targetPosition: node.data.depth === 0 ? undefined : Position.Top,
            sourcePosition: Position.Bottom,
            position: {
                x: nodeWithPosition.x - width / 2,
                y: nodeWithPosition.y - height / 2 - (node.depth === 0 ? 200 : node.depth < 2 ? 100 : 0),
            },
        };
    });

    // Create a mapping from ancestorAtDepth1 to x position
    const ancestorXPositions: Record<string, any> = {};
    newNodes.forEach((node) => {
        if (node.depth === 1) {
            ancestorXPositions[node.id] = node.position.x;
        }
    });

    // Adjust x positions for nodes at depth >= 2 to align them under their own ancestor at depth 1
    newNodes = newNodes.map((node) => {
        if (
            node.depth >= 2 &&
            node.ancestorAtDepth1 &&
            ancestorXPositions[node.ancestorAtDepth1] !== undefined
        ) {
            return {
                ...node,
                position: {
                    x: ancestorXPositions[node.ancestorAtDepth1],
                    y: node.position.y,
                },
            };
        } else {
            return node;
        }
    });

    return { nodes: newNodes, edges };
};
