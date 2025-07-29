import React, { useState, useEffect, useRef, useMemo, type FC } from 'react';
import * as d3 from 'd3';
import { Sparkles, Mic, MessageSquare, Puzzle, BookOpen, PenTool, Target, Clock, Repeat, ListChecks, LoaderCircle, AlertTriangle } from 'lucide-react';

// --- TYPE DEFINITIONS --- //

interface FeatureNode {
  id: string; // Unique identifier for the node
  title: string; // Display title
  description: string;
  level: 'Easy' | 'Medium' | 'Hard';
  category: 'Speaking' | 'Vocabulary' | 'Grammar' | 'Puzzles' | 'Pronunciation' | 'Story';
  details: {
    time?: string;
    reps?: number;
    topic?: string;
    words?: number;
    score?: string;
    task?: string;
  }
}

interface GraphNode extends d3.SimulationNodeDatum, FeatureNode {}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

// --- DATA & CONFIGURATION --- //

const ALL_FEATURES: FeatureNode[] = [
  // Speaking
  { id: 'sp-e', title: 'Speaking Practice (Easy)', description: 'Speak on a simple, familiar topic to build confidence and fluency.', level: 'Easy', category: 'Speaking', details: { time: '1 minute/session', reps: 3, topic: 'Your favorite food' } },
  { id: 'sp-m', title: 'Speaking Practice (Medium)', description: 'Speak on a more abstract topic, focusing on structure and vocabulary.', level: 'Medium', category: 'Speaking', details: { time: '3 minutes/session', reps: 2, topic: 'The pros and cons of social media' } },
  { id: 'sp-h', title: 'Speaking Practice (Hard)', description: 'Deliver a structured speech with minimal preparation.', level: 'Hard', category: 'Speaking', details: { time: '5 minutes/session', reps: 2, topic: 'The future of artificial intelligence' } },
  { id: 'ca-e', title: 'Conversational AI (Easy)', description: 'Have a simple Q&A chat with the AI on daily topics.', level: 'Easy', category: 'Speaking', details: { time: '5 minutes', topic: 'The weather or your hobbies' } },
  { id: 'ca-m', title: 'Conversational AI (Medium)', description: 'Engage in a goal-oriented conversation with the AI.', level: 'Medium', category: 'Speaking', details: { time: '10 minutes', topic: 'Planning a weekend trip' } },
  { id: 'ca-h', title: 'Conversational AI (Hard)', description: 'Debate a complex topic with the AI, which will challenge your arguments.', level: 'Hard', category: 'Speaking', details: { time: '10 minutes', topic: 'Is space exploration worth the cost?' } },

  // Pronunciation
  { id: 'pm-e', title: 'Pronunciation Mirror (Easy)', description: 'Practice single-syllable words to master basic sounds.', level: 'Easy', category: 'Pronunciation', details: { words: 20, score: '85%+' } },
  { id: 'pm-m', title: 'Pronunciation Mirror (Medium)', description: 'Practice multi-syllable words to improve intonation and stress.', level: 'Medium', category: 'Pronunciation', details: { words: 30, score: '90%+' } },
  { id: 'pm-h', title: 'Pronunciation Mirror (Hard)', description: 'Practice complex sentences and tongue-twisters.', level: 'Hard', category: 'Pronunciation', details: { words: 15, score: '90%+', task: 'Practice 5 tongue-twisters' } },
  
  // Story Builder
  { id: 'sb-e', title: 'Story Builder (Easy)', description: 'Read a short, simple story out loud to improve your reading flow.', level: 'Easy', category: 'Story', details: { time: '5 minutes' } },
  { id: 'sb-m', title: 'Story Builder (Medium)', description: 'Read a chapter from a novel with more complex vocabulary.', level: 'Medium', category: 'Story', details: { time: '10 minutes' } },
  { id: 'sb-h', title: 'Story Builder (Hard)', description: 'Read a piece of classic literature aloud, focusing on clarity and pacing.', level: 'Hard', category: 'Story', details: { time: '15 minutes' } },

  // Vocabulary & Puzzles
  { id: 'vt-e', title: 'Vocabulary Trainer (Easy)', description: 'Learn new common words, their meanings, and spellings.', level: 'Easy', category: 'Vocabulary', details: { words: 10 } },
  { id: 'vt-m', title: 'Vocabulary Trainer (Medium)', description: 'Learn intermediate words, including synonyms and antonyms.', level: 'Medium', category: 'Vocabulary', details: { words: 20 } },
  { id: 'vt-h', title: 'Vocabulary Trainer (Hard)', description: 'Master advanced words, focusing on nuanced meanings.', level: 'Hard', category: 'Vocabulary', details: { words: 30 } },
  { id: 'ws-e', title: 'Word Scramble (Easy)', description: 'Unscramble simple 4-5 letter words.', level: 'Easy', category: 'Puzzles', details: { words: 15 } },
  { id: 'va-e', title: 'Vocabulary Arcade (Easy)', description: 'Choose the correct meaning for common words.', level: 'Easy', category: 'Puzzles', details: { words: 20 } },
  { id: 'va-m', title: 'Vocabulary Arcade (Medium)', description: 'Choose the correct synonym for intermediate-level words.', level: 'Medium', category: 'Puzzles', details: { words: 20 } },
  { id: 'va-h', title: 'Vocabulary Arcade (Hard)', description: 'Identify nuanced differences between advanced words.', level: 'Hard', category: 'Puzzles', details: { words: 25 } },
  
  // Grammar
  { id: 'gc-e', title: 'Grammar Clinic (Easy)', description: 'Get feedback on basic errors like punctuation and subject-verb agreement.', level: 'Easy', category: 'Grammar', details: { task: 'Write a 50-word paragraph about your day.' } },
  { id: 'gc-m', title: 'Grammar Clinic (Medium)', description: 'Get feedback on sentence structure, tense consistency, and style.', level: 'Medium', category: 'Grammar', details: { task: 'Write a 100-word paragraph on a given topic.' } },
  { id: 'gc-h', title: 'Grammar Clinic (Hard)', description: 'Receive comprehensive feedback on grammar, style, tone, and clarity.', level: 'Hard', category: 'Grammar', details: { task: 'Write a 250-word short essay.' } },
];

