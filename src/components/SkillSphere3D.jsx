import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { playHoverBeep, playClickTick } from './AudioSynthesizer';
import { 
  Code2, Cpu, Database, Terminal, FileCode, Layers, GitBranch, Settings
} from 'lucide-react';

const SKILLS = [
  { name: 'Java', icon: <FileCode size={14} /> },
  { name: 'Python', icon: <FileCode size={14} /> },
  { name: 'DSA', icon: <Cpu size={14} /> },
  { name: 'Spring Boot', icon: <Layers size={14} /> },
  { name: 'FastAPI', icon: <Terminal size={14} /> },
  { name: 'React JS', icon: <Code2 size={14} /> },
  { name: 'Algorithms', icon: <Cpu size={14} /> },
  { name: 'MySQL', icon: <Database size={14} /> },
  { name: 'SQLite', icon: <Database size={14} /> },
  { name: 'Git', icon: <GitBranch size={14} /> },
  { name: 'n8n', icon: <Settings size={14} /> },
  { name: 'Maven', icon: <Settings size={14} /> }
];

const SkillSphere3D = () => {
  const containerRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0.8, y: 0.8 }); // Auto rotation velocity
  const mousePos = useRef({ x: 0, y: 0 });

  const radius = 130; // Radius of sphere
  const focalLength = 320; // Perspective focal depth

  // Generate initial coordinates on sphere using Fibonacci spiral distribution
  useEffect(() => {
    const newTags = SKILLS.map((skill, index) => {
      const k = -1 + (2 * (index + 1) - 1) / SKILLS.length;
      const phi = Math.acos(k);
      const theta = Math.sqrt(SKILLS.length * Math.PI) * phi;

      return {
        ...skill,
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        projX: 0,
        projY: 0,
        scale: 1,
        opacity: 1
      };
    });
    setTags(newTags);
  }, []);

  // Drag interaction handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    playClickTick();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      velocity.current = { x: dx * 0.05, y: dy * 0.05 };
      dragStart.current = { x: e.clientX, y: e.clientY };
    } else {
      // Gentle influence from mouse position relative to container center
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        mousePos.current = {
          x: (e.clientX - cx) * 0.005,
          y: -(e.clientY - cy) * 0.005
        };
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    let animId;
    
    const updateRotation = () => {
      // Damping velocity if not dragging
      if (!isDragging) {
        // Blend auto-rotation and mouse-hover gravity drift
        velocity.current.x += (mousePos.current.x - velocity.current.x) * 0.08;
        velocity.current.y += (-mousePos.current.y - velocity.current.y) * 0.08;
        
        // Clamp absolute velocity to prevent spinning wild
        const maxV = 2.0;
        velocity.current.x = Math.max(-maxV, Math.min(maxV, velocity.current.x));
        velocity.current.y = Math.max(-maxV, Math.min(maxV, velocity.current.y));
      }

      const radX = (velocity.current.y * Math.PI) / 360;
      const radY = (velocity.current.x * Math.PI) / 360;

      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      setTags((prevTags) =>
        prevTags.map((tag) => {
          // Rotate around Y axis
          let x1 = tag.x * cosY - tag.z * sinY;
          let z1 = tag.z * cosY + tag.x * sinY;

          // Rotate around X axis
          let y2 = tag.y * cosX - z1 * sinX;
          let z2 = z1 * cosX + tag.y * sinX;

          // Perspective Projection calculations
          const scale = focalLength / (focalLength + z2);
          
          return {
            ...tag,
            x: x1,
            y: y2,
            z: z2,
            projX: x1 * scale,
            projY: y2 * scale,
            scale: scale,
            opacity: Math.max(0.18, (focalLength - z2) / (focalLength + radius))
          };
        })
      );

      animId = updateRotation ? requestAnimationFrame(updateRotation) : null;
    };

    animId = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(animId);
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full max-w-[500px] h-[360px] mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      {/* 3D Grid backdrop details */}
      <div className="absolute w-64 h-64 rounded-full border border-emerald-500/5 pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full border border-dashed border-blue-500/5 pointer-events-none animate-spin-slow" />
      
      {/* Projected Tag items */}
      <div className="relative w-full h-full flex items-center justify-center">
        {tags.map((tag, idx) => {
          // Sort items by z-index position so elements in front render above items behind
          const zDepth = Math.round(focalLength - tag.z);
          
          return (
            <motion.div
              key={idx}
              className="absolute px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono text-[9px] font-black uppercase transition-shadow"
              style={{
                left: `calc(50% + ${tag.projX}px)`,
                top: `calc(50% + ${tag.projY}px)`,
                transform: `translate(-50%, -50%) scale(${tag.scale})`,
                opacity: tag.opacity,
                zIndex: zDepth,
                background: tag.z < 0 
                  ? 'linear-gradient(135deg, var(--card-bg) 0%, rgba(var(--primary-accent-rgb), 0.15) 100%)' 
                  : 'rgba(8,12,24,0.4)',
                borderColor: tag.z < 0 ? 'var(--primary-accent)' : 'rgba(255,255,255,0.04)',
                boxShadow: tag.z < 0 ? '0 0 14px rgba(var(--primary-accent-rgb), 0.18)' : 'none',
                color: tag.z < 0 ? '#ffffff' : 'var(--text-secondary)'
              }}
              onMouseEnter={() => playHoverBeep()}
            >
              <span className={tag.z < 0 ? 'text-accent-primary' : 'text-slate-500'}>
                {tag.icon}
              </span>
              <span>{tag.name}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillSphere3D;
