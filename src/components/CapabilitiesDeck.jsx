import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sliders, Cpu, Network } from 'lucide-react';
import SkillSphere3D from './SkillSphere3D';
import HexGrid from './HexGrid';

const CapabilitiesDeck = ({ theme }) => {
  const [viewMode, setViewMode] = useState('sphere'); // 'sphere' or 'grid'

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto py-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-accent-primary">// System Capabilities</p>
          <h2 className="text-3xl md:text-4xl font-black italic text-white font-display mt-1">Core Tech Matrix</h2>
        </div>
        
        {/* Toggle Switch */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1 self-start md:self-center glass-panel">
          <button
            onClick={() => setViewMode('sphere')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
              viewMode === 'sphere'
                ? 'bg-accent-primary text-bg-dark shadow-md shadow-accent-primary/20'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Cpu size={14} /> 3D SPHERE
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-accent-primary text-bg-dark shadow-md shadow-accent-primary/20'
                : 'text-text-secondary hover:text-white'
            }`}
          >
            <Network size={14} /> HOLOGRAPHIC NET
          </button>
        </div>
      </div>

      {/* Capabilities Content Panel */}
      <div className="relative w-full h-[520px] rounded-3xl border border-white/5 bg-[#0a101f]/35 backdrop-blur-2xl overflow-hidden flex items-center justify-center p-4">
        {/* Abstract cyber backdrop elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-accent-rgb),0.03),transparent_60%)] pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {viewMode === 'sphere' ? (
            <motion.div
              key="sphere"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="w-full max-w-[500px]">
                <SkillSphere3D theme={theme} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="w-full max-w-[600px]">
                <HexGrid theme={theme} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CapabilitiesDeck;
