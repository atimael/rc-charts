import {Background, Controls, Handle, ReactFlow, useEdgesState, useNodesState} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {useMemo} from "react";

const nodeWidth = 150;
const nodeHeight = 60;
const verticalSpacing = 100;
const horizontalSpacing = 200;
const initialX = 400; // Starting x position for the root
const initialY = 50;  // Starting y position for the root

const edges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e1-3', source: '1', target: '3', },
    { id: 'e2-4', source: '2', target: '5', },
    { id: 'e3-5', source: '3', target: '4', },
];

// const nodes = [
//     {
//         id: '1',
//         type: 'custom',
//         data: { label: 'Root Node', backgroundColor: '#ffcc00', isRoot: true },
//         position: { x: 400, y: 50 },
//     },
//     {
//         id: '2',
//         type: 'custom',
//         data: { label: 'Child 1', backgroundColor: '#ccffcc' },
//         position: { x: 300, y: 150 },
//     },
//     {
//         id: '3',
//         type: 'custom',
//         data: { label: 'Child 2', backgroundColor: '#ccffcc' },
//         position: { x: 500, y: 150 },
//     },
//     {
//         id: '4',
//         type: 'custom',
//         data: { label: 'Child 3', backgroundColor: '#ccffcc' },
//         position: { x: 600, y: 250 },
//     },
//     {
//         id: '5',
//         type: 'custom',
//         data: { label: 'Child 4', backgroundColor: '#ccffcc' },
//         position: { x: 200, y: 250 },
//     },
// ];


const hierarchicalData = {
    name: 'root',
    children: [
        {
            name: '777323',
            children: [
                {
                    name: 'Play | Call Monitor',
                    children: [
                        {
                            name: 'Check ANI | Check Bill ph...',
                            children: [
                                {
                                    name: 'Exit Point | Contact not available',
                                    children: [
                                        {
                                            name: 'Get Value | Get you Bill',
                                            children: [
                                                { name: 'Caller | Hangup' },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: '7773',
            children: [
                {
                    name: 'Play | Call Monitor',
                    children: [
                        {
                            name: 'Check ANI | Check Bill phone number',
                            children: [
                                {
                                    name: 'Exit Point | Contact not available',
                                    children: [
                                        {
                                            name: 'Get Value | Get you Bill',
                                            children: [
                                                { name: 'Caller | Hangup' },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        ]
}

const traverseHierarchy = (
    node,
    position,
    nodes = [],
    edges = [],
    parentId = null,
    branchOffset = 0
) => {
    const currentId = node.name; // Unique identifier based on the name

    // Add the current node
    nodes.push({
        id: currentId,
        type: 'custom',
        data: { label: node.name, hasChildren: !!node.children?.length },
        position: { ...position, x: position.x + branchOffset },
    });

    // If the node has a parent, create an edge connecting it
    if (parentId) {
        edges.push({
            id: `e${parentId}-${currentId}`,
            source: parentId,
            target: currentId,
            type: 'smoothstep',
        });
    }

    // Position child nodes vertically beneath the current node
    if (node.children) {
        node.children.forEach((child, index) => {
            const newPosition = {
                x: position.x,
                y: position.y + (index + 1) * verticalSpacing + nodeHeight,
            };
            traverseHierarchy(child, newPosition, nodes, edges, currentId, branchOffset);
        });
    }

    return { nodes, edges };
};

// Adjust the root level branch offsets to fan out the root branches
const traverseBranches = (data, initialPosition) => {
    let nodes = [];
    let edges = [];
    let currentBranchOffset = 0;

    // Traverse each top-level branch
    data.children.forEach((branch) => {
        const { nodes: branchNodes, edges: branchEdges } = traverseHierarchy(
            branch,
            initialPosition,
            [],
            [],
            data.name,
            currentBranchOffset
        );

        nodes = [...nodes, ...branchNodes];
        edges = [...edges, ...branchEdges];

        currentBranchOffset += horizontalSpacing; // Separate branches horizontally
    });

    return { nodes, edges };
};

export const TreeNode = ({ data }: any) => {
    return (
        <div
            style={{
                padding: '10px',
                border: '1px solid #333',
                borderRadius: '5px',
                backgroundColor: data.backgroundColor || 'white',
                width: nodeWidth,
                textAlign: 'center',
            }}
        >
            {data.label}
            <Handle type="target" position="top" style={{ background: '#555' }} />
            {data.hasChildren && (
                <Handle type="source" position="bottom" style={{ background: '#555' }} />
            )}
        </div>
    );
    // return <div
    //     style={{
    //         padding: '10px',
    //         border: '1px solid #333',
    //         borderRadius: '5px',
    //         backgroundColor: data.backgroundColor || 'white',
    //         width: nodeWidth,
    //         textAlign: 'center',
    //     }}
    // >
    {/*{data.label}*/}
    {/*/!* Add a handle for only the source at the bottom *!/*/}
    {/*{data.isRoot && (*/}
    {/*    <Handle*/}
    {/*        type="source"*/}
    {/*        position="bottom"*/}
    {/*        style={{ background: '#555' }}*/}
    {/*    />*/}
    {/*)}*/}
    {/*/!* Add a handle for only the target at the top *!/*/}
    {/*{!data.isRoot && (*/}
    {/*    <Handle*/}
    {/*        type="target"*/}
    {/*        position="top"*/}
    {/*        style={{ background: '#555' }}*/}
    {/*    />*/}
    {/*)}*/}
    {/*{!data.isRoot && (*/}
    {/*    <Handle*/}
    {/*        type="source"*/}
    {/*        position="bottom"*/}
    {/*        style={{ background: '#555' }}*/}
    {/*    />*/}
    {/*)}*/}
    {/*</div>*/}
}

const nodeTypes = { custom: TreeNode }

export const TreeChartOld = () => {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    // Traverse the hierarchical structure and generate nodes and edges
    useMemo(() => {
        const rootNode = {
            id: 'root',
            type: 'custom',
            data: { label: 'root', hasChildren: true },
            position: { x: initialX, y: initialY },
        };

        const { nodes: branchNodes, edges: branchEdges } = traverseBranches(
            hierarchicalData,
            { x: initialX, y: initialY + verticalSpacing }
        );

        setNodes([rootNode, ...branchNodes]);
        setEdges(branchEdges);
    }, []);

    return (
        <div style={{ height: '100vh', backgroundColor: 'white' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
            />
        </div>
    );
};

// export const TreeChart = () => {
//     return <ReactFlow nodes={nodes} edges={edges} nodeTypes={{ custom: TreeNode }} fitView>
//         <Background color="transparent"/>
//         <Controls />
//     </ReactFlow>
// }

