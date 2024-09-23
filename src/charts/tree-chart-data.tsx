const position = { x: 0, y: 0 };
const edgeType = "smoothstep";

export const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "input" },
    position,
  },
  {
    id: "2",
    data: { label: "node 2" },
    position,
  },
  {
    id: "2a",
    data: { label: "node 2a" },
    position,
  },
  {
    id: "2b",
    data: { label: "node 2b" },
    position,
  },
  {
    id: "2c",
    data: { label: "node 2c" },
    position,
  },
  {
    id: "2d",
    data: { label: "node 2d" },
    position,
  },
  {
    id: "3",
    data: { label: "node 3" },
    position,
  },
];

export const initialEdges = [
  { id: "e12", source: "1", target: "2", type: "bezier" },
  { id: "e13", source: "1", target: "3", type: "bezier" },
  { id: "e22a", source: "2", target: "2a", type: edgeType },
  { id: "e22b", source: "2", target: "2b", type: edgeType },
  { id: "e22c", source: "2", target: "2c", type: edgeType },
  { id: "e2c2d", source: "2c", target: "2d", type: edgeType },
];

export const treeData = {
  name: "root",
  children: [
    {
      name: "777323",
      children: [
        {
          name: "Play | Call Monitor",
          children: [
            {
              name: "Check ANI | Check Bill ph...",
              children: [
                {
                  name: "Exit Point | Contact not available",
                  children: [
                    {
                      name: "Get Value | Get you Bill",
                      children: [{ name: "Caller | Hangup" }],
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
      name: "7773",
      children: [
        {
          name: "Play | Call Monitor",
          children: [
            {
              name: "Check ANI | Check Bill phone number",
              children: [
                {
                  name: "Exit Point | Contact not available",
                  children: [
                    {
                      name: "Get Value | Get you Bill",
                      children: [{ name: "Caller | Hangup" }],
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
      name: "7",
      children: [
        {
          name: "Play | Call Monitor",
          children: [
            {
              name: "Check ANI | Check Bill phone number",
              children: [],
            },
          ],
        },
      ],
    },

    {
      name: "777232323",
      children: [
        {
          name: "Play | Call Monitor",
          children: [
            {
              name: "Check ANI | Check Bill phone number",
              children: [
                {
                  name: "Exit Point | Contact not available",
                  children: [
                    {
                      name: "Get Value | Get you Bill",
                      children: [{ name: "Caller | Hangup" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
