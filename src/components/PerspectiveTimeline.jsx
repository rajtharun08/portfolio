import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { playHoverBeep, playClickTick } from './AudioSynthesizer';
import { GraduationCap, Layers, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const ED_DATA = [
  {
    id: 0,
    year: "2023-27",
    title: "B Tech in Computer Science & Business Systems",
    institution: "Panimalar Engineering College",
    details: "CGPA: 8.75/10 | Specializing in business-oriented tech pipelines, financial analytics, and software architecture.",
    icon: <GraduationCap size={22} />,
    color: "#a78bfa", // Claude Purple
  },
  {
    id: 1,
    year: "2022-23",
    title: "Higher Secondary XII",
    institution: "SKNS PMC Vivekananda Vidyalaya",
    details: "Percentage: 83% | Math-Computer Science stream. Built base algorithmic logical foundations.",
    icon: <Layers size={22} />,
    color: "#e2d5c3", // Claude Cream
  },
  {
    id: 2,
    year: "2020-21",
    title: "Secondary School X",
    institution: "SKNS PMC Vivekananda Vidyalaya",
    details: "Percentage: 82% | Focus on primary science, programming, and mathematical sciences.",
    icon: <BookOpen size={22} />,
    color: "#a1a1aa", // Zinc Gray
  }
];

const PerspectiveTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextCard = () => {
    playClickTick();
    setActiveIndex((prev) => (prev + 1) % ED_DATA.length);
  };

  const prevCard = () => {
    playClickTick();
    setActiveIndex((prev) => (prev - 1 + ED_DATA.length) % ED_DATA.length);
  };

  return (
    <div className="relative w-full max-w-[650px] h-[380px] mx-auto flex flex-col justify-between items-center select-none pt-8">
      {/* 3D Curved Stack Container */}
      <div 
        className="relative w-full h-[280px] flex items-center justify-center"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
      >
        {ED_DATA.map((card, index) => {
          // Calculate relative position difference
          let diff = index - activeIndex;
          
          // Wrap indices for loop logic
          if (diff < -1) diff += ED_DATA.length;
          if (diff > 1) diff -= ED_DATA.length;

          const isActive = diff === 0;

          // Trigonometric mapping along a 3D circular arc in depth
          const angle = diff * 0.72; // Arc spacing angle
          const rad = 240; // Arc radius
          
          const translateX = Math.sin(angle) * rad;
          const translateZ = -Math.abs(Math.sin(angle * 0.5)) * 140 - (isActive ? 0 : 50);
          const rotateY = -diff * 35; // Tilt cards away from camera
          
          const scale = isActive ? 1.0 : 0.85;
          const opacity = isActive ? 1.0 : 0.15;
          const zIndex = isActive ? 30 : 10;

          return (
            <motion.div
              key={card.id}
              className="absolute w-[290px] md:w-[350px] h-[220px] rounded-3xl p-6 glass-panel flex flex-col justify-between border cursor-pointer select-none"
              style={{
                transformStyle: "preserve-3d",
                zIndex,
                transformPerspective: 1200
              }}
              animate={{
                rotateY,
                x: translateX,
                z: translateZ,
                scale,
                opacity,
                borderColor: isActive ? card.color : "rgba(255,255,255,0.06)",
                boxShadow: isActive 
                  ? `0 15px 35px -5px rgba(0, 0, 0, 0.4), 0 0 25px -5px ${card.color}44` 
                  : "0 10px 20px rgba(0,0,0,0.2)",
              }}
              transition={{
                type: 'spring',
                stiffness: 140,
                damping: 18
              }}
              onClick={() => { playClickTick(); setActiveIndex(index); }}
              onMouseEnter={() => !isActive && playHoverBeep()}
            >
              {/* Card Corner HUD details */}
              <div className="absolute top-3 left-3 text-[8px] font-mono text-slate-500">// LEVEL_0{index + 1}</div>
              <div className="absolute top-3 right-3 text-[8px] font-mono text-slate-500">[{card.year}]</div>

              <div className="flex items-center gap-4 mt-2">
                <div 
                  className="p-3 rounded-2xl text-white transition-all shadow-md"
                  style={{
                    backgroundColor: `${card.color}22`,
                    border: `1.5px solid ${card.color}`,
                    boxShadow: `0 0 10px ${card.color}33`
                  }}
                >
                  {card.icon}
                </div>
                <div className="text-left">
                  <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: card.color }}>
                    {card.year}
                  </span>
                  <h3 className="text-md md:text-lg font-black italic text-white leading-tight font-display mt-0.5">
                    {card.title}
                  </h3>
                </div>
              </div>

              <div className="text-left mt-3 flex-1 flex flex-col justify-center">
                <p className="text-slate-400 text-xs font-semibold leading-relaxed font-sans not-italic tracking-normal">
                  {card.details}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">
                  {card.institution}
                </span>
                {isActive && (
                  <motion.span 
                    className="text-[8px] font-mono text-emerald-400 tracking-wider uppercase font-black"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    ● FOCUS ACTIVE
                  </motion.span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slider Controls */}
      <div className="flex items-center gap-6 mt-4 relative z-40">
        <button 
          onClick={prevCard}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer clickable"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-mono text-xs text-slate-500 tracking-widest uppercase font-black">
          RECORD 0{activeIndex + 1} / 0{ED_DATA.length}
        </span>
        <button 
          onClick={nextCard}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer clickable"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PerspectiveTimeline;
