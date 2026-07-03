import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Activity } from 'lucide-react';

// Global shared Audio Context for UI sound effects (to bypass initialization lag)
let uiAudioCtx = null;
let currentWaveform = 'triangle'; // Default oscillator type
let activeOscillators = []; // References to currently running drone oscillators
let noiseBuffer = null; // Cached white noise buffer for mechanical keyboard clacks

const getUiAudioCtx = () => {
  if (!uiAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    uiAudioCtx = new AudioContext();
  }
  return uiAudioCtx;
};

const getNoiseBuffer = (ctx) => {
  if (!noiseBuffer) {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noiseBuffer = buffer;
  }
  return noiseBuffer;
};

// Setter to dynamically adjust the synthesizer drone chord's timbre/waveform in real-time
export const setDroneWaveform = (type) => {
  currentWaveform = type;
  activeOscillators.forEach((osc) => {
    try {
      osc.type = type;
    } catch (e) {
      // Ignore if oscillator is stopped or not initialized yet
    }
  });
};

// Exported UI Sound Effect: Sci-fi Hover Beep
export const playHoverBeep = () => {
  try {
    const ctx = getUiAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch A5
    
    gain.gain.setValueAtTime(0.012, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08); // Quick decay
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

// Exported UI Sound Effect: Tactile Cyber Click Tick
export const playClickTick = () => {
  try {
    const ctx = getUiAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime); // Mid pitch A4

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05); // Fast decay

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  } catch (e) {}
};

// Exported UI Sound Effect: Organic Mechanical Keyboard Keypress
export const playKeyboardClick = () => {
  try {
    const ctx = getUiAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const time = ctx.currentTime;
    
    // --- 1. Tactile mechanical cap bottom out (noise clack) ---
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = getNoiseBuffer(ctx);
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    // Deep clack frequency (around 120-180Hz) to sound like solid key switches
    const filterFreq = 130 + Math.random() * 60;
    noiseFilter.frequency.setValueAtTime(filterFreq, time);
    noiseFilter.Q.setValueAtTime(2.0, time); 
    
    const noiseGain = ctx.createGain();
    // Fast clack decay (about 12ms to 20ms)
    const clackDecay = 0.012 + Math.random() * 0.008;
    noiseGain.gain.setValueAtTime(0.32, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + clackDecay);
    
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    
    noiseNode.start(time);
    noiseNode.stop(time + clackDecay + 0.01);

    // --- 2. Metallic contact spring switch tap (switch click) ---
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    const clickFilter = ctx.createBiquadFilter();
    
    // Switch contact pitch is medium-high (700Hz - 1100Hz)
    const clickFreq = 700 + Math.random() * 400;
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(clickFreq, time);
    clickOsc.frequency.exponentialRampToValueAtTime(clickFreq * 0.6, time + 0.025);
    
    clickFilter.type = 'bandpass';
    clickFilter.frequency.setValueAtTime(clickFreq, time);
    clickFilter.Q.setValueAtTime(1.2, time);
    
    const tickDecay = 0.008 + Math.random() * 0.006; // 8ms to 14ms
    clickGain.gain.setValueAtTime(0.038, time);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, time + tickDecay);
    
    clickOsc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    
    clickOsc.start(time);
    clickOsc.stop(time + tickDecay + 0.01);
  } catch (e) {}
};

// Exported UI Sound Effect: Cinematic Synthesizer frequency sweep (for 3D tab flips)
export const playSweepSynth = () => {
  try {
    const ctx = getUiAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    // Start low, exponential sweep upwards
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, ctx.currentTime); // Start A2
    osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.42); // Sweep to F#5

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45); // Fade sweep

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.48);
  } catch (e) {}
};

const AudioSynthesizer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef(null);
  
  // Audio Nodes refs
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Global autoplay policy unlock listener
  useEffect(() => {
    const unlockAudio = () => {
      try {
        const ctx = getUiAudioCtx();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().then(() => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
          });
        }
      } catch (e) {}
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    // Create Context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Create Analyser
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyserRef.current = analyser;

    // Create Biquad Filter (to make it a warm low-pass space rumble)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, ctx.currentTime); // Deeper filtering

    // Create Main Gain Node
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.0, ctx.currentTime); // Start silent
    gainNodeRef.current = gainNode;

    filter.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Generate Space Drone chord (A minor triad: A1, E2, C3)
    const frequencies = [55.00, 82.41, 130.81]; 
    const oscillators = [];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      // Assign the active waveform
      osc.type = currentWaveform;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Create a slow volume modulator (LFO)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.04 + idx * 0.015, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.06, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      lfo.start();
      osc.connect(filter);
      osc.start();

      oscillators.push(osc);
      oscillators.push(lfo);
    });

    // Save running drone oscillators to the global array
    activeOscillators = oscillators.filter(node => node.frequency !== undefined);
  };

  const togglePlayback = () => {
    playClickTick();

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    if (!audioCtxRef.current) {
      initAudio();
    }

    const ctx = audioCtxRef.current;
    const gain = gainNodeRef.current;

    if (isPlaying) {
      // Fade out slowly
      gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.8);
      setTimeout(() => {
        setIsPlaying(false);
      }, 800);
    } else {
      setIsPlaying(true);
      // Fade in slowly
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1.0);
    }
  };

  // Render Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(dataArray);
      }

      const barWidth = (W / bufferLength) * 1.5;
      let x = 0;
      
      // Query active theme primary color in RGB
      const primaryRGB = getComputedStyle(document.documentElement).getPropertyValue('--primary-accent-rgb') || '16, 185, 129';

      for (let i = 0; i < bufferLength; i++) {
        let barHeight = isPlaying 
          ? (dataArray[i] / 255) * H * 0.8
          : (Math.sin(Date.now() * 0.0035 + i * 0.45) + 1) * H * 0.1;

        if (barHeight < 2) barHeight = 2;

        ctx.fillStyle = isPlaying 
          ? `rgba(${primaryRGB.trim()}, ${0.45 + (i / bufferLength) * 0.45})`
          : 'rgba(255, 255, 255, 0.08)';
        
        ctx.fillRect(x, H - barHeight, barWidth - 1.5, barHeight);
        x += barWidth;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (activeOscillators.length > 0) {
        activeOscillators.forEach(osc => {
          try {
            osc.stop();
          } catch(e) {}
        });
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
      activeOscillators = [];
    };
  }, []);

  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-3 relative border border-white/5 shadow-lg select-none text-left">
      <div className="absolute top-2 right-3 text-[7px] font-mono text-slate-500">// AMBIENT_DECK</div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={12} className={isPlaying ? 'text-emerald-400 animate-pulse' : 'text-slate-500'} />
          <span className="font-mono text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            {isPlaying ? 'AUDIO STREAMING' : 'AUDIO STANDBY'}
          </span>
        </div>
        
        <button
          onClick={togglePlayback}
          className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer clickable ${
            isPlaying 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/10' 
              : 'bg-white/5 border-white/10 text-slate-400 hover:border-emerald-500/25 hover:text-emerald-400'
          }`}
        >
          {isPlaying ? (
            <svg className="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      <div className="h-8 bg-black/20 border border-white/5 rounded-lg overflow-hidden relative">
        <canvas 
          ref={canvasRef} 
          width={180} 
          height={32} 
          className="w-full h-full block"
        />
      </div>
    </div>
  );
};

export default AudioSynthesizer;