const categoryStyles = {
    Speaking:      { bg: 'bg-blue-900/80', border: 'stroke-blue-500', highlight: 'stroke-blue-300', text: 'text-blue-100', icon: 'text-blue-300', color: '#3b82f6', button: 'bg-blue-600 hover:bg-blue-500', shadow: 'shadow-blue-500/20' },
    Pronunciation: { bg: 'bg-sky-900/80', border: 'stroke-sky-500', highlight: 'stroke-sky-300', text: 'text-sky-100', icon: 'text-sky-300', color: '#0ea5e9', button: 'bg-sky-600 hover:bg-sky-500', shadow: 'shadow-sky-500/20' },
    Story:         { bg: 'bg-orange-900/80', border: 'stroke-orange-500', highlight: 'stroke-orange-300', text: 'text-orange-100', icon: 'text-orange-300', color: '#f97316', button: 'bg-orange-600 hover:bg-orange-500', shadow: 'shadow-orange-500/20' },
    Vocabulary:    { bg: 'bg-teal-900/80', border: 'stroke-teal-500', highlight: 'stroke-teal-300', text: 'text-teal-100', icon: 'text-teal-300', color: '#14b8a6', button: 'bg-teal-600 hover:bg-teal-500', shadow: 'shadow-teal-500/20' },
    Puzzles:       { bg: 'bg-amber-900/80', border: 'stroke-amber-500', highlight: 'stroke-amber-300', text: 'text-amber-100', icon: 'text-amber-300', color: '#f59e0b', button: 'bg-amber-600 hover:bg-amber-500', shadow: 'shadow-amber-500/20' },
    Grammar:       { bg: 'bg-rose-900/80', border: 'stroke-rose-500', highlight: 'stroke-rose-300', text: 'text-rose-100', icon: 'text-rose-300', color: '#f43f5e', button: 'bg-rose-600 hover:bg-rose-500', shadow: 'shadow-rose-500/20' },
};

