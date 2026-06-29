import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AgentCollaborationBoard({ command, onComplete, isStopped }) {
  const [elapsed, setElapsed] = useState(0);
  const [logs, setLogs] = useState([]);
  const consoleEndRef = useRef(null);

  // Timeline logs definitions
  const allLogs = [
    { time: 0, text: '❯ [Code Researcher] Scanned workspace directory structure' },
    { time: 300, text: '❯ [Code Researcher] Found project files: package.json, vite.config.js, src/App.jsx' },
    { time: 600, text: '❯ [Code Researcher] Inspecting source files for command payload...' },
    { time: 1000, text: '❯ [Code Researcher] Extraction complete. Config metadata loaded.' },
    { time: 1200, text: '❯ [Systems Analyst] Initializing connection to socket...' },
    { time: 1300, text: '❯ [Systems Analyst] PIPE: Researcher ➔ Analyst [Metadata: 4.5KB]' },
    { time: 1500, text: '❯ [Systems Analyst] Found SQLite schema. Verification payload active.' },
    { time: 1800, text: '❯ [Systems Analyst] Testing port latency... localhost:5173 pinger active.' },
    { time: 2100, text: '❯ [Systems Analyst] Port ping successful. Socket latency: 12ms.' },
    { time: 2400, text: '❯ [Design Architect] Commencing layout build...' },
    { time: 2500, text: '❯ [Design Architect] PIPE: Analyst ➔ Architect [Latency: 12ms, Status: OK]' },
    { time: 2700, text: '❯ [Design Architect] Structuring layout bento grid widgets...' },
    { time: 3000, text: '❯ [Design Architect] Compiling UI layout nodes and CSS overrides...' },
    { time: 3300, text: '❯ [Design Architect] Renders completed. Injecting modules into view...' },
    { time: 3550, text: '❯ [Job] Run completed successfully.' }
  ];

  useEffect(() => {
    if (isStopped) {
      setLogs(prev => [...prev, { text: '❯ [Job] Process terminated by user.', isError: true }]);
      return;
    }

    const intervalTime = 100;
    const timer = setInterval(() => {
      setElapsed(prev => {
        const next = prev + intervalTime;
        if (next >= 3600) {
          clearInterval(timer);
          onComplete();
          return 3600;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isStopped, onComplete]);

  // Update visible logs based on elapsed time
  useEffect(() => {
    if (isStopped) return;
    const activeLogs = allLogs.filter(log => elapsed >= log.time);
    setLogs(activeLogs);
  }, [elapsed, isStopped]);

  // Auto-scroll terminal
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Determine subagent states
  const getAgentState = (index) => {
    if (isStopped) return 'stopped';
    
    // Index 0: Code Researcher (0.0s - 1.2s)
    // Index 1: Systems Analyst (1.2s - 2.4s)
    // Index 2: Design Architect (2.4s - 3.6s)
    if (index === 0) {
      if (elapsed >= 1200) return 'completed';
      if (elapsed > 0) return 'active';
      return 'idle';
    }
    if (index === 1) {
      if (elapsed >= 2400) return 'completed';
      if (elapsed >= 1200) return 'active';
      return 'idle';
    }
    if (index === 2) {
      if (elapsed >= 3600) return 'completed';
      if (elapsed >= 2400) return 'active';
      return 'idle';
    }
    return 'idle';
  };

  const agents = [
    {
      name: 'Code Researcher',
      icon: Code,
      desc: 'Scanning repository...',
      activeDesc: 'Scanning file systems...'
    },
    {
      name: 'Systems Analyst',
      icon: Cpu,
      desc: 'Checking server configs...',
      activeDesc: 'Checking socket latency...'
    },
    {
      name: 'Design Architect',
      icon: Layers,
      desc: 'Readying layouts...',
      activeDesc: 'Generating UI code...'
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto border border-[var(--border-strong)] bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl p-4 md:p-5 select-none font-sans text-left space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-mono text-xs text-zinc-400">
            Job: <span className="text-[var(--accent)] font-semibold">{command}</span> --mode development
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">
          {isStopped ? 'TERMINATED' : `${(elapsed / 1000).toFixed(1)}s / 3.6s`}
        </span>
      </div>

      {/* List of 3 subagents (Vertical) */}
      <div className="flex flex-col gap-2.5 relative">
        {agents.map((agent, i) => {
          const state = getAgentState(i);
          const Icon = agent.icon;

          let cardBorder = 'border-[var(--border)]';
          let bgClass = 'bg-[#181818]/60';
          let textColor = 'text-zinc-500';
          let iconColor = 'text-zinc-500';

          if (state === 'active') {
            cardBorder = 'border-amber-500/40 shadow-lg shadow-amber-950/20';
            bgClass = 'bg-amber-950/5';
            textColor = 'text-zinc-200';
            iconColor = 'text-amber-500 animate-pulse';
          } else if (state === 'completed') {
            cardBorder = 'border-emerald-500/30';
            bgClass = 'bg-emerald-950/5';
            textColor = 'text-zinc-300';
            iconColor = 'text-emerald-500';
          } else if (state === 'stopped') {
            cardBorder = 'border-rose-500/20';
            bgClass = 'bg-rose-950/5';
            textColor = 'text-rose-400';
            iconColor = 'text-rose-500';
          }

          return (
            <div
              key={agent.name}
              className={`flex items-center gap-3.5 p-3 rounded-lg border ${cardBorder} ${bgClass} transition-all duration-300`}
            >
              <div className={`p-2 rounded-md bg-[#252525] ${state === 'active' ? 'ring-1 ring-amber-500/20' : ''}`}>
                <Icon className={`w-4 h-4 ${iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 justify-between">
                  <p className={`text-[11px] font-semibold tracking-wide ${textColor}`}>
                    {agent.name}
                  </p>
                  {state === 'completed' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                  {state === 'stopped' && (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-mono">
                  {state === 'active' ? agent.activeDesc : agent.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Console Terminal */}
      <div className="bg-[#121212] border border-[var(--border)] rounded-lg p-3 h-36 flex flex-col justify-between font-mono text-[10px] md:text-[11px] overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-1.5 artifact-panel-scroll pr-1 select-text">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={log.isError ? 'text-rose-400' : log.text.includes('[Job]') ? 'text-amber-500' : 'text-zinc-300'}
            >
              {log.text}
            </div>
          ))}
          {/* Active blinking cursor line */}
          {!isStopped && elapsed < 3600 && (
            <div className="text-zinc-500 flex items-center gap-1">
              <span>❯ [System] Processing...</span>
              <span className="w-1 h-3 bg-zinc-500 animate-pulse inline-block" />
            </div>
          )}
          <div ref={consoleEndRef} />
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-2 mt-2 text-[9px] text-zinc-600">
          <span>CONSOLE OUTPUT</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
}
