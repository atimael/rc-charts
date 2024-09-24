export type NodeData = {
    name?: string;
    children?: NodeData[];
};

export type TreeNode = {
    id: string;
    type: string;
    data: {
        label: string;
        hasChildren: boolean;
        depth: number;
        color: string | null;
    };
    position: { x: number; y: number };
    depth: number;
    ancestorAtDepth1: string | null;
};

export type TreeEdges = {
    id: string;
    source: string;
    target: string;
    type: string;
    style: {
        strokeWidth: number;
        stroke: string;
    };
};

export type TraverseOptions = {
    node: NodeData;
    parentId?: string | null;
    depth?: number;
    nodes?: TreeNode[];
    edges?: TreeEdges[];
    ancestorAtDepth1?: string | null;
    color?: string | null;
    childIndex?: number;
};