const defaultStyle = { bg: 'bg-gray-900/80', border: 'stroke-gray-500', highlight: 'stroke-gray-300', text: 'text-gray-100', icon: 'text-gray-300', color: '#9ca3af', button: 'bg-gray-600 hover:bg-gray-500', shadow: 'shadow-gray-500/20' };


// --- NEW: Fallback function now generates a specific "speaking" roadmap ---
const generateDefaultRoadmap = (): { nodes: GraphNode[], links: GraphLink[] } => {
    console.warn("Generating default SPEAKING roadmap due to API failure.");
    
    const easyNodes = ALL_FEATURES.filter(f => ['pm-e', 'sb-e', 'va-e', 'sp-e', 'ca-e'].includes(f.id));
    const mediumNodes = ALL_FEATURES.filter(f => ['pm-m', 'sb-m', 'va-m', 'sp-m', 'ca-m'].includes(f.id));
    const hardNodes = ALL_FEATURES.filter(f => ['pm-h', 'sb-h', 'va-h', 'sp-h', 'ca-h'].includes(f.id));
    
    const nodes = [...easyNodes, ...mediumNodes, ...hardNodes];
    
    const internalLinks: GraphLink[] = [
      { source: 'pm-e', target: 'sb-e' }, { source: 'sb-e', target: 'va-e' }, { source: 'va-e', target: 'sp-e' },
      { source: 'pm-m', target: 'sb-m' }, { source: 'sb-m', target: 'va-m' }, { source: 'va-m', target: 'sp-m' },
      { source: 'pm-h', target: 'sb-h' }, { source: 'sb-h', target: 'va-h' }, { source: 'va-h', target: 'sp-h' },
    ];
    
    const links: GraphLink[] = [...internalLinks];

    const connectLevels = (fromLevelNodes: FeatureNode[], toLevelNodes: FeatureNode[], allLinks: GraphLink[]) => {
        const fromIds = new Set(fromLevelNodes.map(n => n.id));
        const toIds = new Set(toLevelNodes.map(n => n.id));
        const sourceNodesInLevel = new Set(allLinks.filter(l => fromIds.has(l.source as string)).map(l => l.source as string));
        const leafNodes = fromLevelNodes.filter(n => !sourceNodesInLevel.has(n.id));
        const targetNodesInLevel = new Set(allLinks.filter(l => toIds.has(l.target as string)).map(l => l.target as string));
        const rootNodes = toLevelNodes.filter(n => !targetNodesInLevel.has(n.id));
        const targetConnectionNodes = rootNodes.length > 0 ? rootNodes : toLevelNodes;
        leafNodes.forEach(leaf => {
            targetConnectionNodes.forEach(root => {
                links.push({ source: leaf.id, target: root.id });
            });
        });
    };

    connectLevels(easyNodes, mediumNodes, internalLinks);
    connectLevels(mediumNodes, hardNodes, internalLinks);
    
    return { nodes: nodes as GraphNode[], links };
};

// --- UI COMPONENTS --- //

const NodeIcon: FC<{ category: FeatureNode['category'], className?: string }> = ({ category, className = "w-5 h-5" }) => {
  switch (category) {
    case 'Speaking': return <Mic className={className} />;
    case 'Pronunciation': return <Mic className={className} />;
    case 'Story': return <BookOpen className={className} />;
    case 'Vocabulary': return <Sparkles className={className} />;
    case 'Puzzles': return <Puzzle className={className} />;
    case 'Grammar': return <PenTool className={className} />;
    default: return null;
  }
};

const Node: FC<{ 
    node: GraphNode; 
    isHighlighted: boolean; 
    isDimmed: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}> = ({ node, isHighlighted, isDimmed, onClick, onMouseEnter, onMouseLeave }) => {
    const nodeWidth = 180;
    const nodeHeight = 50;
    const styles = categoryStyles[node.category] || defaultStyle;
    return (
        <g transform={`translate(${node.x! - nodeWidth / 2}, ${node.y! - nodeHeight / 2})`} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`cursor-pointer group transition-opacity duration-300 ${isDimmed ? 'opacity-20' : 'opacity-100'}`}>
            <rect width={nodeWidth} height={nodeHeight} rx={12} ry={12} className={`${styles.bg} backdrop-blur-sm transition-all duration-300 group-hover:brightness-125`} strokeWidth={isHighlighted ? 3.5 : 2.5} stroke={isHighlighted ? styles.highlight : styles.border} />
            <foreignObject x="10" y="10" width="30" height="30">
                 <NodeIcon category={node.category} className={`${styles.icon} w-6 h-6`} />
            </foreignObject>
            <foreignObject x="45" y="0" width={nodeWidth - 55} height={nodeHeight}>
                <div className={`w-full h-full flex items-center justify-start font-bold text-sm select-none p-1 ${styles.text}`}>
                    <p className="leading-tight">{node.title}</p>
                </div>
            </foreignObject>
        </g>
    );
};


