import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Activity, Printer, Cpu, Layers, CheckCircle2, 
  ArrowRight, ExternalLink, Github, Linkedin, Mail, Settings, 
  Code, File, Send, Paperclip, MessageSquare, Plus, Menu, X, Volume2,
  ArrowUp, ChevronDown, ChevronRight, Compass, Beaker, Hammer,
  Mic, GraduationCap, Edit, Coffee, Cloud, Play
} from 'lucide-react';

import PerspectiveTimeline from './components/PerspectiveTimeline';
import HexGrid from './components/HexGrid';
import SkillSphere3D from './components/SkillSphere3D';
import AudioSynthesizer, { 
  playClickTick, playHoverBeep, playSweepSynth, setDroneWaveform 
} from './components/AudioSynthesizer';
import AgentCollaborationBoard from './components/AgentCollaborationBoard';
import IntroLoader from './components/IntroLoader';

// --- SUB-COMPONENT: BENTO CARD FOR PROJECTS ---
const BentoCard = ({ title, tech, repo, desc }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [typedCommand, setTypedCommand] = useState("");
  const [typedDesc, setTypedDesc] = useState("");
  const [terminalStep, setTerminalStep] = useState(0);
  const command = `./scan_repo --name ${title.toLowerCase()}`;

  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const normX = (e.clientX - rect.left) / width - 0.5;
    const normY = (e.clientY - rect.top) / height - 0.5;
    setTilt({ x: normX, y: normY });
  };

  const handleMouseEnter = () => {
    playHoverBeep();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isHovered) {
      setTerminalStep(1);
      let i = 0;
      const cmdInterval = setInterval(() => {
        setTypedCommand(command.substring(0, i));
        i++;
        if (i > command.length) {
          clearInterval(cmdInterval);
          setTerminalStep(2);
          let j = 0;
          const descInterval = setInterval(() => {
            setTypedDesc(desc.substring(0, j));
            j++;
            if (j > desc.length) clearInterval(descInterval);
          }, 12);
        }
      }, 15);
      return () => clearInterval(cmdInterval);
    } else {
      setTerminalStep(0);
      setTypedCommand("");
      setTypedDesc("");
    }
  }, [isHovered, desc]);

  return (
    <motion.a 
      href={repo}
      target="_blank"
      rel="noreferrer"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      onClick={playClickTick}
      whileHover={{ y: -2 }} 
      className="relative rounded-xl border border-white/5 group overflow-hidden flex flex-col justify-between transition-all duration-300 bg-white/[0.02] hover:shadow-[0_0_12px_rgba(217,119,6,0.1)] min-h-[135px]"
      style={{
        transform: `rotateX(${tilt.y * -8}deg) rotateY(${tilt.x * 8}deg)`,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      <div className="absolute top-2 right-3 text-[6px] font-mono text-zinc-600 uppercase tracking-wider">// CODE_DUMP</div>
      
      <div className="p-4 flex flex-col justify-between h-full" style={{ transform: 'translateZ(15px)' }}>
        <div>
          <h3 className="text-xs font-black text-white leading-tight group-hover:text-accent-primary transition-colors font-mono tracking-wide flex items-center gap-1.5 uppercase">
            {title} <ExternalLink size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          
          <div className="font-mono text-[8.5px] leading-normal min-h-[3rem] border-l border-white/10 pl-2 mt-2">
            {isHovered ? (
              <div>
                <span className="text-accent-primary">claude@agent:~$ {typedCommand}</span>
                {terminalStep === 2 && <div className="text-zinc-400 mt-1">{typedDesc}</div>}
              </div>
            ) : (
              <span className="text-zinc-600 italic">Hover to scan repository Spec...</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3.5 font-mono">
          <div className="flex flex-wrap gap-1">
            {tech.map((t) => (
              <span key={t} className="px-1.5 py-0.5 bg-white/5 border border-white/5 rounded text-[7.5px] text-accent-primary uppercase font-bold">{t}</span>
            ))}
          </div>
          <span className="text-[7.5px] font-bold text-accent-primary flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            GET CODE <ArrowRight size={7} />
          </span>
        </div>
      </div>
    </motion.a>
  );
};

// --- AVATARS ---
// Tharun portfolio avatar — Claude asterisk-style in terracotta
const getGreeting = () => {
  const hr = new Date().getHours();
  if (hr >= 5 && hr < 12) return 'Good morning';
  if (hr >= 12 && hr < 17) return 'Good afternoon';
  return 'Good evening';
};

const TharunAvatar = () => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 select-none text-white text-[15px] font-semibold"
    style={{ background: '#cc6b4d', fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)' }}
  >
    T
  </div>
);

const UserAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-[#3a3a3a] flex items-center justify-center text-[#ccc] text-[10px] font-semibold select-none shrink-0">
    U
  </div>
);

const fullBio = `Tharun R
B.Tech Computer Science & Business Systems
Panimalar Engineering College, Chennai
2023 – 2027  ·  CGPA 8.75 / 10

I'm a systems-focused engineer passionate about network socket pipelines, multithreading, and competitive algorithmic challenges. I bridge technical scalability with business requirements — building tools people actually use.

Core stack: Java · Python · FastAPI · React · Sockets
Competitive: 300+ LeetCode problems · SIH 2024 Finalist`;

// ─── Slash command registry ───────────────────────────────────────────────
const SLASH_COMMANDS = [
  { cmd: '/skills',       desc: 'Skills, languages & tools'     },
  { cmd: '/projects',     desc: 'Open source project showcase'  },
  { cmd: '/education',    desc: 'Academic history & timeline'   },
  { cmd: '/resume',       desc: 'Printable, interactive CV reader' },
  { cmd: '/achievements', desc: 'Awards, certs & milestones'    },
  { cmd: '/contact',      desc: 'Send a message to Tharun'      },
  { cmd: '/decrypt',      desc: 'Secret firewall challenge'      },
  { cmd: '/diagnostics',  desc: 'System telemetry & info'       },
  { cmd: '/help',         desc: 'Show all available commands'   },
  { cmd: '/clear',        desc: 'Clear current conversation'    },
];

// ─── Bio Scan / File Experience Component ─────────────────────────────────
const BioScanAnimation = () => {
  const [stage, setStage]                 = useState('idle');   // idle | thinking | done
  const [typedText, setTypedText]         = useState('');
  const [thoughtsExpanded, setThoughtsExpanded] = useState(true);
  const [thoughtsTextToShow, setThoughtsTextToShow] = useState('');



  const thoughtsText = `Analyzing bio.pdf from the workspace...
- PDF size: 820 bytes.
- Running document parser...
- Extracted B.Tech CSBS student details at Panimalar Engineering College.
- CGPA: 8.75/10.
- Core strengths: multithreading socket pipelines, algorithms, and systems engineering.
Generating summary response.`;

  const startScan = () => {
    setStage('thinking');
    setThoughtsExpanded(true);
    
    // Type out the thoughts quickly (taking ~400ms for a natural thinking delay)
    let thoughtCharIndex = 0;
    const thoughtTimer = setInterval(() => {
      thoughtCharIndex += 8;
      if (thoughtCharIndex >= thoughtsText.length) {
        clearInterval(thoughtTimer);
        setThoughtsTextToShow(thoughtsText);
        
        // Start typing the main bio response after a brief pause
        setTimeout(() => {
          setThoughtsExpanded(false); // Automatically collapse thoughts when response begins (matches Claude's default done state)
          let bioCharIndex = 0;
          const bioTimer = setInterval(() => {
            setTypedText(fullBio.slice(0, bioCharIndex));
            bioCharIndex += 3;
            if (bioCharIndex > fullBio.length) {
              clearInterval(bioTimer);
              setStage('done');
            }
          }, 15);
        }, 400);
      } else {
        setThoughtsTextToShow(thoughtsText.slice(0, thoughtCharIndex));
      }
    }, 20);
  };

  return (
    <div className="space-y-4.5 w-full max-w-2xl text-left">
      {/* File attachment chip */}
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#242220] border border-white/[0.07] w-fit select-none">
        <div className="w-8 h-8 rounded-lg bg-[#d97706]/15 border border-[#d97706]/25 flex items-center justify-center">
          <File size={14} className="text-[#d97706]" />
        </div>
        <div>
          <p className="text-[11px] text-white font-medium leading-none font-sans">bio.pdf</p>
          <p className="text-[9px] text-stone-500 mt-1 font-sans">820 B · PDF Document</p>
        </div>
      </div>

      {/* Collapsible Claude-like Thinking Process */}
      {stage !== 'idle' && (
        <div className="w-full border-l border-white/10 pl-3.5 ml-1 select-none text-left my-2.5">
          {/* Header */}
          <button
            type="button"
            onClick={() => setThoughtsExpanded(!thoughtsExpanded)}
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-400 text-[11px] font-sans font-medium transition-colors cursor-pointer outline-none"
          >
            {/* Chevron icon */}
            <ChevronRight size={10} className={`transform transition-transform duration-200 ${thoughtsExpanded ? 'rotate-90' : ''}`} />
            <span>Thinking Process</span>
            {stage === 'thinking' && !typedText && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#cc6b4d] animate-pulse" />
            )}
          </button>

          {/* Body */}
          {thoughtsExpanded && (
            <div className="mt-2 text-[12px] text-zinc-400 leading-relaxed font-sans whitespace-pre-wrap select-text pr-2">
              {thoughtsTextToShow}
              {stage === 'thinking' && !typedText && <span className="inline-block w-1 h-3.5 bg-zinc-500 ml-0.5 align-middle animate-pulse" />}
            </div>
          )}
        </div>
      )}

      {/* Typewriter bio output */}
      {stage !== 'idle' && typedText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-1"
        >
          <pre className="claude-serif whitespace-pre-wrap text-[#e7e5e4] text-[13.5px] leading-[1.78]">{typedText}{stage !== 'done' && <span className="inline-block w-[2px] h-4 bg-[#d97706] ml-px align-middle animate-pulse" />}</pre>

          {stage === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06] mt-3"
            >
              <a href="https://github.com/rajtharun08" target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-stone-300 hover:text-white text-[11px] transition-all cursor-pointer font-sans">
                <Github size={11} /> GitHub
              </a>
              <a href="https://linkedin.com/in/tharun-r" target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-stone-300 hover:text-white text-[11px] transition-all cursor-pointer font-sans">
                <Linkedin size={11} /> LinkedIn
              </a>
              <a href="mailto:rajtharun08@gmail.com"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-stone-300 hover:text-white text-[11px] transition-all cursor-pointer font-sans">
                <Mail size={11} /> Email
              </a>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Start button — only in idle */}
      {stage === 'idle' && (
        <button
          id="bio-scan-btn"
          onClick={startScan}
          className="flex items-center gap-2 text-[11px] text-stone-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.07] hover:bg-white/[0.04] transition-all cursor-pointer font-sans"
        >
          <span>Press Enter or click to open bio.pdf</span>
          <ArrowRight size={11} />
        </button>
      )}
    </div>
  );
};

// ─── Collapsible Tool Execution Block ──────────────────────────────────
const ToolExecutionBlock = ({ label, detailCode, initiallyExpanded = false }) => {
  const [expanded, setExpanded] = React.useState(initiallyExpanded);
  return (
    <div className="my-2.5 border border-white/[0.05] bg-[#222]/20 rounded-lg overflow-hidden font-mono text-[10.5px] max-w-2xl">
      <button 
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-1.5 bg-[#1b1b1b]/40 hover:bg-[#1b1b1b]/70 text-zinc-400 hover:text-zinc-200 transition-colors select-none text-left"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#cc6b4d]" />
          <span>{label}</span>
        </div>
        <ChevronRight size={10} className={`transform transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
      </button>
      {expanded && (
        <div className="p-3 bg-black/15 border-t border-white/[0.03] text-zinc-500 overflow-x-auto text-[9.5px] whitespace-pre-wrap leading-relaxed select-text font-mono">
          {detailCode}
        </div>
      )}
    </div>
  );
};

// ─── Interactive Analytics Dashboard Component ───────────────────────────
const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  
  // Generating a grid of dates (contributions heatmap)
  // 7 rows by 28 columns = 196 cells
  const heatmapCells = [];
  const colorWeights = [
    0, 0, 0, 0.15, 0, 0, 0.4, 0, 0, 0.15, 0.7, 0, 0.15, 0, 0.4, 
    0, 0, 0, 0.15, 0, 0, 0.4, 0, 0.9, 0, 0.15, 0, 0.4, 0, 0.7
  ];
  
  for (let i = 0; i < 7 * 28; i++) {
    const weight = colorWeights[i % colorWeights.length];
    heatmapCells.push(weight);
  }

  return (
    <div className="w-full max-w-2xl bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden font-sans select-none text-left my-2">
      {/* Header */}
      <div className="p-3.5 pb-2 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[12px] font-semibold text-white">System Diagnostics & Analytics</span>
        </div>
        <div className="flex bg-[#2a2a2a] p-0.5 rounded-lg text-[10px]">
          <button 
            type="button"
            onClick={() => setActiveTab('overview')} 
            className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'overview' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Overview
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('models')} 
            className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'models' ? 'bg-[#1a1a1a] text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Models
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="p-3.5 space-y-4">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Sessions', val: '17', desc: 'unique visits' },
              { label: 'Messages', val: '419', desc: 'prompts sent' },
              { label: 'Total Tokens', val: '451.0k', desc: 'processed' },
              { label: 'Active Days', val: '5', desc: 'streak record' },
              { label: 'Current Streak', val: '1d', desc: 'consecutive' },
              { label: 'Longest Streak', val: '3d', desc: 'historical' },
              { label: 'Peak Hour', val: '4 PM', desc: 'high traffic' },
              { label: 'Favorite Model', val: 'Gemini 3.5', desc: 'fast response' }
            ].map(stat => (
              <div key={stat.label} className="bg-[#242424] border border-white/[0.02] p-2.5 rounded-lg">
                <span className="text-[9px] text-zinc-500 block uppercase font-mono tracking-wide">{stat.label}</span>
                <span className="text-[13px] font-bold text-[#e7e5e4] block mt-0.5">{stat.val}</span>
                <span className="text-[8px] text-zinc-500 block font-mono mt-0.5">{stat.desc}</span>
              </div>
            ))}
          </div>

          {/* Heatmap Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] text-zinc-400 uppercase font-mono tracking-wider">
              <span>Token consumption heatmap (Last 30 days)</span>
              <span>Total: 451,029 tokens</span>
            </div>
            <div className="bg-[#242424] p-3 rounded-lg border border-white/[0.02] flex justify-center">
              <div className="grid grid-flow-col grid-rows-7 gap-1">
                {heatmapCells.map((weight, idx) => (
                  <div 
                    key={idx}
                    className="w-2 h-2 rounded-[1px] transition-colors duration-300"
                    style={{
                      backgroundColor: weight === 0 ? '#1b1b1b' : `rgba(204, 107, 77, ${weight})`
                    }}
                    title={`Day ${idx + 1}: ${Math.round(weight * 15000)} tokens consumed`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end items-center gap-1.5 text-[8px] text-zinc-500 font-mono">
              <span>Less</span>
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[#1b1b1b]" />
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[rgba(204,107,77,0.15)]" />
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[rgba(204,107,77,0.4)]" />
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[rgba(204,107,77,0.7)]" />
              <span className="w-1.5 h-1.5 rounded-[1px] bg-[rgba(204,107,77,0.9)]" />
              <span>More</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 space-y-3 font-mono text-[9.5px]">
          <div className="flex justify-between items-center text-zinc-400 border-b border-white/5 pb-1 text-[8.5px] uppercase tracking-wider font-bold">
            <span>MODEL CONFIG</span>
            <span>TOKEN WEIGHT</span>
            <span>LATENCY</span>
          </div>
          {[
            { name: 'Gemini 3.5 Flash', role: 'Primary Assistant', weight: '65.2%', latency: '240ms', active: true },
            { name: 'Gemini 1.5 Pro', role: 'Deep Reasoning Engine', weight: '22.8%', latency: '980ms', active: false },
            { name: 'Claude 3.5 Sonnet', role: 'Visual Spec Design', weight: '12.0%', latency: '650ms', active: false }
          ].map(model => (
            <div key={model.name} className="flex justify-between items-center py-1.5 border-b border-white/[0.02]">
              <div>
                <span className={`font-semibold ${model.active ? 'text-[#cc6b4d]' : 'text-zinc-300'}`}>
                  {model.name} {model.active && '●'}
                </span>
                <span className="text-[8px] text-zinc-500 block">{model.role}</span>
              </div>
              <div className="text-zinc-300 font-bold">{model.weight}</div>
              <div className="text-zinc-400">{model.latency}</div>
            </div>
          ))}
        </div>
      )}

      {/* Footer controls */}
      <div className="px-3.5 py-1.5 bg-[#1b1b1b] border-t border-white/5 flex gap-3 text-[8.5px] font-mono text-zinc-500">
        <span>HOST: local-instance</span>
        <span>DEPLOYMENT: vercel-prod</span>
        <span>STATUS: operational</span>
      </div>
    </div>
  );
};

// --- MAIN CLI APP COMPONENT ---
const App = () => {
  const [activeThread, setActiveThread] = useState('overview'); // 'overview', 'bio', 'skills', 'projects', 'resume', 'diagnostics', 'decrypt', 'contact'
  const [inputVal, setInputVal] = useState('');
  
  // Custom Controls
  const [synthWave, setSynthWave] = useState('triangle');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [thinking, setThinking] = useState(false);
  const [tokenStats, setTokenStats] = useState({ time: '0.8s', tokens: '214 tokens', active: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Slash autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [acIdx, setAcIdx] = useState(0);
  const [filteredCmds, setFilteredCmds] = useState(SLASH_COMMANDS);

  // Decryption minigame state
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptPasscode, setDecryptPasscode] = useState('');
  const [decryptTimeLeft, setDecryptTimeLeft] = useState(15);
  const [scrambleText, setScrambleText] = useState('');

  // Bio simulation states
  const [attachedFile, setAttachedFile] = useState(null);
  const [bioThinkingStage, setBioThinkingStage] = useState('idle');
  const [bioThoughtsText, setBioThoughtsText] = useState('');
  const [bioResponseText, setBioResponseText] = useState('');
  const [thoughtsExpanded, setThoughtsExpanded] = useState(true);

  const thoughtsTimerRef = useRef(null);
  const responseTimerRef = useRef(null);

  const [showArtifact, setShowArtifact] = useState(false);
  const [boardCommand, setBoardCommand] = useState(null);
  const [isBoardStopped, setIsBoardStopped] = useState(false);
  const pendingCommandRef = useRef(null);
  const [showIntro, setShowIntro] = useState(false);

  // Auto-tour states
  const [tourActive, setTourActive] = useState(false);
  const [tourCursor, setTourCursor] = useState({
    x: 0,
    y: 0,
    visible: false,
    ripple: false,
    pressingEnter: false,
    textIndicator: ""
  });

  const getElementCoords = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Escape key to skip tour
  useEffect(() => {
    if (!tourActive) return;

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setTourActive(false);
        setTourCursor(prev => ({ ...prev, visible: false }));
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [tourActive]);

  // Auto-trigger tour on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      startAutoTour();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const startAutoTour = async () => {
    // Reset state & go to overview (Welcome page)
    setActiveThread('overview');
    setAttachedFile(null);
    setInputVal('');
    setMobileMenuOpen(false);
    
    // Clear the bio thread so it's a clean canvas!
    setThreads(prev => ({
      ...prev,
      bio: []
    }));

    setTourActive(true);

    // Starting position in center-right area of screen
    setTourCursor({
      x: window.innerWidth * 0.75,
      y: window.innerHeight * 0.25,
      visible: true,
      ripple: false,
      pressingEnter: false,
      textIndicator: ""
    });

    await delay(600);

    // --- STEP 1: Move to sidebar "About" thread ---
    let aboutCoords = getElementCoords('sidebar-thread-bio');
    if (!aboutCoords) {
      aboutCoords = { x: 100, y: 160 };
    }
    
    setTourCursor(prev => ({ ...prev, x: aboutCoords.x, y: aboutCoords.y }));
    await delay(800); // 0.6s glide + 200ms pause

    // Click About thread
    setTourCursor(prev => ({ ...prev, ripple: true }));
    playClickTick();
    setActiveThread('bio');
    await delay(200);
    setTourCursor(prev => ({ ...prev, ripple: false }));

    // Wait for the conversation to switch and render the empty chat box
    await delay(600);

    // --- STEP 2: Move to Attach file button in the About thread's bottom bar ---
    let attachCoords = getElementCoords('tour-chat-attach-btn');
    if (!attachCoords) {
      attachCoords = { x: window.innerWidth * 0.45, y: window.innerHeight * 0.92 };
    }

    setTourCursor(prev => ({ ...prev, x: attachCoords.x, y: attachCoords.y }));
    await delay(800); // 0.6s glide + 200ms pause

    // Click attach button
    setTourCursor(prev => ({ ...prev, ripple: true }));
    playClickTick();
    setAttachedFile({ name: 'bio.pdf', size: '820 B' });
    await delay(200);
    setTourCursor(prev => ({ ...prev, ripple: false }));

    await delay(400);

    // --- STEP 3: Move to Textarea and type the message ---
    let textareaCoords = getElementCoords('tour-chat-textarea');
    if (!textareaCoords) {
      textareaCoords = { x: window.innerWidth * 0.55, y: window.innerHeight * 0.9 };
    }

    setTourCursor(prev => ({ ...prev, x: textareaCoords.x, y: textareaCoords.y }));
    await delay(800); // 0.6s glide + 200ms pause

    // Focus input
    setTourCursor(prev => ({ ...prev, ripple: true }));
    const textareaEl = document.getElementById('tour-chat-textarea');
    if (textareaEl) {
      textareaEl.focus();
    }
    await delay(200);
    setTourCursor(prev => ({ ...prev, ripple: false }));

    // Type "Read bio.md and tell me about Tharun R"
    const textToType = "Read bio.md and tell me about Tharun R";
    let typed = "";
    for (let i = 0; i < textToType.length; i++) {
      typed += textToType[i];
      setInputVal(typed);
      playClickTick(); // Play click synth key sound
      await delay(15 + Math.random() * 15); // Much faster typing speed
    }

    await delay(400);

    // --- STEP 4: Move to Send button and click it ---
    let sendCoords = getElementCoords('tour-chat-send-btn');
    if (!sendCoords) {
      sendCoords = { x: window.innerWidth * 0.65, y: window.innerHeight * 0.92 };
    }

    setTourCursor(prev => ({ ...prev, x: sendCoords.x, y: sendCoords.y }));
    await delay(800); // 0.6s glide + 200ms pause

    // Click Send
    setTourCursor(prev => ({ ...prev, ripple: true }));
    
    const sendBtn = document.getElementById('tour-chat-send-btn');
    if (sendBtn) {
      sendBtn.click();
    } else {
      handleSendMessage("Read bio.md and tell me about Tharun R");
    }

    await delay(200);
    setTourCursor(prev => ({ ...prev, ripple: false }));

    // Wait a brief moment to let the user see the message sent and output start
    await delay(7000);

    // --- STEP 5: Move to sidebar "Welcome" thread ---
    let welcomeCoords = getElementCoords('sidebar-thread-overview');
    if (!welcomeCoords) {
      welcomeCoords = { x: 100, y: 120 };
    }
    
    setTourCursor(prev => ({ ...prev, x: welcomeCoords.x, y: welcomeCoords.y }));
    await delay(800); // 0.6s glide + 200ms pause

    // Click Welcome thread
    setTourCursor(prev => ({ ...prev, ripple: true }));
    playClickTick();
    setActiveThread('overview');
    await delay(200);
    setTourCursor(prev => ({ ...prev, ripple: false }));

    // Wait for the Welcome screen to render
    await delay(600);

    // --- STEP 6: Move virtual cursor into the textarea of the Welcome screen ---
    let welcomeTextareaCoords = getElementCoords('tour-chat-textarea');
    if (welcomeTextareaCoords) {
      setTourCursor(prev => ({ ...prev, x: welcomeTextareaCoords.x, y: welcomeTextareaCoords.y }));
      await delay(800); // 0.6s glide + 200ms pause

      // Focus the textarea for user input
      setTourCursor(prev => ({ ...prev, ripple: true }));
      const txtEl = document.getElementById('tour-chat-textarea');
      if (txtEl) {
        txtEl.focus();
      }
      await delay(200);
      setTourCursor(prev => ({ ...prev, ripple: false }));
    }

    // --- STEP 7: Fade out and finish ---
    await delay(400);
    setTourCursor(prev => ({ ...prev, visible: false }));
    setTourActive(false);
  };

  // Chat message logs container ref
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Navigation threads list — About Me first, then Welcome
  const threadsList = [
    { id: 'overview', label: 'Welcome',   desc: 'Chat with Tharun’s portfolio' },
    { id: 'bio',      label: 'About',   desc: 'Biography & background'     },
  ];

  // Contact Form submit inside the chat
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    const email = data.get('email');
    const msg = data.get('message');
    if (!name || !email || !msg) return;

    playClickTick();
    
    // Append loading message
    setThreads(prev => {
      const currentMessages = prev[activeThread];
      return {
        ...prev,
        [activeThread]: [
          ...currentMessages,
          { sender: 'claude', type: 'sys', text: 'NETWORK: Transporting handshake packets to rajtharun08@gmail.com...' }
        ]
      };
    });

    setTimeout(() => {
      playSweepSynth();
      setThreads(prev => {
        const currentMessages = prev[activeThread];
        return {
          ...prev,
          [activeThread]: [
            ...currentMessages.filter(m => !m.text?.startsWith('NETWORK:')),
            { sender: 'claude', type: 'output', text: `✓ Handshake established successfully. Packet ACK received.\n\nThank you, ${name}. Message payload transmitted correctly.` }
          ]
        };
      });
    }, 1200);
  };

  // Pre-loaded Chat Conversations
  const [threads, setThreads] = useState({
    overview: [],
    bio: [
      {
        sender: 'user',
        text: 'Read bio.md and tell me about Tharun R'
      },
      {
        sender: 'claude',
        type: 'sys',
        text: '> Reading bio.md from workspace…'
      },
      {
        sender: 'claude',
        type: 'raw',
        content: <BioScanAnimation />
      }
    ],
    skills: [
      {
        sender: 'user',
        text: 'What is inside skills.json?'
      },
      {
        sender: 'claude',
        type: 'sys',
        text: '[read_file] tharun-code/skills.json (620B)'
      },
      {
        sender: 'claude',
        type: 'raw',
        content: (
          <div className="space-y-4 font-mono text-[11px] leading-relaxed">
            <div className="text-zinc-400 bg-[#1e1e1e] border border-white/5 p-4 rounded-lg select-text">
              <span className="text-accent-primary font-bold">&#123;</span><br />
              &nbsp;&nbsp;<span className="text-accent-secondary">"languages"</span>: [<span className="text-emerald-400">"Java"</span>, <span className="text-emerald-400">"Python"</span>, <span className="text-emerald-400">"JavaScript"</span>, <span className="text-emerald-400">"SQL"</span>],<br />
              &nbsp;&nbsp;<span className="text-accent-secondary">"frameworks"</span>: [<span className="text-emerald-400">"FastAPI"</span>, <span className="text-emerald-400">"Spring Boot"</span>, <span className="text-emerald-400">"React JS"</span>, <span className="text-emerald-400">"Flask"</span>],<br />
              &nbsp;&nbsp;<span className="text-accent-secondary">"systems"</span>: [<span className="text-emerald-400">"Sockets"</span>, <span className="text-emerald-400">"Multithreading"</span>, <span className="text-emerald-400">"DSA"</span>]<br />
              <span className="text-accent-primary">&#125;</span>
            </div>
            
            {/* Hex Map and Sphere */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border border-white/5 bg-black/20 rounded-xl p-4 items-center">
              <div className="flex flex-col items-center">
                <span className="text-[7.5px] text-accent-primary font-bold uppercase mb-1.5">// INTERACTIVE_CONNECTIONS</span>
                <HexGrid />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[7.5px] text-accent-secondary font-bold uppercase mb-1.5">// 3D_SKILLS_CLOUD</span>
                <SkillSphere3D />
              </div>
            </div>
          </div>
        )
      }
    ],
    projects: [
      {
        sender: 'user',
        text: 'List the projects in projects.json and let me scan their specifications.'
      },
      {
        sender: 'claude',
        type: 'sys',
        text: '[read_file] tharun-code/projects.json (1.8K)'
      },
      {
        sender: 'claude',
        type: 'raw',
        content: (
          <div className="space-y-4 font-mono text-[11px] leading-relaxed">
            <div className="text-zinc-500 font-bold">// Scanning repositories matching Tharun R...</div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-2">
              <BentoCard 
                title="GhostLink" 
                tech={['FastAPI', 'SQLite3', 'Python']} 
                desc="Self-destructing URL shortener with secure hash validations and countdown expirations." 
                repo="https://github.com/rajtharun08/GhostLink"
              />
              <BentoCard 
                title="javDrop" 
                tech={['Java', 'Sockets', 'Threads']} 
                desc="Local Area Network P2P transport engineered with concurrent socket handlers." 
                repo="https://github.com/rajtharun08/JavDrop"
              />
              <BentoCard 
                title="LinkHist" 
                tech={['Flask', 'Python', 'Stacks']} 
                desc="Browser history simulation using LIFO stacks to track double-sided navigation flows." 
                repo="https://github.com/rajtharun08/browser-history-api"
              />
              <BentoCard 
                title="Headlinehub" 
                tech={['NewsAPI', 'NLP', 'Python']} 
                desc="Multilingual crawler that processes news headlines to analyze positive/neutral sentiments." 
                repo="https://github.com/rajtharun08/headlinehub"
              />
              <BentoCard 
                title="JEditor" 
                tech={['Java', 'Swing', 'AWT']} 
                desc="Lightweight desktop IDE code editor with multiple themes and clean config hooks." 
                repo="https://github.com/rajtharun08/JEditor"
              />
              <BentoCard 
                title="Nostalgia Machine" 
                tech={['JS', 'CSS3', 'Audio']} 
                desc="Vintage skeuomorphic cassette tape visualizer playing synth loop waves." 
                repo="https://github.com/rajtharun08/nostalgia-machine"
              />
            </div>
          </div>
        )
      }
    ],
    resume: [
      {
        sender: 'user',
        text: 'Show me Tharun\'s resume and academic timeline.'
      },
      {
        sender: 'claude',
        type: 'sys',
        text: '[view_file] tharun-code/resume.pdf (4.5M)'
      },
      {
        sender: 'claude',
        type: 'raw',
        content: (
          <div className="space-y-4 font-mono text-[10.5px] max-w-2xl w-full">
            <div className="no-print flex justify-between items-center border-b border-white/5 pb-2">
              <div>
                <span className="text-[7px] text-accent-secondary font-bold uppercase tracking-widest">// PDF_DATASHEET_LOADED</span>
                <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Academic CV</h4>
              </div>
              <button
                onClick={() => window.print()}
                className="py-1 px-2.5 bg-white/5 border border-white/10 hover:border-accent-primary text-accent-primary hover:text-white rounded-lg text-[9px] font-mono cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Printer size={11} />
                <span>PRINT CV</span>
              </button>
            </div>

            <div 
              id="printable-resume" 
              className="glass-panel p-5 rounded-xl border border-white/5 bg-black/40 text-left font-mono space-y-4 shadow-2xl relative select-text"
            >
              <div className="border-b print-border border-white/10 pb-3">
                <h1 className="text-base font-black text-white uppercase tracking-wider">Tharun R</h1>
                <p className="text-[9px] text-accent-primary font-bold uppercase mt-0.5">Computer Science & Business Systems Scholar</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[8px] text-zinc-400">
                  <span>rajtharun08@gmail.com</span>
                  <span>github.com/rajtharun08</span>
                  <span>linkedin.com/in/tharun-r</span>
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-[9.5px] font-black text-white uppercase border-b print-border border-white/5 pb-0.5 flex items-center gap-1">
                  <Cpu size={10} className="text-accent-primary" /> Summary
                </h2>
                <p className="text-[9px] text-zinc-400 leading-normal">
                  Computer Science B.Tech student specializing in system optimizations, concurrent network socket thread setups, and algorithm validations.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-[9.5px] font-black text-white uppercase border-b print-border border-white/5 pb-0.5 flex items-center gap-1">
                  <Layers size={10} className="text-accent-primary" /> Education
                </h2>
                <div className="no-print py-1">
                  <PerspectiveTimeline />
                </div>
                <div className="print:block hidden space-y-2 pl-2 border-l border-white/10 print-border text-[8.5px] text-zinc-400">
                  <div>
                    <div className="flex justify-between font-bold text-white">
                      <span>B Tech in CSBS</span>
                      <span>2023 - 27</span>
                    </div>
                    <p>Panimalar Engineering College (PEC) // CGPA: 8.75/10</p>
                  </div>
                  <div>
                    <div className="flex justify-between font-bold text-white">
                      <span>Higher Secondary (XII)</span>
                      <span>2022 - 23</span>
                    </div>
                    <p>SKNS PMC Vivekananda Vidyalaya // Percentage: 83%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <h2 className="text-[9.5px] font-black text-white uppercase border-b print-border border-white/5 pb-0.5 flex items-center gap-1">
                  <Settings size={10} className="text-accent-primary" /> Technical Skills
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9.5px] pl-1 text-zinc-400">
                  <div>
                    <span className="text-white font-bold block uppercase">// Languages</span>
                    <p>Java, Python, Javascript, SQL</p>
                  </div>
                  <div>
                    <span className="text-white font-bold block uppercase">// Frameworks & Tools</span>
                    <p>FastAPI, Spring Boot, React, Flask, Sockets, Git</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ],
    diagnostics: [
      {
        sender: 'user',
        text: 'Display the system diagnostics logs.'
      },
      {
        sender: 'claude',
        type: 'sys',
        text: '[run_command] systeminfo'
      },
      {
        sender: 'claude',
        type: 'raw',
        content: (
          <div className="space-y-4 font-mono text-[10.5px] select-text">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1e1e1e] border border-white/5 p-3 rounded-lg text-[9.5px]">
              <div>
                <span className="text-zinc-500 block font-bold">BRAND STYLING</span>
                <span className="text-accent-primary font-bold">CLAUDE CARBON</span>
              </div>
              <div>
                <span className="text-zinc-500 block font-bold">PING CONNECTION</span>
                <span className="text-accent-secondary font-bold">12ms // STABLE</span>
              </div>
              <div>
                <span className="text-zinc-500 block font-bold">AUDIO timbre</span>
                <span className="text-accent-primary font-bold">TRIANGLE</span>
              </div>
              <div>
                <span className="text-zinc-500 block font-bold">STATUS</span>
                <span className="text-emerald-400 font-bold">OPERATIONAL</span>
              </div>
            </div>
            <div className="bg-black/35 border border-white/5 p-3 rounded-lg max-h-[160px] overflow-y-auto leading-relaxed scrollbar-thin text-zinc-400">
              <p>[09:30:15] BOOT: Workspace file explorer mapped successfully.</p>
              <p>[09:30:16] BOOT: Audio synthesis drone active ('triangle' waveform).</p>
              <p>[09:30:17] BOOT: Systems telemetry online. Sec level validated.</p>
            </div>
          </div>
        )
      }
    ],
    decrypt: [
      {
        sender: 'user',
        text: 'Run decrypt_override.sh'
      },
      {
        sender: 'claude',
        type: 'sys',
        text: '[run_command] ./decrypt_override.sh'
      }
    ],
    contact: [
      {
        sender: 'user',
        text: 'How can I contact Tharun R?'
      },
      {
        sender: 'claude',
        type: 'sys',
        text: '[run_command] initialize_contact_handshake'
      }
    ],
    achievements: [
      {
        sender: 'user',
        text: 'Show me achievements, certifications and milestones.'
      },
      {
        sender: 'claude',
        type: 'output',
        text: "Here's a summary of Tharun's key achievements, certifications and competitive programming milestones."
      },
      {
        sender: 'claude',
        type: 'raw',
        content: (
          <div className="space-y-3 w-full">
            {/* Competitive Programming */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🏅</span>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#d97706] transition-colors">LeetCode — 300+ Problems Solved</h3>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">Consistent solver across arrays, graphs, DP and system design. Top 30% globally on weekly contests.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20 font-mono">DSA</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-stone-400 border border-white/5 font-mono">Python · Java</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NPTEL */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📜</span>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#d97706] transition-colors">NPTEL — Programming in Java (Elite)</h3>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">Earned Elite certification from IIT Madras via NPTEL for Java programming. Top 5% cohort nationally.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20 font-mono">Certified</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-stone-400 border border-white/5 font-mono">IIT Madras</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hackathon */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#d97706] transition-colors">Hackathon Finalist — Smart India Hackathon</h3>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">Team selected at college level for SIH 2024. Built a real-time P2P file-sharing solution using socket engineering.</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20 font-mono">Finalist</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-stone-400 border border-white/5 font-mono">SIH 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CGPA */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎓</span>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#d97706] transition-colors">Academic Excellence — CGPA 8.75 / 10</h3>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">Consistently high academic performance in B.Tech CSBS at Panimalar Engineering College (2023–2027).</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#d97706]/10 text-[#d97706] border border-[#d97706]/20 font-mono">8.75 GPA</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-stone-400 border border-white/5 font-mono">PEC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    ]
  });

  // Scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threads, thinking, activeThread, isDecrypting, scrambleText]);

  // Decryption override minigame countdown timer logic
  useEffect(() => {
    if (!isDecrypting) return;

    const timer = setInterval(() => {
      setDecryptTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDecrypting(false);
          setThreads((prevThreads) => {
            const currentMessages = prevThreads.decrypt;
            return {
              ...prevThreads,
              decrypt: [
                ...currentMessages,
                { sender: 'claude', type: 'error', text: '>>> SECURE LOCK DOWN ACTIVE. BYPASS ATTEMPT EXPIRED.' },
                { sender: 'claude', type: 'error', text: 'ACCESS DENIED.' }
              ]
            };
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const scrambler = setInterval(() => {
      const chars = '0123456789ABCDEF!@#$%&*+?';
      let scramble = '';
      for (let i = 0; i < 3; i++) {
        let line = '';
        for (let j = 0; j < 25; j++) {
          line += chars[Math.floor(Math.random() * chars.length)];
        }
        scramble += line + '\n';
      }
      setScrambleText(scramble);
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(scrambler);
    };
  }, [isDecrypting]);

  const isCommandQuery = (text) => {
    if (!text) return false;
    const q = text.toLowerCase().trim();
    return (
      q === '/projects' || 
      q.includes('project') || 
      q.includes('repo') || 
      q.includes('github')
    );
  };

  // Execute chat messages
  const handleSendMessage = (textToSend) => {
    const trimmed = textToSend || inputVal.trim();
    if (!trimmed && !attachedFile) return;

    // Immediate action for clear/about commands
    const q = trimmed.toLowerCase().trim();
    if (q === '/clear' || q === 'clear') {
      playClickTick();
      setInputVal('');
      setShowAutocomplete(false);
      setThreads(prev => ({ ...prev, [activeThread]: [] }));
      return;
    }
    if (q === '/about' || q === 'about' || q === '/about me' || q === 'about me' || q === 'bio' || q === '/bio') {
      playClickTick();
      setInputVal('');
      setShowAutocomplete(false);
      handleThreadSelect('bio');
      return;
    }

    playClickTick();
    setInputVal('');
    setShowAutocomplete(false);

    const fileAttached = attachedFile;
    setAttachedFile(null);

    const userMsgText = trimmed || (fileAttached ? `Read ${fileAttached.name} and tell me about Tharun R` : '');

    // Append User Message to Active thread
    setThreads(prev => ({
      ...prev,
      [activeThread]: [
        ...prev[activeThread],
        { 
          sender: 'user', 
          text: userMsgText, 
          files: fileAttached ? [fileAttached] : undefined 
        }
      ]
    }));

    // Command trigger with AgentCollaborationBoard
    if (isCommandQuery(trimmed)) {
      pendingCommandRef.current = trimmed;
      setBoardCommand(trimmed);
      setIsBoardStopped(false);
      setThinking(true);
      setTokenStats(prev => ({ ...prev, active: false }));
      return;
    }

    setThinking(true);
    setTokenStats(prev => ({ ...prev, active: false }));

    // Bio simulation trigger
    if (fileAttached && fileAttached.name === 'bio.pdf') {
      setBioThinkingStage('thinking');
      setBioThoughtsText('');
      setBioResponseText('');
      setThoughtsExpanded(true);

      setTimeout(() => {
        setThreads(prev => ({
          ...prev,
          [activeThread]: [
            ...prev[activeThread],
            { sender: 'claude', type: 'bio-sim' }
          ]
        }));

        const thoughtsText = `Analyzing bio.pdf from the workspace...
- PDF size: 820 bytes.
- Running document parser...
- Extracted B.Tech CSBS student details at Panimalar Engineering College.
- CGPA: 8.75/10.
- Core strengths: multithreading socket pipelines, algorithms, and systems engineering.
Generating summary response.`;

        let thoughtCharIndex = 0;
        clearInterval(thoughtsTimerRef.current);
        thoughtsTimerRef.current = setInterval(() => {
          thoughtCharIndex += 8;
          if (thoughtCharIndex >= thoughtsText.length) {
            clearInterval(thoughtsTimerRef.current);
            setBioThoughtsText(thoughtsText);

            responseTimerRef.current = setTimeout(() => {
              setThoughtsExpanded(false);
              setBioThinkingStage('typing_response');

              let bioCharIndex = 0;
              clearInterval(responseTimerRef.current);
              responseTimerRef.current = setInterval(() => {
                bioCharIndex += 3;
                if (bioCharIndex > fullBio.length) {
                  clearInterval(responseTimerRef.current);
                  setBioThinkingStage('done');
                  setThinking(false);

                  const timeVal = (Math.random() * 0.4 + 1.2).toFixed(1) + 's';
                  const tokensVal = Math.floor(Math.random() * 80 + 180) + ' tokens';
                  setTokenStats({ time: timeVal, tokens: tokensVal, active: true });
                } else {
                  setBioResponseText(fullBio.slice(0, bioCharIndex));
                }
              }, 15);
            }, 400);
          } else {
            setBioThoughtsText(thoughtsText.slice(0, thoughtCharIndex));
          }
        }, 25);
      }, 500);
      return;
    }

    const thinkDelay = 900;

    // Minigame specific input handle
    if (isDecrypting && activeThread === 'decrypt') {
      setTimeout(() => {
        setThinking(false);
        const timeVal = (Math.random() * 0.2 + 0.4).toFixed(1) + 's';
        const tokensVal = Math.floor(Math.random() * 50 + 60) + ' tokens';
        setTokenStats({ time: timeVal, tokens: tokensVal, active: true });
        
        const guess = trimmed.toUpperCase();
        if (guess === decryptPasscode) {
          setIsDecrypting(false);
          setThreads(prev => ({
            ...prev,
            decrypt: [
              ...prev.decrypt,
              { sender: 'claude', type: 'sys', text: '>>> VERIFYING SECURITY BYPASS CODE...' },
              { sender: 'claude', type: 'output', text: 'BYPASS KEY APPROVED. CLOGGED METRICS DUMPED.' },
              { sender: 'claude', type: 'raw', content: (
                <div className="border border-white/5 bg-black/25 p-3 rounded-lg text-emerald-400 space-y-1 leading-relaxed">
                  <p>===============================================</p>
                  <p>SYSTEM DIAGNOSTICS DECRYPT OVERRIDE: SUCCESS</p>
                  <p> - GhostLink Repository Spec: FastAPI url shortener verified.</p>
                  <p> - javDrop Socket Suite: TCP multithreading peers verified.</p>
                  <p> - Competitive solvers profile: 300+ LeetCode scripts.</p>
                  <p>===============================================</p>
                </div>
              )}
            ]
          }));
        } else {
          setThreads(prev => ({
            ...prev,
            decrypt: [
              ...prev.decrypt,
              { sender: 'claude', type: 'error', text: `>>> ERROR: SECURITY ENCRYPTION REJECTED KEY "${guess}".` }
            ]
          }));
        }
      }, 600);
      return;
    }

    // ── Route slash commands and keywords ────────────────────────────────────
    setTimeout(() => {
      setThinking(false);
      const timeVal = (Math.random() * 0.4 + 0.8).toFixed(1) + 's';
      const tokensVal = Math.floor(Math.random() * 150 + 220) + ' tokens';
      setTokenStats({ time: timeVal, tokens: tokensVal, active: true });
      
      const q = trimmed.toLowerCase().trim();
      let responseMsg = null;

      if (q === '/clear' || q === 'clear') {
        setThreads(prev => ({ ...prev, [activeThread]: [] }));
        return;
      }

      // /about → navigate to bio session
      if (q === '/about' || q === 'about' || q === '/about me' || q === 'about me' || q === 'bio' || q === '/bio') {
        handleThreadSelect('bio');
        return;
      }

      // /help
      if (q === '/help' || q === 'help') {
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div>
              <ToolExecutionBlock 
                label="search help_documentation --query help" 
                detailCode={`[docs] Fetching help documentation index...\n[docs] 9 local commands registered\n[docs] Formatting markdown table...`}
              />
              <div className="claude-serif select-text whitespace-pre-wrap">
                {`Available slash commands — type / to see the autocomplete menu:\n\n  /about         Open the About Me session\n  /skills        Technologies, languages & tools\n  /projects      Open source projects showcase\n  /education     Academic timeline & resume\n  /achievements  Awards, certifications & milestones\n  /contact       Send me a message\n  /decrypt       Secret firewall challenge\n  /diagnostics   System telemetry & info\n  /clear         Clear this conversation`}
              </div>
            </div>
          )
        };
      }
      // /skills
      else if (q === '/skills' || q.includes('skill') || q.includes('tech') || q.includes('language')) {
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div>
              <ToolExecutionBlock 
                label="read_file tharun-code/skills.json (620B)" 
                detailCode={`[sys] Open file stream to: d:\\tharun-portfolio\\src\\skills.json\n[sys] MIME: application/json\n[sys] Reading... done (212ms)\n[sys] Parse JSON successfully.\n{ "languages": ["Java", "Python", "JS", "SQL"], "frameworks": ["FastAPI", "React"] }`}
              />
              {renderSkillsNode()}
            </div>
          )
        };
      }
      // /projects
      else if (q === '/projects' || q.includes('project') || q.includes('repo') || q.includes('github')) {
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div>
              <ToolExecutionBlock 
                label="git log -n 6 --oneline & query github-api" 
                detailCode={`$ git log -n 6 --oneline\nd32f8a1 [GhostLink] FastAPI url shortener\na84d2f0 [JavDrop] TCP sockets multithreaded\n59c832e [headlinehub] news fetcher backend\n$ curl https://api.github.com/users/rajtharun08/repos\nFetching repositories data... OK (340ms)\nFormatting BentoGrid assets...`}
              />
              {renderProjectsNode()}
            </div>
          )
        };
      }
      // /education
      else if (q === '/education' || q.includes('education') || q.includes('college') || q.includes('gpa') || q.includes('school')) {
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div>
              <ToolExecutionBlock 
                label="view_file tharun-code/education.json (420B)" 
                detailCode={`[sys] Read buffer education.json: 420 bytes\n[sys] Rendering academic history timeline... done (110ms)`}
              />
              {renderResumeNode()}
            </div>
          )
        };
      }
      // /resume
      else if (q === '/resume' || q.includes('resume') || q.includes('cv')) {
        setShowArtifact(true);
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div className="space-y-3 font-mono text-[11px] leading-relaxed">
              <ToolExecutionBlock 
                label="view_file tharun-code/resume.pdf (4.5M)" 
                detailCode={`[sys] Read buffer resume.pdf: 4,718,592 bytes\n[sys] Rendering PDF pages... done (180ms)\n[sys] Loaded resume in Artifacts pane.`}
              />
              <div className="claude-serif text-[#e7e5e4] text-[13px] mb-2 select-text">
                I have compiled and loaded my full academic CV into the Artifacts panel on the right side of the screen. You can view, jump between sections, or print it directly from there.
              </div>
              <button
                onClick={() => { playClickTick(); setShowArtifact(true); }}
                className="no-print mt-2 flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-[var(--accent)] hover:text-white transition-all cursor-pointer font-sans text-xs font-semibold"
              >
                <span>Open Resume in Side Panel</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )
        };
      }
      // /achievements
      else if (q === '/achievements' || q.includes('achievement') || q.includes('award') || q.includes('cert')) {
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div>
              <ToolExecutionBlock 
                label="scan achievements_index.db" 
                detailCode={`[db] SELECT * FROM awards WHERE candidate = 'Tharun R'\n[db] Query completed: 3 rows returned (45ms)\n  - LeetCode 300+\n  - SIH 2024 Finalist\n  - NPTEL Elite`}
              />
              {renderAchievementsNode()}
            </div>
          )
        };
      }
      // /contact
      else if (q === '/contact' || q === 'contact' || q.includes('email') || q.includes('hire') || q.includes('message')) {
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div>
              <ToolExecutionBlock 
                label="initialize_mail_socket --secure" 
                detailCode={`[net] Connecting to smtp.gmail.com:587\n[net] SSL handshake complete. Channel secured.\n[net] Rendering contact form component...`}
              />
              {renderContactFormNode(handleContactSubmit)}
            </div>
          )
        };
      }
      // /decrypt
      else if (q === '/decrypt' || q === 'decrypt') {
        const pass = Math.random().toString(36).substring(2, 7).toUpperCase();
        setDecryptPasscode(pass);
        setDecryptTimeLeft(15);
        setIsDecrypting(true);
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div>
              <ToolExecutionBlock 
                label="execute_command ./decrypt_override.sh" 
                detailCode={`$ ./decrypt_override.sh --initiate\n[warning] Firewall encryption override initiated...\n[warning] Keygen crack seed: 0x8F2C71B4\n[warning] Sec override timer: 15 seconds\n[sys] Bypass active...`}
              />
              {renderDecryptNode()}
            </div>
          )
        };
      }
      // /diagnostics /stats /dashboard
      else if (q === '/diagnostics' || q.includes('diagnostic') || q.includes('system') || q.includes('status') || q === '/stats' || q === 'stats' || q === '/dashboard' || q === 'dashboard') {
        responseMsg = {
          sender: 'claude', type: 'raw',
          content: (
            <div>
              <ToolExecutionBlock 
                label="execute_command ./system_diagnostics.sh --stats" 
                detailCode={`$ ./system_diagnostics.sh --stats\nGathering system telemetry...\nCPU: 8 Cores (Operational)\nPING: 12ms (Excellent)\nMemory consumption: normal\nActive instances: 1 local host\nLoading analytics database...`}
              />
              <AnalyticsDashboard />
            </div>
          )
        };
      }
      else {
        responseMsg = {
          sender: 'claude', type: 'output',
          text: `I'm not sure what you mean by "${trimmed}". Try typing / to see all available commands.`
        };
      }

      if (responseMsg) {
        setThreads(prev => ({
          ...prev,
          [activeThread]: [...prev[activeThread], responseMsg]
        }));
      }
    }, thinkDelay);
  };

  const handleBoardComplete = () => {
    if (!pendingCommandRef.current) return;
    const cmdText = pendingCommandRef.current;
    pendingCommandRef.current = null;
    setBoardCommand(null);
    setThinking(false);

    const timeVal = '3.6s';
    const tokensVal = Math.floor(Math.random() * 150 + 220) + ' tokens';
    setTokenStats({ time: timeVal, tokens: tokensVal, active: true });

    const q = cmdText.toLowerCase().trim();
    let responseMsg = null;

    if (q === '/help' || q === 'help') {
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div>
            <ToolExecutionBlock 
              label="search help_documentation --query help" 
              detailCode={`[docs] Fetching help documentation index...\n[docs] 9 local commands registered\n[docs] Formatting markdown table...`}
            />
            <div className="claude-serif select-text whitespace-pre-wrap">
              {`Available slash commands — type / to see the autocomplete menu:\n\n  /about         Open the About Me session\n  /skills        Technologies, languages & tools\n  /projects      Open source projects showcase\n  /education     Academic timeline & resume\n  /achievements  Awards, certifications & milestones\n  /contact       Send me a message\n  /decrypt       Secret firewall challenge\n  /diagnostics   System telemetry & info\n  /clear         Clear this conversation`}
            </div>
          </div>
        )
      };
    }
    else if (q === '/skills' || q.includes('skill') || q.includes('tech') || q.includes('language')) {
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div>
            <ToolExecutionBlock 
              label="read_file tharun-code/skills.json (620B)" 
              detailCode={`[sys] Open file stream to: d:\\tharun-portfolio\\src\\skills.json\n[sys] MIME: application/json\n[sys] Reading... done (212ms)\n[sys] Parse JSON successfully.\n{ "languages": ["Java", "Python", "JS", "SQL"], "frameworks": ["FastAPI", "React"] }`}
            />
            {renderSkillsNode()}
          </div>
        )
      };
    }
    else if (q === '/projects' || q.includes('project') || q.includes('repo') || q.includes('github')) {
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div>
            <ToolExecutionBlock 
              label="git log -n 6 --oneline & query github-api" 
              detailCode={`$ git log -n 6 --oneline\nd32f8a1 [GhostLink] FastAPI url shortener\na84d2f0 [JavDrop] TCP sockets multithreaded\n59c832e [headlinehub] news fetcher backend\n$ curl https://api.github.com/users/rajtharun08/repos\nFetching repositories data... OK (340ms)\nFormatting BentoGrid assets...`}
            />
            {renderProjectsNode()}
          </div>
        )
      };
    }
    else if (q === '/education' || q.includes('education') || q.includes('college') || q.includes('gpa') || q.includes('school')) {
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div>
            <ToolExecutionBlock 
              label="view_file tharun-code/education.json (420B)" 
              detailCode={`[sys] Read buffer education.json: 420 bytes\n[sys] Rendering academic history timeline... done (110ms)`}
            />
            {renderResumeNode()}
          </div>
        )
      };
    }
    else if (q === '/resume' || q.includes('resume') || q.includes('cv')) {
      setShowArtifact(true);
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div className="space-y-3 font-mono text-[11px] leading-relaxed">
            <ToolExecutionBlock 
              label="view_file tharun-code/resume.pdf (4.5M)" 
              detailCode={`[sys] Read buffer resume.pdf: 4,718,592 bytes\n[sys] Rendering PDF pages... done (180ms)\n[sys] Loaded resume in Artifacts pane.`}
            />
            <div className="claude-serif text-[#e7e5e4] text-[13px] mb-2 select-text">
              I have compiled and loaded my full academic CV into the Artifacts panel on the right side of the screen. You can view, jump between sections, or print it directly from there.
            </div>
            <button
              onClick={() => { playClickTick(); setShowArtifact(true); }}
              className="no-print mt-2 flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-[var(--accent)] hover:text-white transition-all cursor-pointer font-sans text-xs font-semibold"
            >
              <span>Open Resume in Side Panel</span>
              <ArrowRight size={12} />
            </button>
          </div>
        )
      };
    }
    else if (q === '/achievements' || q.includes('achievement') || q.includes('award') || q.includes('cert')) {
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div>
            <ToolExecutionBlock 
              label="scan achievements_index.db" 
              detailCode={`[db] SELECT * FROM awards WHERE candidate = 'Tharun R'\n[db] Query completed: 3 rows returned (45ms)\n  - LeetCode 300+\n  - SIH 2024 Finalist\n  - NPTEL Elite`}
            />
            {renderAchievementsNode()}
          </div>
        )
      };
    }
    else if (q === '/contact' || q === 'contact' || q.includes('email') || q.includes('hire') || q.includes('message')) {
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div>
            <ToolExecutionBlock 
              label="initialize_mail_socket --secure" 
              detailCode={`[net] Connecting to smtp.gmail.com:587\n[net] SSL handshake complete. Channel secured.\n[net] Rendering contact form component...`}
            />
            {renderContactFormNode(handleContactSubmit)}
          </div>
        )
      };
    }
    else if (q === '/decrypt' || q === 'decrypt') {
      const pass = Math.random().toString(36).substring(2, 7).toUpperCase();
      setDecryptPasscode(pass);
      setDecryptTimeLeft(15);
      setIsDecrypting(true);
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div>
            <ToolExecutionBlock 
              label="execute_command ./decrypt_override.sh" 
              detailCode={`$ ./decrypt_override.sh --initiate\n[warning] Firewall encryption override initiated...\n[warning] Keygen crack seed: 0x8F2C71B4\n[warning] Sec override timer: 15 seconds\n[sys] Bypass active...`}
            />
            {renderDecryptNode()}
          </div>
        )
      };
    }
    else if (q === '/diagnostics' || q.includes('diagnostic') || q.includes('system') || q.includes('status') || q === '/stats' || q === 'stats' || q === '/dashboard' || q === 'dashboard') {
      responseMsg = {
        sender: 'claude', type: 'raw',
        content: (
          <div>
            <ToolExecutionBlock 
              label="execute_command ./system_diagnostics.sh --stats" 
              detailCode={`$ ./system_diagnostics.sh --stats\nGathering system telemetry...\nCPU: 8 Cores (Operational)\nPING: 12ms (Excellent)\nMemory consumption: normal\nActive instances: 1 local host\nLoading analytics database...`}
            />
            <AnalyticsDashboard />
          </div>
        )
      };
    }

    if (responseMsg) {
      setThreads(prev => ({
        ...prev,
        [activeThread]: [...prev[activeThread], responseMsg]
      }));
    }
  };

  const handleAttachFile = () => {
    playClickTick();
    setAttachedFile({ name: 'bio.pdf', size: '820 B' });
  };

  const handleStopGenerating = () => {
    clearInterval(thoughtsTimerRef.current);
    clearInterval(responseTimerRef.current);
    if (bioThinkingStage === 'thinking' || bioThinkingStage === 'typing_response') {
      setBioThinkingStage('stopped');
    }
    setIsBoardStopped(true);
    setBoardCommand(null);
    pendingCommandRef.current = null;
    setThinking(false);
    playClickTick();
  };

  const handleNewChat = () => {
    clearInterval(thoughtsTimerRef.current);
    clearInterval(responseTimerRef.current);
    setActiveThread('overview');
    setThreads(prev => ({
      ...prev,
      overview: [],
      bio: [
        {
          sender: 'user',
          text: 'Read bio.md and tell me about Tharun R'
        },
        {
          sender: 'claude',
          type: 'sys',
          text: '> Reading bio.md from workspace…'
        },
        {
          sender: 'claude',
          type: 'raw',
          content: <BioScanAnimation />
        }
      ]
    }));
    setAttachedFile(null);
    setBioThinkingStage('idle');
    setBioThoughtsText('');
    setBioResponseText('');
    setThoughtsExpanded(true);
    setMobileMenuOpen(false);
    playClickTick();
  };

  // Nav item click handler
  const handleThreadSelect = (threadId) => {
    setActiveThread(threadId);
    setMobileMenuOpen(false);
    playClickTick();

    // Auto-trigger decrypt loop if selecting decrypt thread and it's not already running
    if (threadId === 'decrypt' && threads.decrypt.length <= 2 && !isDecrypting) {
      setTimeout(() => {
        const pass = Math.random().toString(36).substring(2, 7).toUpperCase();
        setDecryptPasscode(pass);
        setDecryptTimeLeft(15);
        setIsDecrypting(true);
        setThreads(prev => ({
          ...prev,
          decrypt: [
            ...prev.decrypt,
            { sender: 'claude', type: 'sys', text: '[run_command] ./decrypt_override.sh' }
          ]
        }));
      }, 400);
    }

    // Auto-trigger contact Form if selecting contact thread and it's empty
    if (threadId === 'contact' && threads.contact.length <= 2) {
      setTimeout(() => {
        setThreads(prev => ({
          ...prev,
          contact: [
            ...prev.contact,
            { sender: 'claude', type: 'raw', content: renderContactFormNode(handleContactSubmit) }
          ]
        }));
      }, 400);
    }
  };

  // ─── Waveform change ──────────────────────────────────────────────────────
  const handleWaveformChange = (wave) => {
    setSynthWave(wave);
    setDroneWaveform(wave);
    playClickTick();
  };

  // ─── Input change handler: show autocomplete when typing '/' ───────────
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    playClickTick();
    if (val.startsWith('/')) {
      const partial = val.toLowerCase();
      const matches = SLASH_COMMANDS.filter(c => c.cmd.startsWith(partial));
      setFilteredCmds(matches.length ? matches : SLASH_COMMANDS);
      setShowAutocomplete(true);
      setAcIdx(0);
    } else {
      setShowAutocomplete(false);
    }
  };

  // ─── Keyboard navigation for autocomplete ───────────────────────────────
  const handleKeyDown = (e) => {
    if (showAutocomplete && filteredCmds.length) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAcIdx(i => (i + 1) % filteredCmds.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAcIdx(i => (i - 1 + filteredCmds.length) % filteredCmds.length);
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        const chosen = filteredCmds[acIdx];
        if (chosen) {
          commitSlashCommand(chosen);
        }
        return;
      }
      if (e.key === 'Escape') {
        setShowAutocomplete(false);
        return;
      }
    }
    if (e.key === 'Enter' && !showAutocomplete) {
      if (!e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    }
  };

  // ─── Commit slash command ────────────────────────────────────────────────────
  const commitSlashCommand = (item) => {
    setShowAutocomplete(false);
    setInputVal('');
    // /about is the only command that navigates; all others render inline
    handleSendMessage(item.cmd);
  };

  // ─── Render helpers (called by handleSendMessage) ─────────────────────
  const renderAchievementsNode = () => threads.achievements?.find(m => m.type === 'raw')?.content || null;
  const renderDecryptNode = () => (
    <div className="border border-rose-500/30 bg-rose-950/10 p-4 rounded-xl space-y-2 font-mono text-[10.5px]">
      <div className="text-rose-400 font-bold text-[9px] uppercase animate-pulse">[!] BYPASS AUTHORIZATION ACTIVE</div>
      <p className="text-rose-300">Type the passcode shown above in the chat bar to crack the firewall!</p>
    </div>
  );
  const renderBioNode = () => (
    <div className="space-y-4 font-mono text-[10.5px]">
      <div className="text-zinc-400 bg-[#1e1e1e] border border-white/5 p-3 rounded-lg leading-relaxed select-text">
        <span className="text-accent-primary font-bold"># Tharun R</span><br />
        <span className="text-zinc-500">&gt; Computer Science & Business Systems Scholar @ PEC</span><br /><br />
        <span className="text-accent-secondary">## Biography</span><br />
        <span>Passionate systems designer and engineer with a deep interest in performance tuning, socket communication networks, and competitive algorithm puzzles. I bridge the gap between technical scalability and business requirements.</span>
      </div>
      
      <div className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[7px] text-accent-primary font-bold uppercase tracking-wider">// IDENTITY_DEEP_BIO</span>
          <h4 className="text-xs font-black text-white uppercase mt-0.5">Systems & Business Integrations</h4>
          <p className="text-[9.5px] text-zinc-400 mt-1 max-w-lg leading-relaxed select-text">
            Hi, I'm Tharun R. Currently pursuing B.Tech CSBS at Panimalar Engineering College (PEC). I specialize in network socket pipelines, multithreading, and algorithmic optimizations.
          </p>
        </div>
        <div className="flex gap-2 text-zinc-400 shrink-0">
          <a href="https://github.com/rajtharun08" target="_blank" rel="noreferrer" onMouseEnter={playHoverBeep} onClick={playClickTick} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-accent-primary hover:text-accent-primary transition-all">
            <Github size={13} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" onMouseEnter={playHoverBeep} onClick={playClickTick} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-accent-secondary hover:text-accent-secondary transition-all">
            <Linkedin size={13} />
          </a>
          <a href="mailto:rajtharun08@gmail.com" onMouseEnter={playHoverBeep} onClick={playClickTick} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:border-accent-primary hover:text-accent-primary transition-all">
            <Mail size={13} />
          </a>
        </div>
      </div>
    </div>
  );

  const renderSkillsNode = () => {
    const categories = [
      {
        label: 'Languages',
        color: '#d97706',
        skills: ['Java', 'Python', 'JavaScript', 'SQL', 'C'],
      },
      {
        label: 'Frameworks & Libraries',
        color: '#60a5fa',
        skills: ['FastAPI', 'Spring Boot', 'React JS', 'Flask', 'Pandas'],
      },
      {
        label: 'Systems & Concepts',
        color: '#34d399',
        skills: ['TCP Sockets', 'Multithreading', 'REST APIs', 'DSA', 'OOP'],
      },
      {
        label: 'Tools & Platforms',
        color: '#a78bfa',
        skills: ['Git', 'GitHub', 'MySQL', 'SQLite', 'VS Code', 'Linux'],
      },
    ];
    return (
      <div className="space-y-4 w-full max-w-2xl">
        <p className="claude-serif text-[13.5px] text-[#e7e5e4] leading-relaxed">
          Here's an overview of Tharun's technical skills across languages, frameworks, and tools:
        </p>
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.label} className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
              <p className="text-[9px] font-mono uppercase tracking-widest mb-2.5" style={{ color: cat.color }}>{cat.label}</p>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium text-stone-200 border transition-all cursor-default"
                    style={{ borderColor: `${cat.color}22`, background: `${cat.color}0d` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-stone-600 font-mono">300+ LeetCode problems solved · SIH 2024 Finalist · NPTEL Java Elite</p>
      </div>
    );
  };

  const renderProjectsNode = () => (
    <div className="space-y-4 font-mono text-[10.5px]">
      <div className="text-zinc-500 font-bold">// Scanning repositories matching Tharun R...</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
        <BentoCard 
          title="GhostLink" 
          tech={['FastAPI', 'SQLite3', 'Python']} 
          desc="Self-destructing URL shortener with secure hash validations and countdown expirations." 
          repo="https://github.com/rajtharun08/GhostLink"
        />
        <BentoCard 
          title="javDrop" 
          tech={['Java', 'Sockets', 'Threads']} 
          desc="Local Area Network P2P transport engineered with concurrent socket handlers." 
          repo="https://github.com/rajtharun08/JavDrop"
        />
        <BentoCard 
          title="LinkHist" 
          tech={['Flask', 'Python', 'Stacks']} 
          desc="Browser history simulation using LIFO stacks to track double-sided navigation flows." 
          repo="https://github.com/rajtharun08/browser-history-api"
        />
        <BentoCard 
          title="Headlinehub" 
          tech={['NewsAPI', 'NLP', 'Python']} 
          desc="Multilingual crawler that processes news headlines to analyze positive/neutral sentiments." 
          repo="https://github.com/rajtharun08/headlinehub"
        />
        <BentoCard 
          title="JEditor" 
          tech={['Java', 'Swing', 'AWT']} 
          desc="Lightweight desktop IDE code editor with multiple themes and clean config hooks." 
          repo="https://github.com/rajtharun08/JEditor"
        />
        <BentoCard 
          title="Nostalgia Machine" 
          tech={['JS', 'CSS3', 'Audio']} 
          desc="Vintage skeuomorphic cassette tape visualizer playing synth loop waves." 
          repo="https://github.com/rajtharun08/nostalgia-machine"
        />
      </div>
    </div>
  );

  const renderResumeNode = () => (
    <div className="space-y-4 font-mono text-[10.5px] max-w-2xl w-full">
      <div className="no-print flex justify-between items-center border-b border-white/5 pb-2">
        <div>
          <span className="text-[7px] text-accent-secondary font-bold uppercase tracking-widest">// PDF_DATASHEET_LOADED</span>
          <h4 className="text-xs font-black text-white uppercase tracking-wider font-mono">Academic CV</h4>
        </div>
        <button
          onClick={() => window.print()}
          className="py-1 px-2.5 bg-white/5 border border-white/10 hover:border-accent-primary text-accent-primary hover:text-white rounded-lg text-[9px] font-mono cursor-pointer flex items-center gap-1.5 transition-all"
        >
          <Printer size={11} />
          <span>PRINT CV</span>
        </button>
      </div>

      <div 
        id="printable-resume" 
        className="glass-panel p-5 rounded-xl border border-white/5 bg-black/40 text-left font-mono space-y-4 shadow-2xl relative select-text"
      >
        <div className="border-b print-border border-white/10 pb-3">
          <h1 className="text-base font-black text-white uppercase tracking-wider">Tharun R</h1>
          <p className="text-[9px] text-accent-primary font-bold uppercase mt-0.5">Computer Science & Business Systems Scholar</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[8px] text-zinc-400">
            <span>rajtharun08@gmail.com</span>
            <span>github.com/rajtharun08</span>
            <span>linkedin.com/in/tharun-r</span>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-[9.5px] font-black text-white uppercase border-b print-border border-white/5 pb-0.5 flex items-center gap-1">
            <Cpu size={10} className="text-accent-primary" /> Summary
          </h2>
          <p className="text-[9px] text-zinc-400 leading-normal">
            Computer Science B.Tech student specializing in system optimizations, concurrent network socket thread setups, and algorithm validations.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-[9.5px] font-black text-white uppercase border-b print-border border-white/5 pb-0.5 flex items-center gap-1">
            <Layers size={10} className="text-accent-primary" /> Education
          </h2>
          <div className="no-print py-1">
            <PerspectiveTimeline />
          </div>
          <div className="print:block hidden space-y-2 pl-2 border-l border-white/10 print-border text-[8.5px] text-zinc-400">
            <div>
              <div className="flex justify-between font-bold text-white">
                <span>B Tech in CSBS</span>
                <span>2023 - 27</span>
              </div>
              <p>Panimalar Engineering College (PEC) // CGPA: 8.75/10</p>
            </div>
            <div>
              <div className="flex justify-between font-bold text-white">
                <span>Higher Secondary (XII)</span>
                <span>2022 - 23</span>
              </div>
              <p>SKNS PMC Vivekananda Vidyalaya // Percentage: 83%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiagnosticsNode = () => (
    <div className="space-y-4 font-mono text-[10.5px] select-text">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1e1e1e] border border-white/5 p-3 rounded-lg text-[9.5px]">
        <div>
          <span className="text-zinc-500 block font-bold">TELEMETRY COORDS</span>
          <span className="text-accent-primary font-bold">X: {mousePos.x.toFixed(3)} | Y: {mousePos.y.toFixed(3)}</span>
        </div>
        <div>
          <span className="text-zinc-500 block font-bold">PING CONNECTION</span>
          <span className="text-accent-secondary font-bold">12ms // EXCELLENT</span>
        </div>
        <div>
          <span className="text-zinc-500 block font-bold">BRAND STYLING</span>
          <span className="text-accent-primary font-bold">CLAUDE CARBON</span>
        </div>
        <div>
          <span className="text-zinc-500 block font-bold">STATUS</span>
          <span className="text-emerald-400 font-bold">OPERATIONAL</span>
        </div>
      </div>
      <div className="bg-black/35 border border-white/5 p-3 rounded-lg max-h-[160px] overflow-y-auto leading-relaxed scrollbar-thin text-zinc-400">
        <p>[09:30:15] BOOT: Workspace file explorer mapped successfully.</p>
        <p>[09:30:16] BOOT: Audio synthesis drone active ('triangle' waveform).</p>
        <p>[09:30:17] BOOT: Systems telemetry online. Sec level validated.</p>
      </div>
    </div>
  );

  const renderContactFormNode = (onSubmitHandshake) => (
    <div className="space-y-3 font-mono text-[10.5px] max-w-xl">
      <form onSubmit={onSubmitHandshake} className="glass-panel p-4 rounded-xl border border-white/5 bg-black/40 space-y-3 select-text">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-[8px] text-zinc-400 uppercase">Your Name</label>
            <input 
              name="name"
              type="text" 
              required
              className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] text-white outline-none focus:border-accent-primary font-semibold"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[8px] text-zinc-400 uppercase">Your Email</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] text-white outline-none focus:border-accent-primary font-semibold"
              placeholder="name@domain.com"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="block text-[8px] text-zinc-400 uppercase">Handshake Message</label>
          <textarea 
            name="message"
            rows={2}
            required
            className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] text-white outline-none focus:border-accent-primary font-semibold"
            placeholder="Introduce collaboration packet..."
          />
        </div>
        <button
          type="submit"
          className="w-full py-1.5 bg-accent-primary hover:opacity-90 text-white text-[9px] font-bold rounded transition-all cursor-pointer uppercase"
        >
          SEND HANDSHAKE MESSAGE
        </button>
      </form>
    </div>
  );

  return (
    <div className={`h-screen w-screen flex bg-bg-dark overflow-hidden relative select-none ${tourActive ? 'tour-cursor-hidden' : ''}`}>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50"
          >
            <IntroLoader onComplete={() => { playSweepSynth(); setShowIntro(false); setTimeout(() => { startAutoTour(); }, 600); }} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ================= MOBILE HEADER ================= */}
      <div className="no-print lg:hidden absolute top-0 left-0 right-0 h-12 bg-[#1a1918] border-b border-white/5 flex items-center justify-between px-4 z-40">
        <button 
          onClick={() => { playClickTick(); setMobileMenuOpen(!mobileMenuOpen); }}
          className="text-zinc-400 hover:text-white cursor-pointer"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <span className="text-sm font-mono font-bold text-white tracking-tight">&lt;/Tharun&gt;</span>
        <button
          onClick={handleNewChat}
          className="text-zinc-400 hover:text-white cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* ================= LEFT SIDEBAR ================= */}
      <aside
        className={`no-print w-[220px] h-full flex flex-col z-30 shrink-0 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 absolute top-12 bottom-0 left-0 h-[calc(100vh-3rem)]' : '-translate-x-full absolute lg:relative top-0 bottom-0 left-0'
        }`}
        style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border)' }}
      >
        {/* Brand header */}
        <div className="px-4 py-4 hidden lg:flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-0.5">
            <span className="font-mono text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>&lt;/</span>
            <span className="text-white font-mono text-[13px] font-semibold">Tharun</span>
            <span className="font-mono text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>&gt;</span>
          </div>
          <button
            onClick={handleNewChat}
            className="p-1 rounded-md cursor-pointer transition-all"
            style={{ color: 'var(--text-muted)' }}
            title="Home"
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto py-3 px-2">
          <p className="text-[9px] font-medium uppercase tracking-widest px-2 mb-2" style={{ color: 'var(--text-muted)' }}>Conversations</p>
          <div className="space-y-0.5">
            {threadsList.map((t) => {
              const isActive = activeThread === t.id;
              return (
                <button
                  key={t.id}
                  id={`sidebar-thread-${t.id}`}
                  onClick={() => handleThreadSelect(t.id)}
                  className="w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-2.5 group"
                  style={{
                    background: isActive ? 'var(--bg-active)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <MessageSquare size={12} className="shrink-0" style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)' }} />
                  <span className="text-[12px] truncate" style={{ fontWeight: isActive ? 500 : 400 }}>
                    {t.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Timbre */}
          <div className="flex items-center gap-1.5">
            <Volume2 size={10} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
            <span className="text-[9px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Timbre</span>
            <div className="flex gap-1 ml-auto">
              {['sin', 'tri', 'saw'].map((label, i) => {
                const waves = ['sine', 'triangle', 'sawtooth'];
                return (
                  <button
                    key={label}
                    onClick={() => handleWaveformChange(waves[i])}
                    className="px-1.5 py-px rounded text-[8px] cursor-pointer font-mono transition-all"
                    style={{
                      color: synthWave === waves[i] ? 'var(--accent)' : 'var(--text-muted)',
                      background: synthWave === waves[i] ? 'rgba(204,107,77,0.12)' : 'transparent',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Identity */}
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold select-none shrink-0"
              style={{ background: '#cc6b4d', color: '#fff' }}
            >
              P
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10.5px] font-medium block truncate" style={{ color: 'var(--text-primary)' }}>Portfolio Visitor</span>
              <span className="text-[8.5px] block" style={{ color: 'var(--text-muted)' }}>Free plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= RIGHT MAIN CHAT + ARTIFACT SPLIT ================= */}
      <div className="flex-1 flex h-full overflow-hidden relative">
        <section
          className={`flex-1 flex flex-col h-full pt-12 lg:pt-0 overflow-hidden relative transition-all duration-300 ${
            showArtifact ? 'md:max-w-[60%]' : ''
          }`}
          style={{ background: 'var(--bg-main)' }}
        >
        {/* Chat header — just the conversation title like Claude */}
        <div
          className="no-print h-12 w-full flex items-center justify-between px-6 select-none shrink-0 z-20"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}
        >
          <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
            {threadsList.find(t => t.id === activeThread)?.label || 'Welcome'}
          </span>
          <span className="text-[10px] hidden md:inline" style={{ color: 'var(--text-muted)' }}>Tharun R · Portfolio</span>
        </div>

        {/* CHAT CONTENT AREA */}
        {threads[activeThread]?.length === 0 ? (
          /* EMPTY STATE (Welcome Screen) */
          <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-12 py-8 max-w-2xl mx-auto w-full select-none relative">
            {/* Greeting block (Side-by-Side) */}
            <div className="flex items-center justify-center gap-4 mb-8 select-none">
              <div
                className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                style={{ width: '56px', height: '56px', fontSize: '24px', background: '#cc6b4d', fontFamily: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)' }}
              >
                T
              </div>
              <h1 className="claude-serif text-white leading-normal tracking-normal" style={{ fontSize: '42px', fontWeight: '300' }}>
                {getGreeting()}, Guest
              </h1>
            </div>



            {/* Input Container */}
            <div className="w-full relative">
              {/* Slash menu for empty state */}
              <AnimatePresence>
                {showAutocomplete && filteredCmds.length > 0 && (
                  <motion.div
                    key="slash-menu-empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.1 }}
                    className="slash-menu absolute left-0 right-0 bottom-full mb-2 z-50"
                  >
                    {filteredCmds.map((item, i) => (
                      <div
                        key={item.cmd}
                        className={`slash-menu-item${i === acIdx ? ' active' : ''}`}
                        onMouseEnter={() => setAcIdx(i)}
                        onMouseDown={(e) => { e.preventDefault(); commitSlashCommand(item); }}
                      >
                        <span className="cmd-name">{item.cmd}</span>
                        <span className="cmd-desc">{item.desc}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Large Input box */}
              <div
                className="w-full rounded-2xl p-4 flex flex-col gap-3 relative"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
              >
                {/* Attached file chip */}
                {attachedFile && (
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#242220] border border-white/[0.07] w-fit select-none">
                    <div className="w-6 h-6 rounded bg-[#d97706]/15 border border-[#d97706]/25 flex items-center justify-center">
                      <File size={11} className="text-[#d97706]" />
                    </div>
                    <span className="text-[10px] text-white font-medium font-sans">bio.pdf</span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-stone-500 hover:text-white cursor-pointer transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}

                <textarea
                  id="tour-chat-textarea"
                  ref={inputRef}
                  value={inputVal}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={thinking}
                  className="w-full bg-transparent border-none outline-none text-[14px] resize-none disabled:opacity-40"
                  style={{ color: 'var(--text-primary)', height: '70px', minHeight: '50px', maxHeight: '150px', fontFamily: 'inherit' }}
                  placeholder={activeThread === 'bio' ? "Ask about Tharun, or click + to attach bio.pdf..." : "How can I help you today? (Type / for commands...)"}
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />

                {/* Bottom Row */}
                <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/[0.03]">
                  <button
                    id="tour-chat-attach-btn"
                    onClick={handleAttachFile}
                    className="cursor-pointer transition-colors p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-zinc-200 shrink-0 border-none bg-transparent"
                    title="Attach bio.pdf"
                  >
                    <Plus size={18} />
                  </button>

                  <div className="flex items-center gap-3">
                    <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg border-none bg-transparent">
                      <Mic size={15} />
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg border-none bg-transparent">
                      <Activity size={15} />
                    </button>

                    <button
                      id="tour-chat-send-btn"
                      onClick={() => handleSendMessage()}
                      disabled={thinking || (!inputVal.trim() && !attachedFile)}
                      className="p-1.5 rounded-lg text-white cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-20 flex items-center justify-center hover:brightness-110 border-none"
                      style={{ background: 'var(--accent)' }}
                    >
                      <ArrowUp size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick intent buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 w-full font-sans">
              {[
                { label: 'Biography', icon: <File size={11} />, cmd: 'drive' },
                { label: 'Skills', icon: <Code size={11} />, cmd: '/skills' },
                { label: 'Projects', icon: <Terminal size={11} />, cmd: '/projects' },
                { label: 'Education', icon: <GraduationCap size={11} />, cmd: '/education' },
                { label: 'Resume', icon: <File size={11} />, cmd: '/resume' },
                { label: 'Achievements', icon: <Beaker size={11} />, cmd: '/achievements' },
                { label: 'Contact', icon: <Mail size={11} />, cmd: '/contact' }
              ].map(intent => (
                <button
                  key={intent.label}
                  type="button"
                  onClick={() => {
                    if (intent.cmd === 'drive') {
                      handleThreadSelect('bio');
                      setAttachedFile({ name: 'bio.pdf', size: '820 B' });
                    } else {
                      handleSendMessage(intent.cmd);
                    }
                  }}
                  className="px-3 py-1.5 rounded-full border border-white/[0.06] bg-[#242424] hover:bg-[#2c2c2c] hover:border-white/10 text-[11px] text-zinc-300 transition-all cursor-pointer font-sans flex items-center gap-1.5 active:scale-95"
                >
                  {intent.icon}
                  <span>{intent.label}</span>
                </button>
              ))}
            </div>

            {/* Discoverability hint */}
            <p className="text-center mt-5 text-[10.5px]" style={{ color: 'var(--text-muted)' }}>
              Type <span className="font-mono text-zinc-400 bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[9.5px]">/</span> inside the chat input to see all available command actions.
            </p>

            {/* Footer mistakes text */}
            <p className="text-center mt-3 text-[9px]" style={{ color: 'var(--text-muted)' }}>
              Tharun can make mistakes. Please verify important info.
            </p>
          </div>
        ) : (
          /* STANDARD CHAT LAYOUT WITH MESSAGES & BOTTOM INPUT */
          <>
            {/* Messages scrolling area */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 md:px-12 py-8 space-y-8 select-text"
              style={{ background: 'var(--bg-main)' }}
            >
              {threads[activeThread]?.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                
                // Render bio simulation message
                if (msg.type === 'bio-sim') {
                  return (
                    <div key={idx} className="flex gap-4 max-w-3xl mx-auto justify-start">
                      <TharunAvatar />
                      <div className="flex-1 min-w-0 space-y-4">
                        {/* File chip */}
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#242220] border border-white/[0.07] w-fit select-none">
                          <div className="w-8 h-8 rounded-lg bg-[#d97706]/15 border border-[#d97706]/25 flex items-center justify-center">
                            <File size={14} className="text-[#d97706]" />
                          </div>
                          <div>
                            <p className="text-[11px] text-white font-medium leading-none font-sans">bio.pdf</p>
                            <p className="text-[9px] text-stone-500 mt-1 font-sans">820 B · PDF Document</p>
                          </div>
                        </div>

                        {/* Collapsible Thinking Process */}
                        {(bioThinkingStage === 'thinking' || bioThinkingStage === 'typing_response' || bioThinkingStage === 'done' || bioThinkingStage === 'stopped') && (
                          <div className="w-full border-l border-white/10 pl-3.5 ml-1 select-none text-left my-2.5">
                            <button
                              type="button"
                              onClick={() => setThoughtsExpanded(!thoughtsExpanded)}
                              className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-400 text-[11px] font-sans font-medium transition-colors cursor-pointer outline-none border-none bg-transparent"
                            >
                              <ChevronRight size={10} className={`transform transition-transform duration-200 ${thoughtsExpanded ? 'rotate-90' : ''}`} />
                              <span>Thinking Process</span>
                              {bioThinkingStage === 'thinking' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#cc6b4d] animate-ping" />
                              )}
                            </button>
                            {thoughtsExpanded && (
                              <div className="mt-2 text-[12px] text-zinc-400 leading-relaxed font-sans whitespace-pre-wrap select-text pr-2">
                                {bioThoughtsText}
                                {bioThinkingStage === 'thinking' && <span className="inline-block w-1 h-3.5 bg-zinc-500 ml-0.5 align-middle animate-pulse" />}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Response */}
                        {(bioThinkingStage === 'typing_response' || bioThinkingStage === 'done' || bioThinkingStage === 'stopped') && (
                          <div className="space-y-1">
                            <pre className="claude-serif whitespace-pre-wrap text-[#e7e5e4] text-[13.5px] leading-[1.78]">
                              {bioResponseText}
                              {bioThinkingStage === 'typing_response' && <span className="inline-block w-[2px] h-4 bg-[#d97706] ml-px align-middle animate-pulse" />}
                            </pre>
                            
                            {bioThinkingStage === 'done' && (
                              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06] mt-3">
                                <a href="https://github.com/rajtharun08" target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-stone-300 hover:text-white text-[11px] transition-all cursor-pointer font-sans">
                                  <Github size={11} /> GitHub
                                </a>
                                <a href="https://linkedin.com/in/tharun-r" target="_blank" rel="noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-stone-300 hover:text-white text-[11px] transition-all cursor-pointer font-sans">
                                  <Linkedin size={11} /> LinkedIn
                                </a>
                                <a href="mailto:rajtharun08@gmail.com"
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.07] text-stone-300 hover:text-white text-[11px] transition-all cursor-pointer font-sans">
                                  <Mail size={11} /> Email
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`flex gap-4 max-w-3xl mx-auto ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && <TharunAvatar />}

                    <div className={`space-y-1.5 text-left ${
                      isUser
                        ? 'max-w-[75%] px-4 py-3 rounded-2xl text-[13.5px] leading-relaxed flex flex-col gap-2'
                        : 'flex-1 min-w-0'
                    }`} style={isUser ? { background: 'var(--bg-user-bubble)', color: 'var(--text-primary)', border: '1px solid var(--border)' } : {}}>
                      
                      {isUser && msg.files && msg.files.map((file, fidx) => (
                        <div key={fidx} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] w-fit select-none">
                          <File size={12} className="text-zinc-400" />
                          <span className="text-[11px] text-zinc-300 font-medium font-sans">{file.name}</span>
                        </div>
                      ))}

                      {msg.type === 'sys' && (
                        <div className="text-zinc-500 pl-3 border-l border-zinc-700 text-[10.5px] font-mono font-bold leading-normal">
                          {msg.text}
                        </div>
                      )}

                      {msg.type === 'output' && (
                        <div className="claude-serif select-text whitespace-pre-wrap">
                          {msg.text}
                        </div>
                      )}

                      {!msg.type && (
                        <div className={isUser ? 'select-text' : 'claude-serif select-text'}>
                          {msg.text}
                        </div>
                      )}

                      {msg.type === 'error' && (
                        <div className="text-rose-400 font-bold pl-3 text-[10.5px] font-mono leading-normal uppercase">
                          {msg.text}
                        </div>
                      )}

                      {msg.type === 'raw' && (
                        <div className="mt-3">
                          {msg.content}
                        </div>
                      )}
                    </div>

                    {isUser && <UserAvatar />}
                  </div>
                );
              })}

              {/* Minigame Overlay Inline inside Decrypt thread */}
              {isDecrypting && activeThread === 'decrypt' && (
                <div className="flex gap-3.5 max-w-3xl mx-auto justify-start">
                  <TharunAvatar />
                  <div className="flex-1 border border-rose-500/30 bg-rose-950/15 p-4 rounded-xl space-y-3 text-left font-mono">
                    <div className="flex justify-between border-b border-rose-500/20 pb-1.5 text-[8.5px] animate-pulse text-rose-400">
                      <span className="font-bold">[!] BYPASS AUTHORIZATION IN PROGRESS</span>
                      <span className="font-bold text-rose-300">SHUTDOWN IN: {decryptTimeLeft}S</span>
                    </div>
                    <div className="text-[8.5px] text-rose-500/40 leading-none font-mono select-none">
                      {scrambleText}
                      <div className="mt-1 text-rose-300 font-bold border border-rose-500/20 py-1.5 px-2 bg-rose-950/30 text-center text-[10px] tracking-wider">
                        BYPASS CODE: <span className="text-white text-xs bg-rose-500/35 px-2 py-0.5 rounded font-black border border-rose-500/40 animate-pulse">{decryptPasscode}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-rose-400 leading-normal">Type the passcode in the chat bar below and hit Send to crack the firewall override!</p>
                  </div>
                </div>
              )}

              {/* Thinking — Claude dot-ring spinner or Agent Collaboration Board */}
              {thinking && (
                <div className="flex gap-4 max-w-3xl mx-auto justify-start w-full">
                  {!boardCommand && <TharunAvatar />}
                  <div className={boardCommand ? "w-full animate-fadeIn" : "flex items-center pt-2"}>
                    {boardCommand ? (
                      <AgentCollaborationBoard 
                        command={boardCommand}
                        isStopped={isBoardStopped}
                        onComplete={handleBoardComplete}
                      />
                    ) : (
                      activeThread === 'bio' || (threads[activeThread] && threads[activeThread][threads[activeThread].length - 1]?.type === 'bio-sim') ? (
                        /* If doing bio parsing, the thinking state is represented inside the message, so we don't render a second spinner here */
                        null
                      ) : (
                        <div className="thinking-dots-ring">
                          <span /><span /><span /><span />
                          <span /><span /><span /><span />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Bottom input area for standard chat */}
            <div
              className="no-print pb-5 pt-2 px-4 select-none shrink-0 z-20"
              style={{ background: 'var(--bg-main)' }}
            >
              {/* Stop generating pill */}
              <AnimatePresence>
                {thinking && (
                  <motion.div
                    key="stop-btn"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="max-w-3xl mx-auto flex justify-center mb-3"
                  >
                    <button
                      onClick={handleStopGenerating}
                      className="flex items-center gap-2 text-[12px] px-4 py-1.5 rounded-full cursor-pointer transition-all border-none"
                      style={{
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-strong)',
                        background: 'var(--bg-input)',
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: 'var(--text-secondary)' }} />
                      Stop generating
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Slash menu */}
              <AnimatePresence>
                {showAutocomplete && filteredCmds.length > 0 && (
                  <motion.div
                    key="slash-menu"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.1 }}
                    className="slash-menu max-w-3xl mx-auto mb-2"
                  >
                    {filteredCmds.map((item, i) => (
                      <div
                        key={item.cmd}
                        className={`slash-menu-item${i === acIdx ? ' active' : ''}`}
                        onMouseEnter={() => setAcIdx(i)}
                        onMouseDown={(e) => { e.preventDefault(); commitSlashCommand(item); }}
                      >
                        <span className="cmd-name">{item.cmd}</span>
                        <span className="cmd-desc">{item.desc}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Telemetry Status Indicator */}
              {tokenStats && (
                <div className="max-w-3xl mx-auto flex items-center justify-start gap-1.5 px-4 mb-2 text-[10px] text-zinc-500 select-none font-mono">
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${thinking ? 'bg-[#cc6b4d] animate-ping' : 'bg-emerald-500'}`} />
                  {thinking ? (
                    <span>Thinking and analyzing codebase...</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span>{tokenStats.time}</span>
                      <span>·</span>
                      <span>{tokenStats.tokens}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Input box */}
              <div
                className="max-w-3xl mx-auto rounded-2xl px-4 py-2.5 flex flex-col gap-1.5 relative"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
              >
                {attachedFile && (
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#242220] border border-white/[0.07] w-fit select-none">
                    <div className="w-6 h-6 rounded bg-[#d97706]/15 border border-[#d97706]/25 flex items-center justify-center">
                      <File size={11} className="text-[#d97706]" />
                    </div>
                    <span className="text-[10px] text-white font-medium font-sans">bio.pdf</span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-stone-500 hover:text-white cursor-pointer transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 w-full">
                  <button
                    id="tour-chat-attach-btn"
                    onClick={handleAttachFile}
                    className="cursor-pointer transition-colors p-1.5 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-zinc-200 shrink-0 border-none bg-transparent"
                    title="Add content"
                  >
                    <Plus size={18} />
                  </button>
                  <textarea
                    id="tour-chat-textarea"
                    ref={inputRef}
                    value={inputVal}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={thinking}
                    className="flex-1 bg-transparent border-none outline-none text-[14px] py-1 resize-none disabled:opacity-40"
                    style={{ color: 'var(--text-primary)', height: '24px', minHeight: '24px', maxHeight: '120px', fontFamily: 'inherit' }}
                    placeholder="How can I help you today? (Type / for commands...)"
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                  />
                  <button
                    id="tour-chat-send-btn"
                    onClick={() => handleSendMessage()}
                    disabled={thinking || (!inputVal.trim() && !attachedFile)}
                    className="p-2 rounded-xl text-white cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-20 shrink-0 flex items-center justify-center hover:brightness-110 border-none"
                    style={{ background: 'var(--accent)' }}
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>
              <p className="max-w-3xl mx-auto text-center mt-2.5 text-[9px]" style={{ color: 'var(--text-muted)' }}>
                Tharun can make mistakes. Please verify important info.
              </p>
            </div>
          </>
        )}

        </section>

        {/* ================= ARTIFACT PANEL (RESUME) ================= */}
        <AnimatePresence>
          {showArtifact && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full md:w-[40%] h-full border-l border-[var(--border)] flex flex-col z-35 bg-[var(--bg-sidebar)] absolute right-0 top-0 md:relative no-print"
            >
              {/* Artifact Header */}
              <div className="h-12 border-b border-[var(--border)] px-4 flex items-center justify-between select-none shrink-0 bg-[var(--bg-sidebar)]">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded border border-[var(--accent)]/20">// ARTIFACT</span>
                  <span className="text-xs font-semibold text-zinc-300">Tharun R - Academic Resume</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-zinc-400 hover:text-white cursor-pointer transition-colors"
                    title="Print Resume"
                  >
                    <Printer size={14} />
                  </button>
                  <button
                    onClick={() => { playClickTick(); setShowArtifact(false); }}
                    className="p-1.5 rounded-md hover:bg-[var(--bg-hover)] text-zinc-400 hover:text-white cursor-pointer transition-colors"
                    title="Close Panel"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Sticky jump-links bar */}
              <div className="border-b border-[var(--border)] bg-[#1b1b1b]/60 px-4 py-2 overflow-x-auto select-none scrollbar-none flex items-center gap-4 text-[10px] font-mono whitespace-nowrap text-zinc-400">
                {[
                  { id: 'art-objective', label: 'Objective' },
                  { id: 'art-education', label: 'Education' },
                  { id: 'art-projects', label: 'Projects' },
                  { id: 'art-skills', label: 'Skills' },
                  { id: 'art-cp', label: 'CP' },
                  { id: 'art-achievements', label: 'Achievements' },
                  { id: 'art-certifications', label: 'Certifications' }
                ].map(link => (
                  <button
                    key={link.id}
                    onClick={() => {
                      playClickTick();
                      document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="hover:text-[var(--accent)] cursor-pointer transition-colors border-none bg-transparent p-0"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Resume Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 artifact-panel-scroll select-text scroll-smooth bg-[#121212]">
                <div id="printable-resume-artifact" className="p-6 md:p-8 space-y-6">
                  {/* Header info */}
                  <div className="border-b border-zinc-800 pb-4">
                    <h1 className="text-2xl font-black tracking-wider uppercase text-white font-serif">Tharun R</h1>
                    <p className="text-xs text-[var(--accent)] font-semibold font-sans uppercase tracking-widest mt-1">
                      Computer Science & Business Systems Scholar
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[10px] font-mono text-zinc-400 font-sans">
                      <span>Email: rajtharun08@gmail.com</span>
                      <span>Phone: (+91) 6383589024</span>
                      <span>Location: Chennai, India</span>
                      <a href="https://github.com/rajtharun08" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">github.com/rajtharun08</a>
                      <a href="https://linkedin.com/in/tharun-r" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">linkedin.com/in/tharun-r</a>
                    </div>
                  </div>

                  {/* Objective */}
                  <div id="art-objective" className="space-y-2 scroll-mt-4">
                    <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-1 flex items-center gap-1.5 font-serif">
                      <GraduationCap size={12} className="text-[var(--accent)]" /> Career Objective
                    </h2>
                    <p className="text-[11.5px] text-zinc-400 leading-relaxed font-sans text-justify">
                      I’m a pre-final year Computer Science and Business Systems student with a strong foundation in Python and data structures. I have hands-on experience building backend systems using FastAPI and RESTful APIs. I enjoy solving algorithmic problems and am particularly interested in designing efficient systems for real-world applications.
                    </p>
                  </div>

                  {/* Education */}
                  <div id="art-education" className="space-y-3 scroll-mt-4">
                    <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-1 flex items-center gap-1.5 font-serif">
                      <GraduationCap size={12} className="text-[var(--accent)]" /> Education
                    </h2>
                    <div className="space-y-3 font-sans text-[11.5px]">
                      <div>
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>Bachelor of Technology (B.Tech) – Computer Science and Business Systems</span>
                          <span className="text-zinc-500">2023 – 2027</span>
                        </div>
                        <div className="flex justify-between text-zinc-400 mt-0.5">
                          <span>Panimalar Engineering College, Chennai, India</span>
                          <span className="text-[var(--accent)] font-semibold">CGPA: 8.75/10</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>Class XII – CBSE</span>
                          <span className="text-zinc-500">2022 – 2023</span>
                        </div>
                        <div className="flex justify-between text-zinc-400 mt-0.5">
                          <span>SKNS PMC VIVEKANANDA VIDYALAYA, Chennai, India</span>
                          <span className="text-emerald-500 font-semibold">Percentage: 83%</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>Class X – CBSE</span>
                          <span className="text-zinc-500">2020 – 2021</span>
                        </div>
                        <div className="flex justify-between text-zinc-400 mt-0.5">
                          <span>SKNS PMC VIVEKANANDA VIDYALAYA, Chennai, India</span>
                          <span className="text-emerald-500 font-semibold">Percentage: 82%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Projects */}
                  <div id="art-projects" className="space-y-4 scroll-mt-4">
                    <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-1 flex items-center gap-1.5 font-serif">
                      <Code size={12} className="text-[var(--accent)]" /> Projects
                    </h2>
                    <div className="space-y-4 text-[11.5px]">
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>LinkHist – Persistent Browser History API</span>
                          <span className="text-zinc-500 font-mono text-[10px]">Python, Flask, Postman, Pytest</span>
                        </div>
                        <div className="text-zinc-400 leading-relaxed font-sans space-y-1 select-text">
                          <div className="bullet-item">Developed a Flask-based REST API that manages browser history using a custom Doubly Linked List for efficient O(1) navigation.</div>
                          <div className="bullet-item">Engineered a JSON persistence layer to automatically synchronize in-memory history with local storage, ensuring data is preserved across server restarts.</div>
                          <div className="bullet-item">Validated the system’s state management and multi-step traversal logic through rigorous Postman testing.</div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>GhostLink – Self-Destructing URL Shortener</span>
                          <span className="text-zinc-500 font-mono text-[10px]">Python, FastAPI, SQLite, Pydantic</span>
                        </div>
                        <div className="text-zinc-400 leading-relaxed font-sans space-y-1 select-text">
                          <div className="bullet-item">Architected and developed a high-performance URL shortener featuring an automated data lifecycle engine that "ghosts" (purges) database records based on Time-to-Live (TTL) or click-limit triggers.</div>
                          <div className="bullet-item">Engineered a robust validation layer using Pydantic to enforce URL protocol standards and prevent recursive shortening, ensuring 100% data integrity.</div>
                          <div className="bullet-item">Designed a comprehensive management API for manual record revival, immediate expiration, and bulk-cleanup of expired data, maintaining a lean and optimized database state.</div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold text-zinc-300">
                          <span>JavDrop – LAN File Transfer Utility</span>
                          <span className="text-zinc-500 font-mono text-[10px]">Java, Maven, TCP/IP, Sockets, Github</span>
                        </div>
                        <div className="text-zinc-400 leading-relaxed font-sans space-y-1 select-text">
                          <div className="bullet-item">Engineered a P2P Java application for high-speed, secure file transfers across local networks, bypassing cloud dependencies.</div>
                          <div className="bullet-item">Implemented a robust client-server architecture using raw Java Sockets and optimized buffered I/O streams (8 KB buffer) to maximize throughput, ensuring 0% data loss for large file transfers (1 GB+) and preventing common 'Connection Reset' errors by minimizing disk I/O operations.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div id="art-skills" className="space-y-2.5 scroll-mt-4">
                    <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-1 flex items-center gap-1.5 font-serif">
                      <Layers size={12} className="text-[var(--accent)]" /> Technical Skills
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11.5px] font-sans text-zinc-400">
                      <div>
                        <span className="font-bold text-zinc-300 block mb-0.5">Programming Languages</span>
                        <span>Python, Java</span>
                      </div>
                      <div>
                        <span className="font-bold text-zinc-300 block mb-0.5">Frameworks & APIs</span>
                        <span>FastAPI, React.js, NumPy, RESTful API Design, Spring Boot (Foundational)</span>
                      </div>
                      <div>
                        <span className="font-bold text-zinc-300 block mb-0.5">CS Fundamentals</span>
                        <span>Data Structures, Algorithms, DBMS, OOPs</span>
                      </div>
                      <div>
                        <span className="font-bold text-zinc-300 block mb-0.5">Tools & Databases</span>
                        <span>SQLite, MySQL, Postman, Git/GitHub</span>
                      </div>
                    </div>
                  </div>

                  {/* Competitive Programming */}
                  <div id="art-cp" className="space-y-2 scroll-mt-4">
                    <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-1 flex items-center gap-1.5 font-serif">
                      <Cpu size={12} className="text-[var(--accent)]" /> Competitive Programming
                    </h2>
                    <div className="space-y-1.5 text-[11.5px] font-sans text-zinc-400">
                      <div className="bullet-item">
                        <span className="font-semibold text-zinc-300">LeetCode (Tharun_R08):</span> Top <span className="font-bold text-zinc-300">36.3% Globally</span>, Solved 330+ problems, earned 4 badges.
                      </div>
                      <div className="bullet-item">
                        <span className="font-semibold text-zinc-300">HackerRank (rajtharun08):</span> Certified in Python, SQL, & Problem Solving; earned badges in C++, C and SQL.
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div id="art-achievements" className="space-y-2 scroll-mt-4">
                    <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-1 flex items-center gap-1.5 font-serif">
                      <Beaker size={12} className="text-[var(--accent)]" /> Achievements
                    </h2>
                    <div className="space-y-1.5 text-[11.5px] font-sans text-zinc-400">
                      <div className="bullet-item">
                        <span className="font-semibold text-zinc-300">Best Paper Presenter (PECTEAM '26):</span> Recognized at an International Conference for designing <span className="italic text-zinc-300">ParkMate</span>, a software-driven smart parking reservation system.
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div id="art-certifications" className="space-y-2 scroll-mt-4">
                    <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-1 flex items-center gap-1.5 font-serif">
                      <File size={12} className="text-[var(--accent)]" /> Certifications
                    </h2>
                    <div className="space-y-1.5 text-[11.5px] font-sans text-zinc-400">
                      <div className="bullet-item">
                        <span className="font-semibold text-zinc-300">API Development & Testing:</span> Postman (API Student Expert Certified).
                      </div>
                      <div className="bullet-item">
                        <span className="font-semibold text-zinc-300">Cloud Data Management:</span> Oracle Cloud (Oracle Certified Foundations Associate).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulated cursor overlay for auto-tour */}
      {tourActive && tourCursor.visible && (
        <motion.div 
          className="fixed pointer-events-none z-[9999] flex flex-col items-start"
          animate={{ x: tourCursor.x, y: tourCursor.y }}
          transition={{ type: "tween", duration: 0.6, ease: "easeInOut" }}
          style={{
            left: 0,
            top: 0,
            transform: 'translate(-2px, -2px)', // offset slightly to align tip
          }}
        >
          {/* Mouse pointer shape */}
          <div className="relative">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#cc6b4d"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_2px_4px_rgba(204,107,77,0.5)]"
              style={{
                fill: '#cc6b4d',
                transform: 'rotate(-25deg)',
              }}
            >
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
            
            {/* Click ripple animation */}
            {tourCursor.ripple && (
              <span className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[#cc6b4d] animate-ping" />
            )}
          </div>
        </motion.div>
      )}

      {/* Skip Tour Overlay */}
      {tourActive && (
        <div className="fixed top-4 right-4 z-[9999] no-print">
          <button
            onClick={() => {
              setTourActive(false);
              setTourCursor(prev => ({ ...prev, visible: false }));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-all cursor-pointer font-mono"
          >
            <X size={10} /> Skip Tour (Esc)
          </button>
        </div>
      )}

      {/* Hidden container for rendering WebGL Synthesizer node */}
      <div className="hidden no-print">
        <AudioSynthesizer />
      </div>
    </div>
  );
};

export default App;