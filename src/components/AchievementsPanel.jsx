import React, { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import { Trophy, Shield, Cpu, BookOpen, Star } from 'lucide-react';
import { playHoverBeep, playClickTick } from './AudioSynthesizer';

const CountUpNumber = ({ value, duration = 2.0 }) => {
  const [displayVal, setDisplayVal] = useState(0);

  useEffect(() => {
    let active = true;
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (active) setDisplayVal(Math.floor(latest));
      }
    });
    return () => {
      active = false;
      controls.stop();
    };
  }, [value, duration]);

  return <span>{displayVal}</span>;
};

const AchievementCard = ({ title, metric, description, icon, details, colorClass }) => {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    setTilt({
      x: (e.clientX - rect.left) / width - 0.5,
      y: (e.clientY - rect.top) / height - 0.5
    });
  };

  const handleFlip = () => {
    playClickTick();
    setFlipped(!flipped);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative w-full h-[220px] rounded-3xl cursor-pointer group parallax-card-container laser-border-container"
      onClick={handleFlip}
      onMouseEnter={playHoverBeep}
      style={{
        transform: `rotateX(${tilt.y * -10}deg) rotateY(${tilt.x * 10}deg)`,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {/* Active Glowing Laser Outline on Hover */}
      <div className="laser-border-path" />

      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 w-full h-full glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/5 bg-[#0b101e]/40"
          style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
        >
          <div className="flex justify-between items-start depth-bg">
            <div className={`p-2.5 rounded-xl border border-white/10 ${colorClass}`}>
              {icon}
            </div>
            <span className="text-[9px] font-mono text-text-secondary/50 uppercase tracking-widest">// CREDENTIALS</span>
          </div>

          <div className="text-left mt-2 depth-text" style={{ transformStyle: 'preserve-3d' }}>
            <span className="text-3xl font-black text-white font-display tracking-tight leading-none block text-shadow-3d" style={{ transform: 'translateZ(10px)' }}>
              {metric}
            </span>
            <h4 className="text-sm font-bold text-white mt-1 uppercase tracking-wide leading-tight" style={{ transform: 'translateZ(15px)' }}>
              {title}
            </h4>
          </div>

          <p className="text-[11px] text-text-secondary leading-normal font-sans font-semibold text-left border-t border-white/5 pt-2 depth-bg">
            {description}
          </p>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 w-full h-full glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/5 bg-[#0f182e]/85"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="flex justify-between items-center border-b border-white/5 pb-2 depth-bg">
            <span className="text-[9px] font-mono text-accent-primary uppercase tracking-widest font-black">● METRIC VALIDATED</span>
            <Trophy size={12} className="text-accent-primary" />
          </div>

          <div className="flex-1 flex flex-col justify-center text-left py-2 space-y-1 depth-text" style={{ transformStyle: 'preserve-3d' }}>
            {details.map((detail, idx) => (
              <p key={idx} className="text-[11px] text-text-secondary font-sans leading-relaxed">
                ✔ {detail}
              </p>
            ))}
          </div>

          <span className="text-[8px] font-mono text-text-secondary/50 text-right uppercase tracking-wider block depth-bg">
            CLICK TO REVERT CARD
          </span>
        </div>
      </motion.div>
    </div>
  );
};

const AchievementsPanel = () => {
  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto py-2">
      <div className="text-left">
        <p className="text-xs font-mono uppercase tracking-widest text-accent-primary">// Tracking Milestones</p>
        <h2 className="text-3xl md:text-5xl font-black italic text-white font-display mt-1 text-shadow-3d">Achievements</h2>
      </div>

      {/* Numerical metric blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between bg-[#0b101e]/30">
          <span className="text-[10px] font-mono text-text-secondary/60 uppercase tracking-widest">// ALGORITHMIC SOLVES</span>
          <div className="text-left mt-4">
            <h3 className="text-4xl font-black text-white font-display italic">
              <CountUpNumber value={300} />+
            </h3>
            <p className="text-accent-primary text-xs font-mono uppercase font-bold tracking-wide mt-1">LeetCode Solved</p>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '65%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-accent-primary rounded-full shadow-[0_0_8px_var(--primary-accent)]" 
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between bg-[#0b101e]/30">
          <span className="text-[10px] font-mono text-text-secondary/60 uppercase tracking-widest">// ACADEMIC QUALITY</span>
          <div className="text-left mt-4">
            <h3 className="text-4xl font-black text-white font-display italic">
              8.75<span className="text-lg text-text-secondary">/10</span>
            </h3>
            <p className="text-accent-primary text-xs font-mono uppercase font-bold tracking-wide mt-1">Undergrad CGPA</p>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '87.5%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-accent-secondary rounded-full shadow-[0_0_8px_var(--secondary-accent)]" 
            />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/5 flex flex-col justify-between bg-[#0b101e]/30">
          <span className="text-[10px] font-mono text-text-secondary/60 uppercase tracking-widest">// GLOBAL RATING</span>
          <div className="text-left mt-4">
            <h3 className="text-4xl font-black text-white font-display italic">
              Top <CountUpNumber value={36} />%
            </h3>
            <p className="text-accent-primary text-xs font-mono uppercase font-bold tracking-wide mt-1">Competitive Rank</p>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '64%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="h-full bg-accent-primary rounded-full shadow-[0_0_8px_var(--primary-accent)]" 
            />
          </div>
        </div>
      </div>

      {/* Grid of Interactive 3D Flipped Badge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AchievementCard
          title="Leetcode Solver"
          metric="300+ Solves"
          description="Highly active in competitive logic puzzles and algorithmic challenges."
          icon={<Shield size={20} />}
          details={[
            'Data structures core mastery',
            'Top 36.3% global ranking',
            'Solving speed: Average < 20 min'
          ]}
          colorClass="text-accent-primary bg-accent-primary/10"
        />

        <AchievementCard
          title="CSBS Scholar"
          metric="8.75 CGPA"
          description="Academic excellence bridging systems engineering with financial pipelines."
          icon={<BookOpen size={20} />}
          details={[
            'Panimalar Engineering College',
            'Business Systems focus',
            'Financial analytics topper'
          ]}
          colorClass="text-accent-secondary bg-accent-secondary/10"
        />

        <AchievementCard
          title="Systems Builder"
          metric="Open-Source"
          description="Developed LAN utilities and link shorteners in FastAPI and Java."
          icon={<Cpu size={20} />}
          details={[
            'FastAPI modular pipelines',
            'javDrop socket handlers',
            'Clean asynchronous patterns'
          ]}
          colorClass="text-accent-primary bg-accent-primary/10"
        />

        <AchievementCard
          title="Analytical Edge"
          metric="83% XII Grade"
          description="Solid foundation in advanced computer science and vector mathematics."
          icon={<Star size={20} />}
          details={[
            'Vivekananda Vidyalaya',
            'Math-Computer Science stream',
            'Excellent analytical scores'
          ]}
          colorClass="text-accent-secondary bg-accent-secondary/10"
        />
      </div>
    </div>
  );
};

export default AchievementsPanel;
