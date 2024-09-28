import { ReactFlow, ConnectionLineType, Handle, Position } from "@xyflow/react";
import dagre from "dagre";
import { treeData } from "./tree-chart-data.tsx";

import "@xyflow/react/dist/style.css";

// Your tree data

const position = { x: 0, y: 0 };
const edgeType = "smoothstep";
const nodeWidth = 172;
const nodeHeight = 44;

let nodeId = 0;

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

// Function to traverse the tree data
function traverseTree(
  node,
  parentId = null,
  depth = 0,
  nodes = [],
  edges = [],
  ancestorAtDepth1 = null,
  color: string | null = null,
  childIndex: number = 0,
) {
  const id = `${nodeId++}`;

  // Keep track of the ancestor at depth 1
  if (depth === 1) {
    ancestorAtDepth1 = id;
    color = colors[childIndex % colors.length];
  }

  console.log("ID", id);

  nodes.push({
    id,
    type: depth === 0 ? "dot" : depth === 1 ? "circle" : "custom",
    data: {
      label: node.name,
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
      type: depth === 1 ? ConnectionLineType.Bezier : edgeType,
      style: {
        strokeWidth: 4,
        stroke: color || "#000",
      },
    });
  }

  if (node.children) {
    node.children.forEach((child, index) => {
      traverseTree(
        child,
        id,
        depth + 1,
        nodes,
        edges,
        ancestorAtDepth1,
        color,
        depth === 0 ? index : childIndex,
      );
    });
  }

  return { nodes, edges };
}

const { nodes: initialNodes, edges: initialEdges } = traverseTree(treeData);

// Function to layout the elements using dagre
const getLayoutedElements = (nodes, edges, direction = "TB") => {
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
      targetPosition: node.data.depth === 0
        ? undefined
        : Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - width / 2,
        y: (nodeWithPosition.y - height / 2) - (node.depth === 0 ? 200 : node.depth < 2 ? 100 : 0),
      },
    };
  });

  // Create a mapping from ancestorAtDepth1 to x position
  const ancestorXPositions = {};
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

const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);

const CircleNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  return (
    <div
      className={`w-[172px] h-[44px] p-2 bg-white border border-gray-500 rounded-full flex items-center justify-center text-center`}
      style={{ backgroundColor: data.color || "#ffffff" }}
    >
      {data.depth !== 0 && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={false}
          style={{ background: data.color }}
        />
      )}
      <div className="truncate w-full">{data.label}</div>
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

const TreeNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  console.log("WTF", [data, data.depth, data.hasChildren, data.label]);
  return (
    <div
      className={`w-[172px] h-[44px] p-2  border border-gray-500 rounded flex items-center justify-center text-center`}
      style={{ backgroundColor: data.color || "#ffffff" }}
    >
      {data.depth !== 0 && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={false}
          style={{ background: data.color }}

        />
      )}
      <div className="truncate w-full text-xs">{data.label}</div>
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

const DotNode = ({ data }) => {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        position: "relative",
      }}
    >
      <Handle
        className="bg-transparent "
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </div>
  );
};

const nodeTypes = { custom: TreeNode, circle: CircleNode, dot: DotNode};

const LayoutFlow = () => {
  return (
    <div className="w-full h-screen cursor-default">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        draggable={false}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      />
    </div>
  );
};

export default LayoutFlow;
