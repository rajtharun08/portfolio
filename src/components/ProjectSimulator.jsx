import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Square, RefreshCw, Globe, Send, ShieldAlert, ArrowLeft, ArrowRight, 
  Settings, Code, Terminal, Sparkles, Smile, Frown, Meh, Trash2, CheckCircle2 
} from 'lucide-react';
import { playClickTick, playHoverBeep, playSweepSynth } from './AudioSynthesizer';

const ProjectSimulator = ({ projectId, onClose }) => {
  const containerRef = useRef(null);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      playClickTick();
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-2xl bg-[#080e1b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[550px] relative"
      >
        {/* Window Chrome Titlebar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer block hover:scale-105" onClick={onClose} />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
            <span className="text-[10px] font-mono text-text-secondary/60 uppercase tracking-widest ml-2">
              SYSTEM: SIMULATOR // {projectId.toUpperCase()}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[9px] font-mono text-text-secondary hover:text-white bg-white/5 border border-white/10 hover:border-white/20 px-2 py-0.5 rounded cursor-pointer"
          >
            ESC // CLOSE
          </button>
        </div>

        {/* Simulator Viewport */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {projectId === 'ghostlink' && <GhostLinkSim />}
          {projectId === 'javdrop' && <JavDropSim />}
          {projectId === 'linkhist' && <LinkHistSim />}
          {projectId === 'headlinehub' && <HeadlineHubSim />}
          {projectId === 'jeditor' && <JEditorSim />}
          {projectId === 'nostalgia' && <NostalgiaSim />}
        </div>
      </motion.div>
    </div>
  );
};

// ================= 1. GHOSTLINK SIMULATOR =================
const GhostLinkSim = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [timer, setTimer] = useState(10);
  const [destroyed, setDestroyed] = useState(false);
  const timerRef = useRef(null);

  const handleShorten = () => {
    if (!url.trim()) return;
    playClickTick();
    setLoading(true);
    setShortUrl('');
    setDestroyed(false);
    setTimer(10);

    const phases = [
      'Initializing hash algorithm...',
      'Encrypting target URL vector...',
      'Setting self-destruct node markers...',
      'Finalizing link socket...'
    ];

    let phaseIdx = 0;
    const interval = setInterval(() => {
      if (phaseIdx < phases.length) {
        setProgress(phases[phaseIdx]);
        phaseIdx++;
      } else {
        clearInterval(interval);
        setLoading(false);
        setShortUrl(`https://ghostlink.dev/s/${Math.random().toString(36).substring(2, 7)}`);
      }
    }, 450);
  };

  useEffect(() => {
    if (shortUrl && timer > 0 && !destroyed) {
      timerRef.current = setTimeout(() => {
        setTimer(t => t - 1);
        playHoverBeep();
      }, 1000);
    } else if (timer === 0 && !destroyed) {
      setDestroyed(true);
      playSweepSynth();
    }
    return () => clearTimeout(timerRef.current);
  }, [shortUrl, timer, destroyed]);

  const resetSim = () => {
    playClickTick();
    setUrl('');
    setShortUrl('');
    setDestroyed(false);
    setTimer(10);
  };

  return (
    <div className="space-y-6 text-left h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-xl font-bold font-display text-white">GhostLink: Self-Destructing Link Generator</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Create secure, temporary hyperlinks that dissolve from storage automatically after expiration or upon being accessed.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
        {!shortUrl && !loading && (
          <div className="space-y-3">
            <label className="block text-[10px] font-mono text-accent-primary uppercase font-black">Target URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very-secure-secret-page"
                className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-white outline-none focus:border-accent-primary"
              />
              <button
                onClick={handleShorten}
                disabled={!url.trim()}
                className="bg-accent-primary text-bg-dark text-xs font-mono font-black px-4 rounded-lg hover:opacity-90 disabled:opacity-30 cursor-pointer"
              >
                SHORTEN
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <RefreshCw size={24} className="text-accent-primary animate-spin" />
            <span className="text-xs font-mono text-accent-primary">{progress}</span>
          </div>
        )}

        {shortUrl && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono text-accent-primary uppercase font-bold">LINK CREATED</span>
              <span className="text-xs font-mono text-rose-500 font-bold flex items-center gap-1.5">
                <ShieldAlert size={12} className="animate-pulse" /> SELF-DESTRUCT IN {timer}s
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!destroyed ? (
                <motion.div 
                  key="live"
                  exit={{ scale: 0.9, filter: 'blur(10px)', opacity: 0 }}
                  className="flex items-center justify-between bg-black/40 border border-emerald-500/20 p-3 rounded-lg"
                >
                  <span className="text-xs text-emerald-400 font-mono select-all font-black">{shortUrl}</span>
                  <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                    SECURE ACTIVE
                  </span>
                </motion.div>
              ) : (
                <motion.div 
                  key="dead"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 bg-rose-500/5 border border-rose-500/20 p-3 rounded-lg text-rose-400 text-xs font-mono font-bold"
                >
                  <ShieldAlert size={14} />
                  <span>GHOSTLINK DATA PACKETS PURGED SUCCESSFULLY FROM STORAGE!</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Visual timer countdown bar */}
            {!destroyed && (
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 10, ease: 'linear' }}
                  className="h-full bg-rose-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <button 
        onClick={resetSim}
        className="w-full py-2 bg-white/5 border border-white/10 hover:border-white/20 text-xs font-mono font-bold rounded-lg text-text-secondary hover:text-white cursor-pointer"
      >
        RESET SIMULATOR
      </button>
    </div>
  );
};

// ================= 2. JAVDROP SIMULATOR =================
const JavDropSim = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'transferring', 'done'
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const triggerTransfer = (fileName) => {
    playClickTick();
    setFile(fileName);
    setStatus('transferring');
    setProgress(0);
    setLogs(['[SYS] Binding socket on port 8080...', '[SYS] Awaiting client connection...']);

    const steps = [
      { p: 15, log: '[TCP] Connection accepted from peer client 192.168.1.42' },
      { p: 30, log: '[TCP] Initializing 3-way handshake... SYN/ACK OK' },
      { p: 50, log: '[SYS] Streaming binary byte blocks... sending chunks [1-50]' },
      { p: 75, log: '[SYS] Streaming byte blocks... sending chunks [51-100]' },
      { p: 90, log: '[TCP] File package complete. Validating MD5 checksum hash...' },
      { p: 100, log: '[SYS] Verification successful! Connection sockets closed.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setLogs(prev => [...prev, steps[currentStep].log]);
        currentStep++;
        playClickTick();
      } else {
        clearInterval(interval);
        setStatus('done');
        playSweepSynth();
      }
    }, 600);
  };

  return (
    <div className="space-y-6 text-left h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-xl font-bold font-display text-white">javDrop: Multi-threaded LAN File Share</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Peer-to-peer binary file transfer system utilizing raw Java TCP sockets and multithreaded network listeners.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
        {status === 'idle' && (
          <div className="space-y-4">
            <span className="block text-[10px] font-mono text-accent-primary uppercase font-black">Select Virtual File to Stream</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'backup_db.sql', size: '2.4 MB' },
                { name: 'system_log.txt', size: '82 KB' },
                { name: 'build_dist.zip', size: '15.8 MB' }
              ].map(f => (
                <button
                  key={f.name}
                  onClick={() => triggerTransfer(f.name)}
                  className="p-3 bg-black/40 border border-white/10 hover:border-accent-primary rounded-lg text-center flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-102"
                >
                  <span className="text-xs font-mono font-bold text-white block truncate w-full">{f.name}</span>
                  <span className="text-[9px] text-text-secondary font-mono mt-1">{f.size}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {status === 'transferring' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-accent-primary animate-pulse font-bold">STREAMING: {file}</span>
              <span className="text-white font-bold">{progress}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-black/40 border border-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Simulated Shell Terminal Output */}
            <div className="h-28 bg-black/80 border border-white/5 rounded-lg p-3 font-mono text-[9px] text-emerald-400 overflow-y-auto space-y-1 scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        )}

        {status === 'done' && (
          <div className="space-y-4 py-4 flex flex-col items-center justify-center text-center">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full glow-accent-sm">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-md font-bold text-white font-display">TRANSFER COMPLETED</h4>
            <p className="text-xs text-text-secondary max-w-sm">
              Successfully established peer connection socket and pushed file payload blocks.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="px-4 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-[10px] font-mono text-white rounded-lg cursor-pointer"
            >
              TRANSFER ANOTHER FILE
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-around items-center text-[10px] font-mono text-text-secondary/50 border-t border-white/5 pt-4">
        <span>BOUND PORT: 8080</span>
        <span>PROTOCOL: TCP/IP</span>
        <span>THREAD: EXECUTOR_POOL</span>
      </div>
    </div>
  );
};

// ================= 3. LINKHIST SIMULATOR =================
const LinkHistSim = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [backStack, setBackStack] = useState(['home', 'about', 'skills']);
  const [current, setCurrent] = useState('projects');
  const [forwardStack, setForwardStack] = useState([]);

  const handleNavigate = () => {
    if (!inputUrl.trim()) return;
    playClickTick();
    setBackStack(prev => [...prev, current]);
    setCurrent(inputUrl);
    setForwardStack([]); // Clear forward stack on new navigation
    setInputUrl('');
  };

  const handleBack = () => {
    if (backStack.length === 0) return;
    playClickTick();
    const prev = backStack[backStack.length - 1];
    setForwardStack(prevForward => [...prevForward, current]);
    setCurrent(prev);
    setBackStack(prevBack => prevBack.slice(0, -1));
  };

  const handleForward = () => {
    if (forwardStack.length === 0) return;
    playClickTick();
    const next = forwardStack[forwardStack.length - 1];
    setBackStack(prevBack => [...prevBack, current]);
    setCurrent(next);
    setForwardStack(prevForward => prevForward.slice(0, -1));
  };

  return (
    <div className="space-y-6 text-left h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-xl font-bold font-display text-white">LinkHist: History Stack Simulation</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Interactive simulation showing how internet browser navigation stacks process "Back" and "Forward" routines using Double LIFO Stacks.
        </p>
      </div>

      {/* Mock Browser UI */}
      <div className="glass-panel rounded-xl border border-white/10 bg-black/40 overflow-hidden">
        {/* Navigation Toolbar */}
        <div className="flex items-center gap-2 p-3 bg-white/5 border-b border-white/5">
          <button 
            onClick={handleBack} 
            disabled={backStack.length === 0}
            className="p-1 bg-white/5 border border-white/10 rounded disabled:opacity-20 text-white cursor-pointer"
          >
            <ArrowLeft size={14} />
          </button>
          <button 
            onClick={handleForward} 
            disabled={forwardStack.length === 0}
            className="p-1 bg-white/5 border border-white/10 rounded disabled:opacity-20 text-white cursor-pointer"
          >
            <ArrowRight size={14} />
          </button>
          <div className="flex-1 flex items-center bg-black/50 border border-white/10 rounded-md px-2 py-1 text-xs font-mono text-emerald-400">
            <Globe size={12} className="text-text-secondary mr-2" />
            <span>mybrowser.os/{current}</span>
          </div>
        </div>

        {/* Input box to navigate */}
        <div className="p-3 border-b border-white/5 flex gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Type page name... (e.g. contact, blogs)"
            className="flex-1 bg-black/50 border border-white/10 rounded p-1.5 text-xs text-white outline-none focus:border-accent-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
          />
          <button
            onClick={handleNavigate}
            className="px-3 bg-accent-primary text-bg-dark text-xs font-mono font-bold rounded cursor-pointer"
          >
            NAVIGATE
          </button>
        </div>

        {/* Visual Stack Layout */}
        <div className="p-4 grid grid-cols-2 gap-4 bg-white/2">
          {/* Back Stack */}
          <div className="space-y-2 border-r border-white/5 pr-4 text-center">
            <span className="text-[9px] font-mono text-text-secondary/70 uppercase tracking-wider block">BACK STACK (LIFO)</span>
            <div className="flex flex-col-reverse gap-1.5 min-h-[90px] justify-start">
              {backStack.map((page, idx) => (
                <div key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono p-1 rounded">
                  {page}
                </div>
              ))}
              {backStack.length === 0 && <div className="text-[10px] text-text-secondary/35 italic pt-6">Stack Empty</div>}
            </div>
          </div>

          {/* Forward Stack */}
          <div className="space-y-2 text-center">
            <span className="text-[9px] font-mono text-text-secondary/70 uppercase tracking-wider block">FORWARD STACK (LIFO)</span>
            <div className="flex flex-col-reverse gap-1.5 min-h-[90px] justify-start">
              {forwardStack.map((page, idx) => (
                <div key={idx} className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono p-1 rounded">
                  {page}
                </div>
              ))}
              {forwardStack.length === 0 && <div className="text-[10px] text-text-secondary/35 italic pt-6">Stack Empty</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[9px] font-mono text-text-secondary/45">
        <span>Back elements count: {backStack.length}</span>
        <span>Forward elements count: {forwardStack.length}</span>
      </div>
    </div>
  );
};

// ================= 4. HEADLINEHUB SIMULATOR =================
const HeadlineHubSim = () => {
  const [headline, setHeadline] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const runAnalysis = () => {
    if (!headline.trim()) return;
    playClickTick();
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      // Very simple mock NLP keywords scoring
      const text = headline.toLowerCase();
      let score = 0;
      
      const posWords = ['good', 'great', 'rise', 'surge', 'boom', 'win', 'excellent', 'smart', 'growth', 'advance', 'success', 'happy'];
      const negWords = ['bad', 'fall', 'drop', 'slump', 'fail', 'crash', 'storm', 'severe', 'loss', 'warning', 'decline', 'sad'];

      posWords.forEach(w => { if (text.includes(w)) score += 35; });
      negWords.forEach(w => { if (text.includes(w)) score -= 35; });

      let sentiment = 'neutral';
      let scoreFinal = 50 + score;
      if (scoreFinal > 65) sentiment = 'positive';
      else if (scoreFinal < 35) sentiment = 'negative';

      // Clamp score
      scoreFinal = Math.max(10, Math.min(90, scoreFinal));

      setResult({
        sentiment,
        score: scoreFinal,
        confidence: 82 + Math.floor(Math.random() * 15)
      });
      setAnalyzing(false);
      playSweepSynth();
    }, 1200);
  };

  return (
    <div className="space-y-6 text-left h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-xl font-bold font-display text-white">Headlinehub: NLP News Sentiment Analyzer</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Type custom headlines to simulate natural language processing sentiment analysis, checking for Positive, Negative, or Neutral indicators.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
        <div className="space-y-2">
          <label className="block text-[10px] font-mono text-accent-primary uppercase font-bold">News Headline Input</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Technology stocks experience massive boom amid chip demands"
              className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-accent-primary"
            />
            <button
              onClick={runAnalysis}
              disabled={!headline.trim() || analyzing}
              className="bg-accent-primary text-bg-dark text-xs font-mono font-bold px-4 rounded-lg hover:opacity-90 disabled:opacity-30 cursor-pointer"
            >
              ANALYZE
            </button>
          </div>
        </div>

        {analyzing && (
          <div className="py-6 flex flex-col items-center justify-center space-y-2">
            <RefreshCw className="text-accent-primary animate-spin" size={20} />
            <span className="text-xs font-mono text-accent-primary">Executing tokenized sentiment parsing...</span>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div className="space-y-2">
              <span className="text-[9px] font-mono text-text-secondary uppercase">SENTIMENT RATING</span>
              <div className="flex items-center gap-2">
                {result.sentiment === 'positive' && (
                  <div className="flex items-center gap-2 text-emerald-400 font-black font-display text-lg">
                    <Smile /> POSITIVE
                  </div>
                )}
                {result.sentiment === 'negative' && (
                  <div className="flex items-center gap-2 text-rose-400 font-black font-display text-lg">
                    <Frown /> NEGATIVE
                  </div>
                )}
                {result.sentiment === 'neutral' && (
                  <div className="flex items-center gap-2 text-slate-400 font-black font-display text-lg">
                    <Meh /> NEUTRAL
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-mono text-text-secondary uppercase">NLP CONFIDENCE SCORE</span>
              <div className="text-white text-lg font-mono font-black">{result.confidence}%</div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                <span>NEGATIVE</span>
                <span>NEUTRAL</span>
                <span>POSITIVE</span>
              </div>
              <div className="w-full h-2 bg-black/40 border border-white/5 rounded-full overflow-hidden relative">
                <div 
                  className="absolute top-0 bottom-0 w-2 bg-white rounded-full transition-all duration-500 shadow-md shadow-white/50"
                  style={{ left: `calc(${result.score}% - 4px)` }}
                />
                <div className="w-full h-full bg-gradient-to-r from-rose-500 via-slate-600 to-emerald-500 opacity-20" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-[9px] font-mono text-text-secondary/40 text-center uppercase tracking-wider">
        MODEL: LEXICON_BASED // SCANNER: LOCAL_PAYLOAD
      </div>
    </div>
  );
};

// ================= 5. JEDITOR SIMULATOR =================
const JEditorSim = () => {
  const [editorTheme, setEditorTheme] = useState('obsidian');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const codeText = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CSBS Pipeline!");
        int result = Math.max(300, 875);
        System.out.println("Result: " + result);
    }
}`;

  const runCode = () => {
    playClickTick();
    setRunning(true);
    setOutput('');

    setTimeout(() => {
      setOutput(`[COMPILER] Java Virtual Machine v19.2.0 initialized.
[COMPILE] Compiling Main.java... Success (0.24 seconds).
[RUNNING] Executing bytecodes...
---------------------------------------------
Hello, CSBS Pipeline!
Result: 875
---------------------------------------------
Process completed with exit code 0.
Execution metrics: CPU time = 12ms, Allocated RAM = 42KB.`);
      setRunning(false);
      playSweepSynth();
    }, 1000);
  };

  const getThemeClass = () => {
    switch (editorTheme) {
      case 'obsidian': return 'bg-[#0f111a] text-slate-100';
      case 'cyberpunk': return 'bg-[#1a0e2e] text-fuchsia-300';
      case 'light': return 'bg-[#f8fafc] text-slate-800';
      default: return 'bg-[#000] text-emerald-400';
    }
  };

  return (
    <div className="space-y-6 text-left h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-xl font-bold font-display text-white">JEditor: Lightweight Desktop IDE</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Desktop text and code editor built with Java Swing and custom theme configurations.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-xl border border-white/5 bg-white/5 space-y-4">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex gap-2">
            {['obsidian', 'cyberpunk', 'light'].map(t => (
              <button
                key={t}
                onClick={() => { playClickTick(); setEditorTheme(t); }}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border cursor-pointer ${
                  editorTheme === t 
                    ? 'bg-accent-primary text-bg-dark border-accent-primary' 
                    : 'bg-white/5 border-white/10 text-text-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={runCode}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1 bg-accent-primary text-bg-dark text-[10px] font-mono font-black rounded-lg hover:opacity-90 cursor-pointer"
          >
            <Play size={10} fill="currentColor" /> {running ? 'COMPILING...' : 'RUN'}
          </button>
        </div>

        {/* Editor Screen Mockup */}
        <div className={`p-4 rounded-lg font-mono text-[10px] leading-relaxed border border-white/5 min-h-[120px] whitespace-pre select-text overflow-x-auto ${getThemeClass()}`}>
          {codeText}
        </div>

        {/* Console output */}
        {output && (
          <div className="space-y-1">
            <span className="text-[8px] font-mono text-text-secondary/70 uppercase tracking-widest block">// OUTPUT CONSOLE</span>
            <div className="bg-black/95 border border-white/10 p-3 rounded-lg font-mono text-[9px] text-emerald-400 whitespace-pre leading-relaxed max-h-[100px] overflow-y-auto scrollbar-thin">
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ================= 6. NOSTALGIA MACHINE =================
const NostalgiaSim = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState(Array(15).fill(2));
  const animFrame = useRef(null);

  const togglePlay = () => {
    playClickTick();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      const updateBars = () => {
        setVisualizerBars(prev => prev.map(() => Math.max(2, Math.floor(Math.random() * 26))));
        animFrame.current = requestAnimationFrame(updateBars);
      };
      updateBars();
    } else {
      cancelAnimationFrame(animFrame.current);
      setVisualizerBars(Array(15).fill(2));
    }
    return () => cancelAnimationFrame(animFrame.current);
  }, [isPlaying]);

  return (
    <div className="space-y-6 text-left h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-xl font-bold font-display text-white">Nostalgia Machine: Skeuomorphic Music Cassette</h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          Interactive skeuomorphic cassette player simulation designed with high-quality custom animations.
        </p>
      </div>

      <div className="glass-panel p-5 rounded-xl border border-white/5 bg-[#0e1017] space-y-6 flex flex-col items-center">
        {/* Cassette Tape Mockup */}
        <div className="w-[280px] h-[160px] bg-gradient-to-br from-[#1c1e28] to-[#14151c] border-2 border-slate-700/60 rounded-xl p-4 relative flex flex-col justify-between shadow-2xl">
          {/* Label Area */}
          <div className="w-full bg-[#fce7f3] border-b-4 border-rose-400 rounded-md p-1.5 text-center flex flex-col justify-center">
            <span className="text-[9px] font-mono font-bold text-slate-800 tracking-wider">RETRO_SYNTH_WAVE.TAP</span>
            <span className="text-[7px] font-mono text-slate-500/80">SIDE A // CSBS_SELECTION</span>
          </div>

          {/* Tape window showing spools */}
          <div className="w-[180px] h-[45px] bg-[#090a0f] border-2 border-slate-800 rounded-lg mx-auto flex items-center justify-around p-1 relative overflow-hidden">
            {/* Left Spool */}
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 3.5, ease: 'linear' } : {}}
              className="w-8 h-8 rounded-full border-4 border-dashed border-slate-600 flex items-center justify-center relative"
            >
              <div className="w-2.5 h-2.5 bg-slate-700 rounded-full" />
            </motion.div>

            {/* Middle see-through tape body */}
            <div className="w-12 h-6 border-y border-dashed border-slate-800/20 bg-amber-900/10 flex items-center justify-center">
              <div className="w-8 h-0.5 bg-[#f59e0b]/30 animate-pulse" />
            </div>

            {/* Right Spool */}
            <motion.div 
              animate={isPlaying ? { rotate: 360 } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 3.5, ease: 'linear' } : {}}
              className="w-8 h-8 rounded-full border-4 border-dashed border-slate-600 flex items-center justify-center relative"
            >
              <div className="w-2.5 h-2.5 bg-slate-700 rounded-full" />
            </motion.div>
          </div>

          {/* Cassette bottom details */}
          <div className="flex justify-between px-2 text-[7px] font-mono text-slate-500">
            <span>● 90 MINUTES</span>
            <span>NR [ON]</span>
          </div>
        </div>

        {/* Tape controls */}
        <div className="flex gap-4 items-center">
          <button
            onClick={togglePlay}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isPlaying 
                ? 'bg-rose-500/10 border-rose-500/35 text-rose-500 glow-accent-sm' 
                : 'bg-white/5 border-white/10 text-white hover:border-accent-primary'
            }`}
          >
            {isPlaying ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono text-text-secondary uppercase">PLAYER ENGINE</span>
            <span className="text-xs font-mono font-bold text-white uppercase">{isPlaying ? 'STREAMING RETRO' : 'DECK STANDBY'}</span>
          </div>
        </div>

        {/* Vintage EQ Bars */}
        <div className="flex gap-[3px] h-8 items-end justify-center w-full max-w-[200px]">
          {visualizerBars.map((h, idx) => (
            <div
              key={idx}
              className="w-[6px] bg-accent-primary rounded-t-sm transition-all duration-100"
              style={{ 
                height: `${h}px`,
                backgroundColor: isPlaying ? 'var(--primary-accent)' : 'rgba(255,255,255,0.05)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectSimulator;
