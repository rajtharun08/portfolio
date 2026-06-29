import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playHoverBeep, playClickTick } from './AudioSynthesizer';
import { 
  Code2, Cpu, Database, Terminal, FileCode, Layers, GitBranch, Settings
} from 'lucide-react';

const SKILLS = [
  // Row 0
  { id: 'java', name: 'Java', icon: <FileCode size={18} />, x: 120, y: 35, connections: ['spring', 'maven'] },
  { id: 'python', name: 'Python', icon: <FileCode size={18} />, x: 260, y: 35, connections: ['fastapi', 'sqlite'] },
  { id: 'dsa', name: 'DSA', icon: <Cpu size={18} />, x: 400, y: 35, connections: ['algo'] },
  
  // Row 1 (staggered)
  { id: 'spring', name: 'Spring Boot', icon: <Layers size={18} />, x: 50, y: 155, connections: ['mysql'] },
  { id: 'fastapi', name: 'FastAPI', icon: <Terminal size={18} />, x: 190, y: 155, connections: ['sqlite', 'mysql'] },
  { id: 'react', name: 'React JS', icon: <Code2 size={18} />, x: 330, y: 155, connections: [] },
  { id: 'algo', name: 'Algorithms', icon: <Cpu size={18} />, x: 470, y: 155, connections: [] },
  
  // Row 2
  { id: 'mysql', name: 'MySQL', icon: <Database size={18} />, x: 120, y: 275, connections: [] },
  { id: 'sqlite', name: 'SQLite', icon: <Database size={18} />, x: 260, y: 275, connections: [] },
  { id: 'git', name: 'Git', icon: <GitBranch size={18} />, x: 400, y: 275, connections: ['maven'] },
  
  // Row 3 (staggered)
  { id: 'n8n', name: 'n8n', icon: <Settings size={18} />, x: 190, y: 395, connections: [] },
  { id: 'maven', name: 'Maven', icon: <Settings size={18} />, x: 330, y: 395, connections: [] },
];

const HexGrid = () => {
  const [hoveredNode, setHoveredNode] = useState(null);

  // Helper to determine if a line path should be highlighted
  const isLineHighlighted = (fromNodeId, toNodeId) => {
    if (!hoveredNode) return false;
    return (
      hoveredNode === fromNodeId || 
      hoveredNode === toNodeId || 
      (SKILLS.find(s => s.id === hoveredNode)?.connections.includes(toNodeId) && fromNodeId === hoveredNode) ||
      (SKILLS.find(s => s.id === fromNodeId)?.connections.includes(hoveredNode) && toNodeId === hoveredNode)
    );
  };

  return (
    <div className="relative w-full max-w-[600px] h-[520px] mx-auto select-none p-4 overflow-hidden rounded-3xl bg-transparent">
      
      {/* SVG Connecting Lines Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary-accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--secondary-accent)" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {SKILLS.map((fromNode) => {
          return fromNode.connections.map((toNodeId) => {
            const toNode = SKILLS.find((s) => s.id === toNodeId);
            if (!toNode) return null;

            // Coordinates for line centers (offset to center of hexagon nodes)
            const x1 = fromNode.x + 55;
            const y1 = fromNode.y + 55;
            const x2 = toNode.x + 55;
            const y2 = toNode.y + 55;

            const active = isLineHighlighted(fromNode.id, toNode.id);

            return (
              <g key={`${fromNode.id}-${toNodeId}`}>
                {/* Background Shadow line */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255,255,255,0.02)"
                  strokeWidth="1.5"
                />
                {/* Connection line */}
                <motion.line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={active ? "url(#lineGrad)" : "rgba(255,255,255,0.08)"}
                  strokeWidth={active ? "2.5" : "1"}
                  filter={active ? "url(#glow)" : ""}
                  animate={{
                    strokeDasharray: active ? ["0,10", "10,0"] : "none",
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: "linear"
                  }}
                />
              </g>
            );
          });
        })}
      </svg>

      {/* Hexagon Nodes */}
      <div className="absolute inset-0 z-10 w-full h-full">
        {SKILLS.map((node, i) => {
          const isHighlighted = hoveredNode === node.id || 
            (hoveredNode && node.connections.includes(hoveredNode)) || 
            (hoveredNode && SKILLS.find(s => s.id === hoveredNode)?.connections.includes(node.id));

          return (
            <motion.div
              key={node.id}
              className="absolute w-[110px] h-[110px] flex items-center justify-center cursor-pointer group"
              style={{
                left: node.x,
                top: node.y,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 140,
                damping: 18,
                delay: i * 0.04
              }}
            >
              {/* Hexagon Shape Container */}
              <motion.div
                onMouseEnter={() => { setHoveredNode(node.id); playHoverBeep(); }}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={playClickTick}
                whileHover={{ scale: 1.08, y: -2 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-full h-full flex flex-col items-center justify-center text-center p-2 relative"
                style={{
                  clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
                  background: isHighlighted 
                    ? 'linear-gradient(135deg, rgba(var(--primary-accent-rgb), 0.22) 0%, rgba(var(--secondary-accent-rgb), 0.22) 100%)' 
                    : 'rgba(255,255,255,0.03)',
                  border: isHighlighted 
                    ? '1.5px solid var(--primary-accent)' 
                    : '1px solid rgba(255,255,255,0.05)',
                  boxShadow: isHighlighted ? '0 0 20px rgba(var(--primary-accent-rgb), 0.3)' : 'none',
                }}
              >
                {/* Pulsing Outer Border overlay */}
                {isHighlighted && (
                  <motion.div 
                    className="absolute inset-0 bg-white/5"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
                
                {/* Icon & Label */}
                <div className={`transition-all duration-300 ${isHighlighted ? 'text-accent-primary scale-110 drop-shadow-[0_0_8px_var(--primary-accent)]' : 'text-slate-500'}`}>
                  {node.icon}
                </div>
                <span className={`text-[10px] font-bold tracking-wide uppercase mt-1.5 transition-all duration-300 font-mono ${isHighlighted ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'text-slate-400'}`}>
                  {node.name}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HexGrid;
