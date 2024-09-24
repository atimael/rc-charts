import { TraverseOptions } from "../types.js";

const position = { x: 0, y: 0 };
const edgeType = "smoothstep";
const colors = [
    "#1f77b4", // blue
    "#ff7f0e", // orange
    "#2ca02c", // green
    "#d62728", // red
    "#9467bd", // purple
    "#8c564b", // brown
    "#e377c2", // pink
    "#7f7f7f", // gray
    "#bcbd22", // olive
    "#17becf", // cyan
];
let nodeId = 0;

export const traverseTree = ({
    node,
    parentId = null,
    depth = 0,
    nodes = [],
    edges = [],
    ancestorAtDepth1 = null,
    color = null,
    childIndex = 0,
}: TraverseOptions) => {
    const id = `${nodeId++}`;

    // Keep track of the ancestor at depth 1
    if (depth === 1) {
        ancestorAtDepth1 = id;
        color = colors[childIndex % colors.length];
    }

    nodes.push({
        id,
        type: depth === 0 ? "root" : depth === 1 ? "circle" : "leaf",
        data: {
            label: node.name ?? "",
            hasChildren: !!node.children?.length,
            depth,
            color,
        },
        position,
        depth,
        ancestorAtDepth1,
    });

    if (parentId !== null) {
        edges.push({
            id: `e${parentId}-${id}`,
            source: parentId,
            target: id,
            type: depth === 1 ? "bezier" : edgeType,
            style: {
                strokeWidth: 4,
                stroke: color || "#000",
            },
        });
    }

    if (node.children) {
        node.children.forEach((child, index) => {
            traverseTree({
                node: child,
                parentId: id,
                depth: depth + 1,
                nodes,
                edges,
                ancestorAtDepth1,
                color,
                childIndex: depth === 0 ? index : childIndex,
            });
        });
    }

    return { nodes, edges };
};
