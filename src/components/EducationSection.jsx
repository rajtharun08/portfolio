import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GraduationCap, Award, BookOpen, Layers, Star } from 'lucide-react';
import { playHoverBeep, playClickTick } from './AudioSynthesizer';

const ED_DATA = [
  {
    institution: "Panimalar Engineering College",
    period: "2023 - 2027",
    degree: "B.Tech in Computer Science & Business Systems",
    metrics: { label: "CGPA", score: "8.75", max: "/10" },
    desc: "A special curriculum bridging computer engineering logic with business administration and financial analytics.",
    courses: ["Data Structures", "Algorithms", "Database Systems", "Financial Management", "Software Design"],
    colorClass: "from-accent-primary/20 to-accent-secondary/5",
    accentColor: "var(--primary-accent)",
    icon: <GraduationCap size={20} />
  },
  {
    institution: "SKNS PMC Vivekananda Vidyalaya",
    period: "2022 - 2023",
    degree: "Higher Secondary XII (HSC)",
    metrics: { label: "SCORE", score: "83", max: "%" },
    desc: "Advanced coursework focusing on mathematics, computational logic matrices, and logical physics.",
    courses: ["Mathematics", "Physics", "Computer Science", "Chemistry"],
    colorClass: "from-accent-secondary/20 to-accent-primary/5",
    accentColor: "var(--secondary-accent)",
    icon: <Layers size={20} />
  },
  {
    institution: "SKNS PMC Vivekananda Vidyalaya",
    period: "2020 - 2021",
    degree: "Secondary School X (SSLC)",
    metrics: { label: "SCORE", score: "82", max: "%" },
    desc: "Foundational secondary education with a focus on mathematical science and introduction to scripting.",
    courses: ["Basic Math", "Sciences", "English & Languages", "Social Sciences"],
    colorClass: "from-accent-primary/10 to-accent-secondary/10",
    accentColor: "var(--primary-accent)",
    icon: <BookOpen size={20} />
  }
];

// Interactive 3D Parallax Tilt Card Component
const Interactive3DCard = ({ item }) => {
  const [hovered, setHovered] = useState(false);

  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring damping
  const tiltX = useSpring(y, { stiffness: 120, damping: 18 });
  const tiltY = useSpring(x, { stiffness: 120, damping: 18 });

  // Map to angles (-10 to 10 deg)
  const rotateX = useTransform(tiltX, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(tiltY, [-0.5, 0.5], [-10, 10]);

  // Shifting glow effect overlay coordinates
  const glowX = useTransform(x, [-0.5, 0.5], ['30%', '70%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['30%', '70%']);

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalized position from -0.5 to 0.5
    const normX = (e.clientX - rect.left) / width - 0.5;
    const normY = (e.clientY - rect.top) / height - 0.5;
    
    x.set(normX);
    y.set(normY);
  };

  const handleMouseEnter = () => {
    playHoverBeep();
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={playClickTick}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      className="relative w-full glass-panel rounded-3xl border border-white/5 bg-[#0b101e]/35 p-6 flex flex-col justify-between h-[280px] overflow-hidden group select-none cursor-default transition-all duration-300 hover:border-accent-primary/25"
    >
      {/* Laser Border Overlay */}
      <div className="absolute inset-0 border-1.5 border-transparent group-hover:border-accent-primary/20 rounded-3xl pointer-events-none transition-colors" />

      {/* Dynamic light reflection glow mapping */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, rgba(255,255,255,0.4) 0%, transparent 60%)`
        }}
      />

      {/* Front Content Layered (translateZ) */}
      <div className="flex justify-between items-start" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
        <div className="flex items-center gap-3">
          <div 
            className="p-2.5 rounded-xl border text-white"
            style={{ 
              backgroundColor: `rgba(var(--primary-accent-rgb), 0.1)`, 
              borderColor: item.accentColor,
              transform: 'translateZ(15px)' 
            }}
          >
            {item.icon}
          </div>
          <div style={{ transform: 'translateZ(10px)' }}>
            <span className="text-[10px] font-mono text-text-secondary/70 tracking-widest uppercase block">{item.period}</span>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{item.institution}</h3>
          </div>
        </div>

        {/* Grade Badge Node (Fitted depth) */}
        <div 
          className="w-14 h-14 rounded-full border flex flex-col items-center justify-center bg-black/40 glow-accent-sm select-none"
          style={{ 
            borderColor: item.accentColor,
            transform: 'translateZ(45px)'
          }}
        >
          <span className="text-[7px] font-mono text-text-secondary/70 leading-none">{item.metrics.label}</span>
          <span className="text-sm font-black text-white leading-none mt-0.5">{item.metrics.score}</span>
          <span className="text-[8px] font-mono text-accent-primary leading-none mt-0.5">{item.metrics.max}</span>
        </div>
      </div>

      {/* Description */}
      <p 
        className="text-xs text-text-secondary leading-relaxed font-sans font-semibold text-left border-t border-white/5 pt-3"
        style={{ transform: 'translateZ(20px)' }}
      >
        {item.desc}
      </p>

      {/* Course modules */}
      <div 
        className="flex flex-wrap gap-1.5 mt-3"
        style={{ transform: 'translateZ(25px)' }}
      >
        {item.courses.map((course) => (
          <span
            key={course}
            className="px-2 py-0.5 rounded bg-white/5 border border-white/5 hover:border-accent-primary text-[8.5px] font-mono text-text-secondary hover:text-accent-primary uppercase transition-all duration-200 cursor-default"
          >
            {course}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const EducationSection = () => {
  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto py-2">
      <div className="text-left">
        <p className="text-xs font-mono uppercase tracking-widest text-accent-primary">// Academic Journey</p>
        <h2 className="text-3xl md:text-5xl font-black italic text-white font-display mt-1">Education</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ED_DATA.map((item, idx) => (
          <Interactive3DCard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default EducationSection;
