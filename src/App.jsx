import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, ExternalLink, Terminal, 
  BookOpen, Trophy, Zap, GraduationCap, 
  Layers, Mail, CheckCircle2, Code2, Binary, TrendingUp, Palette
} from 'lucide-react';

// --- 1. NEURAL NETWORK BACKGROUND ---
const NeuralNetworkBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 1.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 80; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        
        const dxMouse = p.x - mouse.current.x;
        const dyMouse = p.y - mouse.current.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 150) {
          ctx.strokeStyle = `rgba(16, 185, 129, ${1 - distMouse / 150})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.stroke();
        }

        for (let j = i; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.2 - dist / 500})`;
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });

    resize(); init(); animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-40 z-0" />;
};

// --- 2. ROTATING TAGLINE ---
const RotatingTagline = () => {
  const [index, setIndex] = useState(0);
  const words = ["Building Scalable APIs", "Algorithmic Efficiency", "High-Performance Code", "Optimization"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-emerald-400 font-mono text-lg md:text-xl mb-8">
      <span className="text-slate-500">Focused on</span>
      <div className="relative h-8 overflow-hidden inline-block min-w-[250px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute left-0 font-black italic"
          >
            [{words[index]}]
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- 3. TERMINAL HERO ---
const TerminalIntro = () => {
  const [lines, setLines] = useState([]);
  const [curLine, setCurLine] = useState(0);
  const [curChar, setCurChar] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const seq = [
    { text: "tharun@csbs:~$ ./launch_portfolio.sh", color: "text-emerald-500" },
    { text: "[BOOTING SYSTEM...]", color: "text-slate-400" },
    { text: "> Initializing... [OK]", color: "text-emerald-400" },
    { text: "> Finalizing... [OK]", color: "text-emerald-400" },
    { text: "> System Status: Online", color: "text-white" },
  ];

  useEffect(() => {
    if (curLine < seq.length) {
      if (curChar < seq[curLine].text.length) {
        setTimeout(() => setCurChar(c => c + 1), 5);
      } else {
        setTimeout(() => { setLines(p => [...p, seq[curLine]]); setCurLine(l => l + 1); setCurChar(0); }, 30);
      }
    } else {
      setTimeout(() => setIsBooted(true), 400);
    }
  }, [curLine, curChar]);

  return (
    <div className="min-h-[130px] flex flex-col justify-end">
      <AnimatePresence mode="wait">
        {!isBooted ? (
          <motion.div key="t" exit={{ opacity: 0, y: -20, filter: "blur(10px)" }} className="font-mono p-6 bg-black/40 border border-emerald-500/20 rounded-xl backdrop-blur-md">
            {lines.map((l, i) => <div key={i} className={`${l.color} text-xs md:text-sm font-bold`}>{l.text}</div>)}
            {curLine < seq.length && <div className={`${seq[curLine].color} text-xs md:text-sm font-bold`}>{seq[curLine].text.substring(0, curChar)}<span className="inline-block w-2 h-4 bg-emerald-500 ml-1" /></div>}
          </motion.div>
        ) : (
          <motion.div key="g" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-0 text-emerald-500 text-sm uppercase tracking-[0.4em]">Hi, I am</div>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none"><TypewriterName text="Tharun" /></h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// FIXED TYPEWRITER COMPONENT (Cleanup added)
const TypewriterName = ({ text }) => {
  const [t, setT] = useState('');
  const [idx, setIdx] = useState(0);
  useEffect(() => { 
    if (idx < text.length) {
      const timer = setTimeout(() => { 
        setT(p => p + text[idx]); 
        setIdx(i => i + 1); 
      }, 40); 
      return () => clearTimeout(timer); // Cleanup function to prevent TTarun
    } 
  }, [idx, text]);
  return <span className="text-emerald-400">{t}<span className="inline-block w-1 h-12 md:h-16 bg-emerald-400 ml-1 align-middle" /></span>;
};

const SimpleAvatarVisual = () => {
  const tags = ['{sys}', '<01/>', '[08]', 'arch', 'core', 'fapi', 'java', 'py', 'db', 'logic', 'dev'];
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-[3rem] bg-[#0b1221]">
      <div className="absolute w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full" />
      {[...Array(20)].map((_, i) => (
        <motion.div key={i} animate={{ y: [0, -100, 0], opacity: [0, 0.5, 0] }} transition={{ duration: 3 + (i % 5), repeat: Infinity, delay: i * 0.2 }} className="absolute text-emerald-400/40 font-mono text-[9px] font-bold" style={{ top: `${15 + (i * 4)}%`, left: `${10 + (i * 4)}%` }}>{tags[i % tags.length]}</motion.div>
      ))}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48 text-slate-200 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        <path d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" />
      </svg>
    </div>
  );
};

const RevealSection = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8 }}>{children}</motion.div>;
};

// --- 4. MAIN APP ---
const App = () => {
  const [activeSection, setActiveSection] = useState('top');
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'education', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 300;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(section); break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="top" className="relative bg-[#0b1221] text-slate-300 min-h-screen font-sans selection:bg-emerald-500/30 selection:text-emerald-200 scroll-smooth overflow-x-hidden font-black italic tracking-tighter">
      <NeuralNetworkBackground />
      
      <div className="fixed left-8 bottom-0 hidden 2xl:flex flex-col items-center gap-6 pointer-events-none opacity-20 z-50">
        <span className="[writing-mode:vertical-lr] text-[10px] font-mono tracking-[0.5em] text-emerald-500 uppercase">System Status: Optimal</span>
        <div className="w-[1px] h-32 bg-emerald-500/50" />
      </div>
      <div className="fixed right-8 bottom-0 hidden 2xl:flex flex-col items-center gap-6 pointer-events-none opacity-20 z-50">
        <span className="[writing-mode:vertical-lr] text-[10px] font-mono tracking-[0.5em] text-slate-500 uppercase">Compile-Create-Conquer</span>
        <div className="w-[1px] h-32 bg-slate-500/50" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0b1221; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #34d399; }
      `}} />

      <nav className="fixed top-0 w-full z-50 bg-[#0b1221]/90 backdrop-blur-sm border-b border-white/5">
        <div className="w-full px-8 md:px-16 h-16 flex items-center justify-between">
          <a href="#top" className="text-white font-mono text-lg font-black">{'<THARUN />'}</a>
          <div className="hidden md:flex space-x-8 text-sm uppercase">
            {['About', 'Education', 'Skills', 'Projects', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`transition-all duration-300 ${activeSection === item.toLowerCase() ? 'text-emerald-400 font-black border-b-2 border-emerald-400 pb-1' : 'text-slate-400 hover:text-emerald-400'}`}>{item}</a>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 w-full px-8 md:px-20 pt-24">
        <section id="top" className="min-h-[75vh] flex items-center mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="hidden md:flex h-[450px]"><SimpleAvatarVisual /></motion.div>
            <div className="flex flex-col">
              <TerminalIntro />
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}>
                <h2 className="text-2xl md:text-4xl font-black italic text-slate-500 mt-2 mb-2 leading-tight">
                  Specializing in <span className="text-slate-200 underline decoration-emerald-500/50 underline-offset-4">Computer Science & Business Systems</span>.
                </h2>
                <RotatingTagline />
                <div className="flex gap-4">
                  <a href="#projects" className="px-8 py-4 bg-emerald-500 text-[#0b1221] rounded-xl font-black text-sm hover:scale-105 transition-all shadow-lg shadow-emerald-500/20 inline-block uppercase">View Builds</a>
                  <div className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-[10px] font-mono text-slate-500 uppercase tracking-widest"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />Status: Online</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="about" className="py-24 border-t border-white/5 text-left">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
             <div className="lg:col-span-2">
                <h2 className="text-4xl font-black italic text-white mb-8">About Me</h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium not-italic tracking-normal">
                  I’m Tharun, a highly motivated and naturally curious professional with a strong passion for learning, problem-solving, and driving meaningful impact. I thrive in dynamic and challenging environments where collaboration, creativity, and continuous growth are valued. My approach is rooted in curiosity and a desire to explore innovative ideas, constantly seeking opportunities to expand my skill set and contribute to projects that make a difference. I am driven by the goal of creating effective solutions, improving processes, and delivering value that positively impacts both teams and communities.
                </p>
             </div>
             <div className="bg-[#0d172a] border border-white/5 p-6 rounded-3xl space-y-4">
               <h4 className="text-emerald-500 text-xs uppercase font-black tracking-widest mb-4 flex items-center gap-2"><Zap size={14} /> Quick Facts</h4>
               <div className="flex items-center gap-3 text-slate-300 font-bold text-sm"><Palette className="text-emerald-400" size={18} /><span>Origami Artist</span></div>
               <div className="flex items-center gap-3 text-slate-300 font-bold text-sm"><TrendingUp className="text-emerald-400" size={18} /><span>Avid Learner</span></div>
               <div className="flex items-center gap-3 text-slate-300 font-bold text-sm"><Code2 className="text-emerald-400" size={18} /><span>Problem Solver</span></div>
             </div>
           </div>
        </section>

        <section id="education" className="py-24 border-t border-white/5 text-left">
          <h2 className="text-4xl font-black italic text-white mb-20">Education</h2>
          <div className="w-full max-w-4xl relative">
             <EducationNode year="2023-27" title="B Tech in Computer Science and Business Systems" sub="Panimalar Engineering College" desc="CGPA: 8.75/10" icon={<GraduationCap />} isFirst />
             <EducationNode year="2022-23" title="Higher Secondary XII" sub="SKNS PMC Vivekananda Vidyalaya" desc="Percentage: 83%" icon={<Layers />} />
             <EducationNode year="2020-21" title="Secondary School X" sub="SKNS PMC Vivekananda vidyalaya" desc="Percentage: 82%" icon={<BookOpen />} isLast />
          </div>
        </section>

        <section id="skills" className="py-24 border-t border-white/5 text-left">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-black italic text-white">Capabilities</h2>
            <div className="text-emerald-500 font-mono text-[10px] uppercase hidden md:block tracking-widest opacity-50">// stack_v2.0_stable</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 text-left">
            <SkillCategory title="Programming" items={['Java', 'Python']} icon={Code2} />
            <SkillCategory title="Frameworks" items={['Spring Boot', 'FastAPI', 'React JS', 'Flask']} icon={Layers} />
            <SkillCategory title="Core CS" items={['DSA', 'Algorithms', 'DBMS', 'OOPs']} icon={Binary} />
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Trophy size={140} className="text-emerald-500" /></div>
            <div className="flex items-center justify-between mb-8 text-left">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl shadow-lg"><Trophy size={24} /></div>
                <div><h3 className="text-xl font-black text-white uppercase italic">LeetCode Mastery</h3><p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Competitive Programming</p></div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-end">
                  <div><span className="text-4xl font-black text-white italic">300+</span><p className="text-slate-500 text-[10px] uppercase">Problems Solved</p></div>
                  <div className="text-right"><span className="text-emerald-400 font-black italic text-lg">Top 36.3%</span><p className="text-slate-500 text-[10px] uppercase">Global Rank</p></div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden p-[2px]">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '40%' }} transition={{ duration: 1.5 }} className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_#10b981]" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                {['Strings', 'Arrays', 'Linked List', 'Trees'].map((tag) => (
                  <div key={tag} className="px-4 py-2 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 bg-emerald-500/5 uppercase hover:bg-emerald-500/20 transition-all cursor-default">{tag}</div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="projects" className="py-24 border-t border-white/5 text-left">
           <h2 className="text-4xl font-black italic text-white mb-16 text-right">Project Lab</h2>
           <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
             <BentoCard col="md:col-span-7" title="GhostLink" tech={['FastAPI', 'SQLite3', 'Python']} desc="Self-destructing URL shortener with click limits." repo="https://github.com/rajtharun08/GhostLink" />
             <BentoCard col="md:col-span-5" title="javDrop" tech={['Java', 'TCP', 'Thread']} desc="Secure LAN file transfer utility." repo="https://github.com/rajtharun08/JavDrop" />
             <BentoCard col="md:col-span-5" title="LinkHist" tech={['Flask', 'DSA', 'Python']} desc="Browser history simulation API." repo="https://github.com/rajtharun08/browser-history-api" />
             <BentoCard col="md:col-span-7" title="Headlinehub" tech={['NewsAPI', 'Python', 'NLP']} desc="Multilingual news scraper and analysis." repo="https://github.com/rajtharun08/headlinehub" />
             <BentoCard col="md:col-span-6" title="JEditor" tech={['Java', 'Swing', 'AWT']} desc="Lightweight desktop text editor." repo="https://github.com/rajtharun08/JEditor" />
             <BentoCard col="md:col-span-6" title="Nostalgia Machine" tech={['JS', 'HTML5', 'CSS3']} desc="Skeuomorphic audio player." repo="https://github.com/rajtharun08/nostalgia-machine" />
           </div>
        </section>

        <section id="contact" className="py-32 text-center border-t border-white/5">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-12">Let's Build</h2>
          <div className="flex justify-center gap-8">
            <MagneticLink href="https://github.com/rajtharun08"><Github size={28} className="text-slate-400 group-hover:text-emerald-400 transition-colors" /></MagneticLink>
            <MagneticLink href="https://linkedin.com"><Linkedin size={28} className="text-slate-400 group-hover:text-emerald-400" /></MagneticLink>
            <MagneticLink href="mailto:rajtharun08@gmail.com"><Mail size={28} className="text-slate-400 group-hover:text-emerald-400" /></MagneticLink>
          </div>
        </section>
      </main>

      <footer className="relative z-20 py-12 border-t border-white/5 text-center bg-[#0d172a]">
         <p className="text-[10px] uppercase font-black tracking-widest text-slate-600">© Tharun | CSBS</p>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS (TOOLTIPS & ROADMAP) ---
const BentoCard = ({ col, title, tech, repo, desc }) => (
  <motion.div whileHover={{ y: -8 }} className={`${col} p-10 bg-[#0d172a] border border-white/5 rounded-[2.5rem] group hover:border-emerald-500/20 transition-all duration-700 flex flex-col justify-between min-h-[320px] text-left shadow-lg`}>
    <div>
       <div className="flex justify-between items-start mb-10">
          <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-2xl"><Zap size={24} /></div>
          <a href={repo} className="text-slate-600 hover:text-emerald-400 transition-colors"><Github size={22} /></a>
       </div>
       <h3 className="text-4xl font-black italic text-white leading-none group-hover:text-emerald-400 transition-colors">{title}</h3>
       <p className="text-slate-400 text-sm mt-4">{desc}</p>
    </div>
    <div className="flex flex-wrap gap-2 mt-6">
      {tech.map((t) => (
        <div key={t} className="relative group/tooltip">
          <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] font-black text-emerald-500/60 hover:text-emerald-400 transition-all cursor-default uppercase">{t}</div>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-emerald-500 text-[#0b1221] text-[9px] font-black rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">STACK: {t.toUpperCase()}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

const EducationNode = ({ year, title, sub, icon, isFirst, isLast }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex gap-12 group min-h-[160px] text-left">
      <div className="flex flex-col items-center">
        <div className="w-[2px] flex-1 bg-emerald-500/10 relative overflow-hidden">
          {!isFirst && <motion.div initial={{ height: 0 }} animate={isInView ? { height: '100%' } : { height: 0 }} transition={{ duration: 1.5 }} className="absolute top-0 left-0 w-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />}
        </div>
        <div className="relative w-14 h-14 flex items-center justify-center bg-[#0b1221] border-2 border-emerald-500 text-emerald-500 rounded-2xl group-hover:shadow-[0_0_30px_#10b981] transition-all">
          {React.cloneElement(icon, { size: 22 })}
        </div>
        <div className="w-[2px] flex-1 bg-emerald-500/10 relative overflow-hidden">
          {!isLast && <motion.div initial={{ height: 0 }} animate={isInView ? { height: '100%' } : { height: 0 }} transition={{ duration: 1.5, delay: 0.5 }} className="absolute top-0 left-0 w-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />}
        </div>
      </div>
      <div className="pb-16 pt-2">
         <span className="text-emerald-500 text-sm font-black tracking-widest block mb-2">{year}</span>
         <h3 className="text-2xl font-black italic text-white group-hover:text-emerald-400 transition-colors leading-tight">{title}</h3>
         <p className="text-slate-500 text-sm uppercase mt-1 font-bold tracking-widest">{sub}</p>
      </div>
    </div>
  );
};

const SkillCategory = ({ title, items, icon: Icon }) => (
  <div className="p-8 rounded-[2rem] bg-[#0d172a] border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:scale-110 transition-transform"><Icon size={20} /></div>
      <h4 className="text-emerald-500 text-xs uppercase font-black tracking-[0.3em]">{title}</h4>
    </div>
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <span key={item} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-sm font-bold text-slate-300 group-hover:text-white transition-all">{item}</span>
      ))}
    </div>
  </div>
);

const MagneticLink = ({ children, href }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.35, y: middleY * 0.35 });
  };
  return (
    <motion.a ref={ref} href={href} target="_blank" rel="noreferrer" onMouseMove={handleMouseMove} onMouseLeave={() => setPosition({ x: 0, y: 0 })} animate={{ x: position.x, y: position.y }} transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }} className="p-6 bg-[#0d172a] border border-white/10 rounded-2xl hover:border-emerald-500/30 transition-all group inline-block">
      {children}
    </motion.a>
  );
};

export default App;