import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function IntroLoader({ onComplete }) {
  const [stage, setStage] = useState('loading'); // loading | hijack | shatter | assemble
  const [waterfallLines, setWaterfallLines] = useState([]);

  // Scramble logs for the overflow waterfall
  const glitchWords = [
    '0x8F2C71B4', 'javDrop_peer_connected', 'GhostLink_purge_expired',
    'SOCKET_ERROR_PORT_5173', 'STACK_OVERFLOW', 'SEGMENTATION_FAULT',
    '0x00FF8E', '0x7FFF5C', 'METRICS_DUMP_ACTIVE', 'MUTEX_LOCK_FAIL',
    'THREAD_ALLOCATION_LIMIT', 'SOCKET_LATENCY_240MS', 'rest_api_handshake',
    'db_sqlite3_query_ok', 'LIFO_stack_overflow', 'DLL_O(1)_navigation'
  ];

  useEffect(() => {
    // Stage triggers
    const t1 = setTimeout(() => setStage('hijack'), 1200);
    const t2 = setTimeout(() => setStage('shatter'), 2400);
    const t3 = setTimeout(() => setStage('assemble'), 3000);
    const t4 = setTimeout(() => onComplete(), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  // Generate random waterfall lines for the glitch stage
  useEffect(() => {
    if (stage !== 'hijack') return;

    const interval = setInterval(() => {
      setWaterfallLines(prev => {
        const newLine = {
          id: Math.random(),
          text: Array.from({ length: 3 }, () => glitchWords[Math.floor(Math.random() * glitchWords.length)]).join('  '),
          left: Math.random() * 95,
          speed: Math.random() * 0.6 + 0.3, // faster and smoother
          opacity: Math.random() * 0.4 + 0.1
        };
        return [...prev.slice(-40), newLine]; // keep last 40 lines
      });
    }, 35);

    return () => clearInterval(interval);
  }, [stage]);

  // Framer motion variants for smooth entrance & gravity shatter
  const getCardVariants = (customDelay) => ({
    hidden: {
      opacity: 0,
      scale: 0.98,
      y: 15
    },
    loading: { 
      opacity: 1,
      scale: 1,
      y: 0,
      borderColor: 'rgba(231, 228, 219, 1)', // sand border
      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
      transition: { 
        type: 'spring',
        stiffness: 90,
        damping: 15,
        delay: customDelay 
      }
    },
    hijack: { 
      opacity: 0.9, 
      borderColor: 'rgba(239, 68, 68, 0.3)', 
      backgroundColor: 'rgba(239, 68, 68, 0.03)',
      transition: { duration: 0.1 }
    },
    shatter: { 
      y: '115vh', 
      rotate: Math.random() * 40 - 20,
      opacity: [1, 0.8, 0],
      transition: { 
        type: 'spring', 
        stiffness: 45, 
        damping: 12,
        delay: customDelay
      } 
    }
  });

  const textVariants = {
    loading: { opacity: 1 },
    hijack: { color: '#ef4444', scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 0.3 } },
    shatter: { 
      y: '115vh', 
      rotate: Math.random() * 60 - 30,
      opacity: 0,
      transition: { type: 'spring', stiffness: 35, damping: 10 }
    }
  };

  // Synchronized calm pulsing animation for editorial skeleton lines
  const skeletonPulse = {
    animate: { opacity: [0.5, 0.8, 0.5] },
    transition: { repeat: Infinity, duration: 2.0, ease: "easeInOut" }
  };

  return (
    <div 
      onClick={onComplete}
      className={`fixed inset-0 z-50 overflow-hidden select-none cursor-pointer no-print flex flex-col transition-colors duration-150 ${
        stage === 'loading' 
          ? 'bg-[#f9f8f6]' 
          : 'bg-[#121212]'
      } ${stage === 'hijack' ? 'animate-shake' : ''}`}
      style={{ fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)' }}
    >
      {/* Skip Hint */}
      <div className={`absolute bottom-6 right-6 text-[8px] font-mono tracking-widest z-50 ${
        stage === 'loading' ? 'text-[#4a473e]/55' : 'text-zinc-600'
      }`}>
        [ CLICK ANYWHERE TO SKIP ]
      </div>

      {/* CRT Scanline Overlay */}
      {stage === 'hijack' && (
        <div className="absolute inset-0 bg-scanlines pointer-events-none z-45 mix-blend-overlay opacity-30" />
      )}

      {/* Glowing Horizontal Glitch Bar */}
      {stage === 'hijack' && (
        <div className="absolute left-0 w-full h-12 bg-rose-500/10 shadow-[0_0_25px_rgba(239,68,68,0.25)] animate-glitchBar pointer-events-none z-40" />
      )}

      {/* Hex waterfall logs */}
      {stage === 'hijack' && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden font-mono text-[9px] text-rose-500/80">
          {waterfallLines.map(line => (
            <motion.div
              key={line.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: '105vh', opacity: line.opacity }}
              transition={{ duration: line.speed, ease: 'linear' }}
              className="absolute whitespace-nowrap text-rose-500 font-bold"
              style={{ left: `${line.left}%` }}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      )}

      {/* Fake Portfolio Skeleton (Editorial Design Studio / Architect Portfolio) */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        {/* Top Navigation */}
        <motion.header
          initial="hidden"
          custom={0.02}
          variants={getCardVariants(0.02)}
          animate={stage}
          className={`h-16 w-full px-8 md:px-16 flex items-center justify-between shrink-0 border-b transition-colors duration-150 ${
            stage === 'loading' ? 'bg-[#f9f8f6] border-[#e7e4db]' : 'bg-zinc-950/20 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-8">
            {/* Minimal wordmark skeleton */}
            <div className={`h-3.5 w-32 rounded-xs transition-colors duration-150 ${
              stage === 'loading' ? 'bg-[#4a473e]/70' : 'bg-zinc-800'
            }`} />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <motion.div {...skeletonPulse} className={`h-2 w-10 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/30' : 'bg-zinc-800'}`} />
            <motion.div {...skeletonPulse} className={`h-2 w-12 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/30' : 'bg-zinc-800'}`} />
            <motion.div {...skeletonPulse} className={`h-2 w-10 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/30' : 'bg-zinc-800'}`} />
          </div>
          <div className={`h-8 w-20 rounded-xs transition-colors duration-150 ${
            stage === 'loading' ? 'bg-[#4a473e]' : 'bg-zinc-800 animate-pulse'
          }`} />
        </motion.header>

        {/* Portfolio Content Layout */}
        <div className="flex-1 px-8 md:px-16 py-12 max-w-5xl mx-auto w-full flex flex-col gap-12 justify-center">
          
          {/* Hero Section (Bold Editorial Headline) */}
          <div className="w-full flex flex-col gap-6">
            <motion.div
              initial="hidden"
              custom={0.06}
              variants={getCardVariants(0.06)}
              animate={stage}
              className="flex flex-col gap-3"
            >
              {/* Main Headline Lines */}
              <motion.div {...skeletonPulse} className={`h-10 w-full rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/20' : 'bg-zinc-800'}`} />
              <motion.div {...skeletonPulse} className={`h-10 w-3/4 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/20' : 'bg-zinc-800'}`} />
            </motion.div>

            {/* Description lines */}
            <motion.div
              initial="hidden"
              custom={0.1}
              variants={getCardVariants(0.1)}
              animate={stage}
              className="space-y-2 max-w-xl"
            >
              <motion.div {...skeletonPulse} className={`h-2.5 w-full rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/10' : 'bg-zinc-800'}`} />
              <motion.div {...skeletonPulse} className={`h-2.5 w-5/6 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/10' : 'bg-zinc-800'}`} />
            </motion.div>
          </div>

          {/* Grid Section (2-Column Large Editorial Cards) */}
          <div className="space-y-6 w-full">
            <motion.div
              initial="hidden"
              custom={0.14}
              variants={getCardVariants(0.14)}
              animate={stage}
              className="flex items-center justify-between border-b border-[#e7e4db] pb-3"
            >
              <motion.div {...skeletonPulse} className={`h-3 w-28 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/50' : 'bg-zinc-800'}`} />
              <motion.div {...skeletonPulse} className={`h-2 w-12 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/30' : 'bg-zinc-800'}`} />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Project Card 1 */}
              <motion.div
                initial="hidden"
                custom={0.18}
                variants={getCardVariants(0.18)}
                animate={stage}
                className="flex flex-col gap-3 transition-colors duration-150"
              >
                {/* Large Clean Image Rectangle */}
                <div className={`h-52 w-full rounded-xs transition-colors duration-150 ${
                  stage === 'loading' ? 'bg-[#f4f3ef] border border-[#e7e4db]' : 'bg-zinc-950/20 border border-zinc-800'
                }`} />
                <div className="flex items-center justify-between mt-1">
                  <motion.div {...skeletonPulse} className={`h-3 w-1/3 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/60' : 'bg-zinc-800'}`} />
                  <div className={`h-2 w-12 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/20' : 'bg-zinc-800'}`} />
                </div>
              </motion.div>

              {/* Project Card 2 */}
              <motion.div
                initial="hidden"
                custom={0.24}
                variants={getCardVariants(0.24)}
                animate={stage}
                className="flex flex-col gap-3 transition-colors duration-150"
              >
                <div className={`h-52 w-full rounded-xs transition-colors duration-150 ${
                  stage === 'loading' ? 'bg-[#f4f3ef] border border-[#e7e4db]' : 'bg-zinc-950/20 border border-zinc-800'
                }`} />
                <div className="flex items-center justify-between mt-1">
                  <motion.div {...skeletonPulse} className={`h-3 w-1/2 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/60' : 'bg-zinc-800'}`} />
                  <div className={`h-2 w-12 rounded-xs transition-colors duration-150 ${stage === 'loading' ? 'bg-[#4a473e]/20' : 'bg-zinc-800'}`} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Loader Overlay */}
          {stage === 'loading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f9f8f6]/30 backdrop-blur-xs z-40 transition-colors duration-150">
              <div className="flex flex-col items-center gap-4 text-center p-6 rounded-xs bg-[#f9f8f6] border border-[#e7e4db] shadow-md shadow-stone-200/50">
                <div className="w-8 h-8 border border-[#e7e4db] border-t-[#4a473e] rounded-full animate-spin" />
                <p className="text-[#4a473e] font-sans text-[10px] tracking-widest uppercase font-medium animate-pulse">
                  FETCHING ARCHIVE
                </p>
              </div>
            </div>
          )}

          {/* Glitch Overlay Exception */}
          {stage === 'hijack' && (
            <div className="absolute inset-0 flex items-center justify-center z-40 px-4">
              <motion.div 
                variants={textVariants}
                animate={stage}
                className="border-2 border-rose-500/50 bg-rose-950/20 backdrop-blur-lg p-6 rounded-xs font-mono text-left max-w-xl w-full space-y-4 z-30 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative"
              >
                <div className="border-b border-rose-500/30 pb-3 text-[11px] font-bold text-rose-400 tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                    SYSTEM INTERRUPT: CORE_OVERFLOW
                  </span>
                  <span className="text-[10px] text-rose-500/70 font-mono">PORT 5173</span>
                </div>
                <div className="text-[10px] text-rose-400/90 space-y-2 leading-relaxed select-text font-mono">
                  <p className="flex items-center gap-2 text-rose-300">
                    <span className="text-rose-500">❯</span> ACCESS VIOLATION AT ADDRESS 0x8F2C71B4
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-rose-500">❯</span> PEER CONNECTION OVERWRITTEN BY CANDIDATE_THARUN
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-rose-500">❯</span> TERMINATING SECURE_HANDSHAKE PORT PROTOCOL
                  </p>
                  <p className="flex items-center gap-2 text-rose-300 animate-pulse">
                    <span className="text-rose-500">❯</span> INJECTING KERNEL MEMORY PAYLOAD... [READY]
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
