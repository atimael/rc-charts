// import { ReactFlow, ConnectionLineType } from "@xyflow/react";
// import dagre from "dagre";
//
// import { initialNodes, initialEdges } from "./tree-chart-data.js";
//
// import "@xyflow/react/dist/style.css";
//
// const dagreGraph = new dagre.graphlib.Graph();
// dagreGraph.setDefaultEdgeLabel(() => ({}));
//
// const nodeWidth = 172;
// const nodeHeight = 36;
//
// const getLayoutedElements = (nodes, edges, direction = "TB") => {
//   const isHorizontal = direction === "LR";
//   dagreGraph.setGraph({ rankdir: direction });
//
//   nodes.forEach((node) => {
//     dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
//   });
//
//   edges.forEach((edge) => {
//     dagreGraph.setEdge(edge.source, edge.target);
//   });
//
//   dagre.layout(dagreGraph);
//
//   const newNodes = nodes.map((node) => {
//     const nodeWithPosition = dagreGraph.node(node.id);
//     const newNode = {
//       ...node,
//       targetPosition: isHorizontal ? "left" : "top",
//       sourcePosition: isHorizontal ? "right" : "bottom",
//       // We are shifting the dagre node position (anchor=center center) to the top left
//       // so it matches the React Flow node anchor point (top left).
//       position: {
//         x: nodeWithPosition.x - nodeWidth / 2,
//         y: nodeWithPosition.y - nodeHeight / 2,
//       },
//     };
//
//     return newNode;
//   });
//
//   return { nodes: newNodes, edges };
// };
//
// const { nodes, edges } = getLayoutedElements(initialNodes, initialEdges);
//
// const LayoutFlow = () => {
//   return (
//     <ReactFlow
//       nodes={nodes}
//       edges={edges}
//       connectionLineType={ConnectionLineType.SmoothStep}
//       fitView
//     />
//   );
// };
//
// export default LayoutFlow;

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
    type: depth === 1 ? "circle" : "custom",
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
      type: edgeType,
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
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  let newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
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
          style={{ background: "#555" }}
          isConnectable={false}
        />
      )}
      <div className="truncate w-full">{data.label}</div>
      {data.hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: "#555" }}
          isConnectable={false}
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
          style={{ background: "#555" }}
          isConnectable={false}
        />
      )}
      <div className="truncate w-full">{data.label}</div>
      {data.hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: "#555" }}
          isConnectable={false}
        />
      )}
    </div>
  );
};

const nodeTypes = { custom: TreeNode, circle: CircleNode };

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
