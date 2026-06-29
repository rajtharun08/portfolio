import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight, Zap, GitBranch, Terminal } from 'lucide-react';
import { playHoverBeep, playClickTick } from './AudioSynthesizer';

const EXP_DATA = [
  {
    title: 'Lead Developer & Creator',
    organization: 'GhostLink (Open-Source)',
    period: '2025',
    desc: 'Designed and engineered an automated self-destructing URL shortener system featuring click caps, administrative controls, and secure hash generation.',
    bullets: [
      'Built modular backend nodes in Python utilizing FastAPI framework',
      'Engineered automated database clean-up engines for expired links in SQLite3',
      'Implemented clean rest headers and API schemas for public consumption'
    ],
    tech: ['Python', 'FastAPI', 'SQLite3', 'REST APIs', 'Asynchronous IO'],
    accentColor: 'var(--primary-accent)',
    icon: <Terminal size={18} />
  },
  {
    title: 'Systems & Socket Engineer',
    organization: 'javDrop Utilities',
    period: '2024',
    desc: 'Created a secure peer-to-peer file transport utility operating inside local area networks using raw Java TCP socket handshakes.',
    bullets: [
      'Developed multithreaded handlers supporting simultaneous file stream chunks',
      'Engineered verified byte-payload packets verifying binary file assembly',
      'Designed configuration panel utilizing Swing and AWT layout frameworks'
    ],
    tech: ['Java', 'TCP Sockets', 'Multithreading', 'AWT / Swing'],
    accentColor: 'var(--secondary-accent)',
    icon: <Briefcase size={18} />
  },
  {
    title: 'Data & Stacks Simulator Dev',
    organization: 'LinkHist API Suite',
    period: '2024',
    desc: 'Simulated web browser back/forward page history navigation utilizing double LIFO Stack structures exposed via endpoints.',
    bullets: [
      'Constructed dual-stack arrays handling page push and pop requests',
      'Built Flask endpoints to query stack states and clear cache buffers',
      'Integrated unit validation cases verifying stack boundaries'
    ],
    tech: ['Python', 'Flask', 'DSA (Stacks)', 'Unit Tests'],
    accentColor: 'var(--primary-accent)',
    icon: <GitBranch size={18} />
  },
  {
    title: 'NLP & Crawling Systems Engineer',
    organization: 'Headlinehub Scraper',
    period: '2023',
    desc: 'Constructed news feed scrapers processing headlines from NewsAPI, running lexicon-based NLP analysis on positive/negative metrics.',
    bullets: [
      'Developed NLP keyword evaluation filters analyzing text values',
      'Built automated web crawl processes downloading headlines from NewsAPI',
      'Formulated clean tabular outputs charting crawled headlines and score averages'
    ],
    tech: ['Python', 'NewsAPI', 'NLP', 'Data Scraping'],
    accentColor: 'var(--secondary-accent)',
    icon: <Zap size={18} />
  }
];

// Interactive 3D Parallax Timeline Card
const TimelineCard = ({ item, isLeft }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tiltX = useSpring(y, { stiffness: 120, damping: 18 });
  const tiltY = useSpring(x, { stiffness: 120, damping: 18 });

  const rotateX = useTransform(tiltX, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(tiltY, [-0.5, 0.5], [-8, 8]);
  const glowX = useTransform(x, [-0.5, 0.5], ['30%', '70%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['30%', '70%']);

  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    x.set((e.clientX - rect.left) / width - 0.5);
    y.set((e.clientY - rect.top) / height - 0.5);
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

  const handleCardClick = () => {
    playClickTick();
    setExpanded(!expanded);
  };

  return (
    <div className={`relative flex flex-col md:flex-row items-start ${isLeft ? 'md:flex-row-reverse' : ''}`}>
      {/* Node indicator */}
      <div 
        className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-2 border-accent-primary bg-bg-dark -translate-x-1/2 top-3 z-10 glow-accent-sm animate-pulse"
        style={{ transform: 'translateX(-50%)' }}
      />

      <div className="hidden md:block w-1/2" />

      {/* 3D Tilt Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: 1200
        }}
        initial={{ opacity: 0, y: 35, rotateY: isLeft ? 15 : -15 }}
        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className={`w-[calc(100%-3rem)] ml-12 md:ml-0 md:w-[45%] glass-panel rounded-2xl p-5 border border-white/5 cursor-pointer hover:border-accent-primary/25 relative overflow-hidden transition-all duration-300 ${
          expanded ? 'border-accent-primary/45 bg-[#0a1122]/55' : ''
        }`}
      >
        {/* Glow reflection */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glowX.get()} ${glowY.get()}, rgba(255,255,255,0.3) 0%, transparent 60%)`
          }}
        />

        <div className="flex items-center gap-3" style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}>
          <div 
            className="p-2.5 rounded-xl border text-white"
            style={{ 
              backgroundColor: 'rgba(var(--primary-accent-rgb), 0.1)',
              borderColor: item.accentColor,
              transform: 'translateZ(15px)'
            }}
          >
            {item.icon}
          </div>

          <div style={{ transform: 'translateZ(10px)' }}>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary/70 font-mono">
              <Calendar size={12} />
              <span>{item.period}</span>
            </div>
            <h3 className="text-md md:text-lg font-black text-white font-display mt-0.5 leading-tight">{item.title}</h3>
            <p className="text-[10px] font-mono font-bold text-accent-primary tracking-wider uppercase mt-0.5">{item.organization}</p>
          </div>
        </div>

        <p 
          className="text-text-secondary text-xs mt-3 leading-relaxed font-sans font-semibold text-left"
          style={{ transform: 'translateZ(20px)' }}
        >
          {item.desc}
        </p>

        {/* Bullet details (Expanded drawer) */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden text-left"
        >
          <ul className="space-y-1.5 border-t border-white/5 mt-3 pt-3" style={{ transform: 'translateZ(15px)' }}>
            {item.bullets.map((bullet, bIdx) => (
              <li key={bIdx} className="text-xs text-text-secondary flex items-start gap-1.5">
                <span className="text-accent-primary mt-1">▪</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-1.5 mt-4" style={{ transform: 'translateZ(20px)' }}>
            {item.tech.map((t) => (
              <span 
                key={t} 
                className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-accent-primary uppercase"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Footer info drawer */}
        <div className="flex items-center justify-between border-t border-white/5 mt-4 pt-2.5 text-[9px] font-mono text-text-secondary/70">
          <span>CLICK FOR DETAILS</span>
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={12} className="text-accent-primary" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const ExperienceTimeline = () => {
  return (
    <div className="relative w-full max-w-4xl mx-auto py-8">
      {/* Center timeline connector path */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-primary via-accent-secondary to-transparent -translate-x-1/2 opacity-35" />

      <div className="space-y-12">
        {EXP_DATA.map((item, idx) => (
          <TimelineCard key={idx} item={item} isLeft={idx % 2 === 0} />
        ))}
      </div>
    </div>
  );
};

export default ExperienceTimeline;