// --- MAIN APP COMPONENT --- //
const RoadmapGraph: FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink>>();
  const [prompt, setPrompt] = useState('I want to improve speaking skills');
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[], links: GraphLink[] }>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const nodeWidth = 180;
  const nodeHeight = 50;
  const collisionRadius = Math.sqrt(Math.pow(nodeWidth / 2, 2) + Math.pow(nodeHeight / 2, 2)) + 25;

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    setApiError(false);
    setGraphData({ nodes: [], links: [] });

    const apiPrompt = `
      Based on the user's request: "${prompt}", create a personalized learning roadmap.
      You must use the following available features:
      ${JSON.stringify(ALL_FEATURES, null, 2)}
      Your task is to select the most relevant features and structure them into a logical learning path with three levels: 'Easy', 'Medium', and 'Hard'.
      - Create a clear progression. For example, a pronunciation task should come before a speaking task.
      - Connect the levels. The final tasks of one level should link to the starting tasks of the next level.
      - Ensure the output is a valid JSON object following the provided schema.
      - Only include nodes from the provided feature list. Do not invent new nodes.
      - The 'nodes' array should contain the feature objects you've selected.
      - The 'links' array should define the connections between them using their 'id' fields for 'source' and 'target'.
    `;

    const schema = {
      type: "OBJECT",
      properties: {
        nodes: { type: "ARRAY", items: { type: "OBJECT", properties: { id: { type: "STRING" }, title: { type: "STRING" }, description: { type: "STRING" }, level: { type: "STRING", enum: ["Easy", "Medium", "Hard"] }, category: { type: "STRING", enum: ["Speaking", "Vocabulary", "Grammar", "Puzzles", "Pronunciation", "Story"] }, details: { type: "OBJECT", properties: { time: { type: "STRING" }, reps: { type: "NUMBER" }, topic: { type: "STRING" }, words: { type: "NUMBER" }, score: { type: "STRING" }, task: { type: "STRING" }, } } }, }, },
        links: { type: "ARRAY", items: { type: "OBJECT", properties: { source: { type: "STRING" }, target: { type: "STRING" }, }, }, },
      },
    };
    
    try {
        const chatHistory = [{ role: "user", parts: [{ text: apiPrompt }] }];
        const payload = { contents: chatHistory, generationConfig: { responseMimeType: "application/json", responseSchema: schema, } };
        const apiKey = "AIzaSyD5iqa5qob2i1RKrjjrJdhN99w2tpWiprE"; // Leave empty
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { throw new Error(`API request failed with status ${response.status}`); }
        const result = await response.json();
        
        if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
            const jsonText = result.candidates[0].content.parts[0].text;
            const parsedData = JSON.parse(jsonText);
            const nodes = parsedData.nodes.map((n: any) => ({...n}));
            const links = parsedData.links.map((l: any) => ({...l}));
            setGraphData({ nodes, links });
        } else {
            throw new Error("No valid content received from API");
        }
    } catch (error) {
        console.error("Error generating roadmap:", error);
        setApiError(true);
        const defaultData = generateDefaultRoadmap();
        const nodes = defaultData.nodes.map((n: any) => ({...n}));
        const links = defaultData.links.map((l: any) => ({...l}));
        setGraphData({ nodes, links });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => { handleGenerateRoadmap(); }, []);

  useEffect(() => {
    if (!svgRef.current || graphData.nodes.length === 0) return;
    const svgElement = svgRef.current;
    const { width, height } = svgElement.getBoundingClientRect();
    const levelYPosition = (level: 'Easy' | 'Medium' | 'Hard') => {
        if (level === 'Easy') return height * 0.2;
        if (level === 'Medium') return height * 0.5;
        return height * 0.8;
    };
    simulationRef.current = d3.forceSimulation<GraphNode>(graphData.nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(graphData.links).id(d => d.id).distance(130).strength(0.8))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('x', d3.forceX(width / 2).strength(0.15))
      .force('y', d3.forceY<GraphNode>(d => levelYPosition(d.level)).strength(1))
      .force('collide', d3.forceCollide(collisionRadius));
      
    const ticked = () => { setGraphData(currentData => ({ ...currentData })); };
    simulationRef.current.on('tick', ticked);
    
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.2, 2]).on('zoom', event => {
        d3.select(svgElement).select('g.content').attr('transform', event.transform.toString());
    });
    d3.select(svgElement).call(zoomBehavior);
    
    return () => { simulationRef.current?.stop(); };
  }, [graphData.nodes.length]);

  const { highlightedNodes, highlightedLinks } = useMemo(() => {
    const nodes = new Set<string>();
    const links = new Set<string>();
    if (hoveredNodeId) {
        nodes.add(hoveredNodeId);
        graphData.links.forEach(link => {
            const sourceId = (link.source as GraphNode).id;
            const targetId = (link.target as GraphNode).id;
            if (sourceId === hoveredNodeId) {
                nodes.add(targetId);
                links.add(`${sourceId}-${targetId}`);
            }
            if (targetId === hoveredNodeId) {
                nodes.add(sourceId);
                links.add(`${sourceId}-${targetId}`);
            }
        });
    }
    return { highlightedNodes: nodes, highlightedLinks: links };
  }, [hoveredNodeId, graphData.links]);

  const modalStyles = selectedNode ? (categoryStyles[selectedNode.category] || defaultStyle) : {};

  return (
    <div className="w-screen h-screen bg-gray-900 text-white relative overflow-hidden font-sans flex flex-col">
      <style>{`
        .hero-pattern { background-color: #111827; opacity: 1; background-image: radial-gradient(#4b5563 0.5px, #111827 0.5px); background-size: 10px 10px; }
        .link-glow { filter: drop-shadow(0 0 4px rgba(252, 211, 77, 0.8)); }
      `}</style>
      <div className="absolute top-0 left-0 right-0 p-4 bg-gray-900/50 backdrop-blur-sm z-20 flex flex-col items-center gap-2 border-b border-gray-700/50">
        <div className="flex items-center justify-center gap-4 w-full max-w-2xl">
            <div className="flex-grow flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3">
              <Sparkles className="text-gray-500" />
              <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerateRoadmap()} placeholder="e.g., I want to improve my writing" className="w-full bg-transparent p-3 focus:outline-none" disabled={isLoading} />
            </div>
            <button onClick={handleGenerateRoadmap} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed" disabled={isLoading}>
              {isLoading && <LoaderCircle className="animate-spin" />}
              {isLoading ? 'Generating...' : 'Generate Roadmap'}
            </button>
        </div>
        {apiError && (
            <div className="mt-2 text-yellow-400 bg-yellow-900/50 border border-yellow-600/50 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                AI generation failed. Showing a default speaking improvement roadmap.
            </div>
        )}
      </div>

      <div className="flex-grow w-full h-full pt-28 hero-pattern">
        {isLoading && graphData.nodes.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <LoaderCircle className="w-12 h-12 animate-spin mb-4" />
                <p className="text-lg">Generating your personalized roadmap...</p>
            </div>
        )}
        <svg ref={svgRef} className={`w-full h-full transition-opacity duration-500 ${isLoading ? 'opacity-30' : 'opacity-100'}`}>
          <defs>
            {Object.entries(categoryStyles).map(([category, styles]) => (
              <marker key={`arrowhead-${category}`} id={`arrowhead-${category}`} viewBox="-0 -5 10 10" refX={23} refY={0} orient="auto" markerWidth={6} markerHeight={6} xoverflow="visible">
                <path d="M 0,-5 L 10 ,0 L 0,5" fill={styles.color} stroke="none"></path>
              </marker>
            ))}
            <marker id="arrowhead-highlighted" viewBox="-0 -5 10 10" refX={23} refY={0} orient="auto" markerWidth={7} markerHeight={7} xoverflow="visible">
              <path d="M 0,-5 L 10 ,0 L 0,5" fill="#facc15" stroke="none"></path>
            </marker>
          </defs>
          <g className="content">
            {graphData.links.map((link, i) => {
              const sourceNode = link.source as GraphNode;
              const targetNode = link.target as GraphNode;
              const linkId = `${sourceNode.id}-${targetNode.id}`;
              const isHighlighted = highlightedLinks.has(linkId);
              const isDimmed = hoveredNodeId !== null && !isHighlighted;
              const pathData = `M${sourceNode.x},${sourceNode.y}A0,0 0 0,1 ${targetNode.x},${targetNode.y}`;
              const sourceColor = (categoryStyles[sourceNode.category] || defaultStyle).color;
              
              return <path key={`${linkId}-${i}`} d={pathData} fill="none" className={`transition-all duration-300 ${isHighlighted ? 'link-glow' : ''} ${isDimmed ? 'opacity-10' : 'opacity-60'}`} stroke={isHighlighted ? '#facc15' : sourceColor} strokeWidth={isHighlighted ? 3.5 : 2.5} markerEnd={isHighlighted ? 'url(#arrowhead-highlighted)' : `url(#arrowhead-${sourceNode.category})`} />;
            })}
            {graphData.nodes.map(node => (<Node key={node.id} node={node} isHighlighted={highlightedNodes.has(node.id)} isDimmed={hoveredNodeId !== null && !highlightedNodes.has(node.id)} onClick={() => setSelectedNode(node)} onMouseEnter={() => setHoveredNodeId(node.id)} onMouseLeave={() => setHoveredNodeId(null)} />))}
          </g>
        </svg>
      </div>

      {selectedNode && (
        <div className={`absolute inset-0 bg-black/60 flex justify-center items-center z-30 p-4`} onClick={() => setSelectedNode(null)}>
          <div className={`bg-gray-800 p-6 rounded-xl max-w-md w-full text-white border-2 shadow-2xl ${modalStyles.border} ${modalStyles.shadow}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
                <NodeIcon category={selectedNode.category} className={`w-8 h-8 ${modalStyles.text}`} />
                <h2 className={`text-2xl font-bold ${modalStyles.text}`}>{selectedNode.title}</h2>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">{selectedNode.description}</p>
            
            <div className="space-y-2 text-gray-200 border-t border-gray-700 pt-4">
              {selectedNode.details.task && <div className="flex items-center gap-3"><ListChecks className={`w-5 h-5 ${modalStyles.text}`} /><p><span className="font-semibold">Task:</span> {selectedNode.details.task}</p></div>}
              {selectedNode.details.topic && <div className="flex items-center gap-3"><MessageSquare className={`w-5 h-5 ${modalStyles.text}`} /><p><span className="font-semibold">Topic:</span> {selectedNode.details.topic}</p></div>}
              {selectedNode.details.time && <div className="flex items-center gap-3"><Clock className={`w-5 h-5 ${modalStyles.text}`} /><p><span className="font-semibold">Time:</span> {selectedNode.details.time}</p></div>}
              {selectedNode.details.reps && <div className="flex items-center gap-3"><Repeat className={`w-5 h-5 ${modalStyles.text}`} /><p><span className="font-semibold">Repetitions:</span> {selectedNode.details.reps}</p></div>}
              {selectedNode.details.words && <div className="flex items-center gap-3"><Sparkles className={`w-5 h-5 ${modalStyles.text}`} /><p><span className="font-semibold">Words:</span> {selectedNode.details.words}</p></div>}
              {selectedNode.details.score && <div className="flex items-center gap-3"><Target className={`w-5 h-5 ${modalStyles.text}`} /><p><span className="font-semibold">Target Score:</span> {selectedNode.details.score}</p></div>}
            </div>

            <button onClick={() => setSelectedNode(null)} className={`mt-6 w-full text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 ${modalStyles.button}`}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapGraph;
