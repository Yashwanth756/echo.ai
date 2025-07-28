import React, { useState, useEffect, useRef, type FC } from 'react';
import * as d3 from 'd3';

// --- TYPE DEFINITIONS --- //

/**
 * Defines the structure for a single node in our initial data tree.
 */
interface TreeNode {
  topic: string;
  description: string;
  children?: TreeNode[];
}

/**
 * Defines the structure for a node in the force-directed graph.
 * D3 will add x, y, vx, vy properties during simulation.
 */
interface GraphNode extends d3.SimulationNodeDatum {
  id: string; // Using topic as a unique ID
  description: string;
}

/**
 * Defines the structure for a link in the force-directed graph.
 * The source and target can be strings (IDs) or the full node objects.
 */
interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}


// --- HIERARCHICAL DATA (same as before) --- //

const treeData: TreeNode = {
  topic: 'Arrays & Hashing',
  description: 'An array is a data structure consisting of a collection of elements, each identified by at least one array index or key. Hashing involves using a hash function to map identifying values, known as keys, to corresponding values.',
  children: [
    {
      topic: 'Two Pointers',
      description: 'The two-pointers technique is a common pattern that uses two pointers to iterate through a data structure, often an array or a list, until they meet or satisfy a certain condition. It\'s efficient for problems involving sorted arrays or searching for pairs.',
      children: [
        {
          topic: 'Binary Search',
          description: 'Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you\'ve narrowed down the possible locations to just one.',
          children: [
            {
              topic: 'Trees',
              description: 'A tree is a non-linear data structure that represents a hierarchical structure. It consists of nodes connected by edges. Each tree has a root node, and all other nodes can be reached from the root.',
              children: [
                {
                  topic: 'Tries',
                  description: 'A Trie, or prefix tree, is a special type of tree used to store associative data structures. A trie stores keys that are usually strings, and is structured so that all the descendants of a node have a common prefix of the string associated with that node.'
                },
                {
                  topic: 'Heap / Priority Queue',
                  description: 'A heap is a specialized tree-based data structure that satisfies the heap property. A priority queue is an abstract data type that behaves like a regular queue but where each element has a "priority" associated with it.',
                  children: [
                    { topic: 'Intervals', description: 'Interval problems involve dealing with ranges or intervals, often requiring sorting and merging to find overlaps, intersections, or unions.' },
                    { topic: 'Greedy', description: 'A greedy algorithm is an algorithmic paradigm that makes the locally optimal choice at each stage with the hope of finding a global optimum.' }
                  ]
                },
                {
                  topic: 'Backtracking',
                  description: 'Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints of the problem at any point in time.',
                  children: [
                    {
                      topic: 'Graphs',
                      description: 'A graph is a data structure used to represent networks of interconnected nodes (vertices) and edges. They are used to model relationships between objects.',
                      children: [
                        { topic: 'Advanced Graphs', description: 'Advanced graph algorithms include concepts like Dijkstra\'s, Bellman-Ford for shortest paths, and algorithms for finding minimum spanning trees like Kruskal\'s and Prim\'s.' },
                        {
                          topic: '2-D DP',
                          description: 'Two-dimensional Dynamic Programming (DP) involves solving problems by breaking them down into smaller subproblems on a 2D grid. Solutions to subproblems are stored to avoid redundant calculations.',
                          children: [
                            { topic: 'Math & Geometry', description: 'These problems involve mathematical concepts, number theory, and geometric algorithms to solve complex computational tasks.' }
                          ]
                        }
                      ]
                    },
                    {
                      topic: '1-D DP',
                      description: 'One-dimensional Dynamic Programming (DP) is a method for solving complex problems by breaking them down into simpler, overlapping subproblems arranged in a linear sequence.',
                      children: [
                        { topic: 'Bit Manipulation', description: 'Bit manipulation involves performing operations on binary numbers at the bit level. It is used for optimizing solutions and solving specific types of problems efficiently.' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        { topic: 'Sliding Window', description: 'The sliding window technique is used for problems that involve finding a subarray or substring in a given array or string that satisfies certain conditions. A window of a fixed or variable size slides over the data.'}
      ]
    },
    {
      topic: 'Stack',
      description: 'A stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle. Elements are added (pushed) and removed (popped) from the same end, called the top.',
      children: [
        { topic: 'Linked List', description: 'A linked list is a linear data structure where elements are not stored at contiguous memory locations. The elements are linked using pointers.'}
      ]
    }
  ]
};


// --- HELPER FUNCTION --- //
const flattenData = (root: TreeNode): { nodes: GraphNode[], links: GraphLink[] } => {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];
  const nodeSet = new Set<string>();

  const topicsToConnect = ['Binary Search', 'Sliding Window', 'Linked List'];

  function traverse(node: TreeNode, parentId?: string) {
    if (!nodeSet.has(node.topic)) {
      nodeSet.add(node.topic);
      nodes.push({ id: node.topic, description: node.description });
    }

    if (parentId) {
      links.push({ source: parentId, target: node.topic });
    }
    
    if (topicsToConnect.includes(node.topic)) {
         links.push({ source: node.topic, target: 'Trees' });
    }

    if (node.children) {
      node.children.forEach(child => traverse(child, node.topic));
    }
  }

  traverse(root);
  return { nodes, links };
};


// --- REACT COMPONENT --- //

const RoadmapGraph: FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const nodeWidth = 160;
  const nodeHeight = 40;
  // Calculate a collision radius that is slightly larger than half the node's diagonal
  const collisionRadius = Math.sqrt(Math.pow(nodeWidth / 2, 2) + Math.pow(nodeHeight / 2, 2)) + 15;


  // 1. Initialize the D3 force simulation
  useEffect(() => {
    if (!svgRef.current) return;
    
    const { nodes: initialNodes, links: initialLinks } = flattenData(treeData);

    const svgElement = svgRef.current;
    const { width, height } = svgElement.getBoundingClientRect();
    
    const simulation = d3.forceSimulation<GraphNode>(initialNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(initialLinks)
        .id(d => d.id)
        .distance(150) // Increased distance
      )
      .force('charge', d3.forceManyBody().strength(-500)) // Increased repulsion
      .force('center', d3.forceCenter(width / 2, height / 2))
      // **NEW**: Add collision detection force to prevent node overlap
      .force('collide', d3.forceCollide(collisionRadius));

    simulation.on('tick', () => {
      setNodes([...simulation.nodes()]);
      setLinks([...initialLinks]);
    });

    return () => {
      simulation.stop();
    };
  }, [collisionRadius]); // Re-run if radius changes

  // 2. Setup D3 zoom behavior
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>('g.content');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', event => {
        g.attr('transform', event.transform.toString());
      });

    zoomRef.current = zoomBehavior;
    svg.call(zoomBehavior);
    
    const { width, height } = svg.node()!.getBoundingClientRect();
    const initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(0.4).translate(-width/2, -height/2);
    svg.call(zoomBehavior.transform, initialTransform);

  }, []);

  const handleNodeClick = (node: GraphNode) => setSelectedNode(node);
  const handleCloseModal = () => setSelectedNode(null);

  return (
    <div className="w-screen h-screen bg-gray-900 relative overflow-hidden font-sans">
      <svg ref={svgRef} className="w-full h-full">
        {/* **NEW**: Definition for the arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            viewBox="-0 -5 10 10"
            refX={23} // Pushes arrowhead away from node center
            refY={0}
            orient="auto"
            markerWidth={8}
            markerHeight={8}
            xoverflow="visible"
          >
            <path d="M 0,-5 L 10 ,0 L 0,5" className="fill-gray-600" stroke="none"></path>
          </marker>
        </defs>

        <g className="content">
          {/* **NEW**: Render Links as curved paths with arrowheads */}
          {links.map((link, i) => {
            const sourceNode = link.source as GraphNode;
            const targetNode = link.target as GraphNode;
            
            // Generate a curved path
            const pathData = `M${sourceNode.x},${sourceNode.y}A0,0 0 0,1 ${targetNode.x},${targetNode.y}`;

            return (
              <path
                key={`${sourceNode.id}-${targetNode.id}-${i}`}
                d={pathData}
                className="stroke-gray-600"
                strokeWidth="1.5"
                fill="none"
                markerEnd="url(#arrowhead)" // Attach the arrowhead
              />
            );
          })}

          {/* Render Nodes (unchanged) */}
          {nodes.map(node => (
            <g
              key={node.id}
              transform={`translate(${node.x! - nodeWidth / 2}, ${node.y! - nodeHeight / 2})`}
              onClick={() => handleNodeClick(node)}
              className="cursor-pointer group"
            >
              <rect
                width={nodeWidth}
                height={nodeHeight}
                rx={10}
                ry={10}
                className="fill-teal-700 stroke-teal-400 group-hover:fill-teal-600 transition-colors duration-300"
                strokeWidth={2}
              />
               <rect
                x={5}
                y={nodeHeight - 10}
                width={nodeWidth - 10}
                height={4}
                rx={2}
                ry={2}
                className="fill-teal-400"
              />
              <text
                x={nodeWidth / 2}
                y={nodeHeight / 2}
                dy=".3em"
                textAnchor="middle"
                className="fill-white text-sm font-bold select-none"
              >
                {node.id}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Modal for Selected Node (unchanged) */}
      {selectedNode && (
        <div
          className="absolute inset-0 bg-black/60 flex justify-center items-center z-10 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-gray-800 p-6 rounded-xl max-w-md w-full text-white border-2 border-teal-400 shadow-2xl shadow-teal-500/20"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-teal-300 mb-4">
              {selectedNode.id}
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {selectedNode.description}
            </p>
            <button
              onClick={handleCloseModal}
              className="mt-6 w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGraph;