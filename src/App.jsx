import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, ExternalLink, Terminal, 
  BookOpen, Trophy, Zap, GraduationCap, 
  Layers, Mail, CheckCircle2, Code2, Binary, TrendingUp, Palette, Database, Cpu, Globe
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
        setTimeout(() => setCurChar(c => c + 1), 6);
      } else {
        setTimeout(() => { setLines(p => [...p, seq[curLine]]); setCurLine(l => l + 1); setCurChar(0); }, 100);
      }
    } else {
      setTimeout(() => setIsBooted(true), 100);
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

const TypewriterName = ({ text }) => {
  const [t, setT] = useState('');
  const [idx, setIdx] = useState(0);
  useEffect(() => { 
    if (idx < text.length) {
      const timer = setTimeout(() => { 
        setT(p => p + text[idx]); 
        setIdx(i => i + 1); 
      }, 40); 
      return () => clearTimeout(timer); 
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

// --- 4. BINARY MATRIX STREAM COMPONENTS ---
const MatrixRow = ({ items, direction = "left", speed = 20 }) => {
  const [isPaused, setIsPaused] = useState(false);
  
  return (
    <div 
      className="relative overflow-hidden py-4 border-y border-white/5 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/[0.02] transition-colors pointer-events-none" />
      <motion.div 
        className="flex whitespace-nowrap gap-12"
        animate={{ x: direction === "left" ? [0, -1000] : [-1000, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: speed, 
          ease: "linear",
          paused: isPaused 
        }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <SkillNode key={i} name={item} />
        ))}
      </motion.div>
    </div>
  );
};

const SkillNode = ({ name }) => {
  const [isHovered, setIsHovered] = useState(false);
  const binaryRef = useRef("");

  useEffect(() => {
    binaryRef.current = Array.from({ length: 8 }, () => Math.round(Math.random())).join("");
  }, []);

  return (
    <div 
      className="relative flex items-center gap-4 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="font-mono text-[10px] text-emerald-500/20 select-none">
        {binaryRef.current}
      </div>
      <motion.span 
        className={`font-black italic text-2xl md:text-4xl transition-all duration-300 ${isHovered ? 'text-emerald-400 drop-shadow-[0_0_15px_#10b981]' : 'text-slate-600'}`}
        animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
      >
        {name}
      </motion.span>
      {isHovered && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-mono text-[9px] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
        >
          [0x08] BUILD_STABLE
        </motion.div>
      )}
    </div>
  );
};

// --- 5. MAIN APP ---
const App = () => {
  const [activeSection, setActiveSection] = useState('top');
  
  const skillTiers = {
    tier1: ['Java', 'Python', 'DSA', 'Algorithms', 'DBMS', 'OOPs'],
    tier2: ['Spring Boot', 'FastAPI', 'React JS', 'Flask', 'REST APIs'],
    tier3: ['MySQL', 'SQLite', 'SQLAlchemy', 'Git', 'Maven', 'n8n']
  };

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

        <section id="skills" className="py-24 border-t border-white/5 text-left overflow-hidden">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-black italic text-white">Capabilities</h2>
            <div className="text-emerald-500 font-mono text-[10px] uppercase hidden md:block tracking-widest opacity-50">// binary_matrix_v3.0</div>
          </div>
          
          <div className="space-y-2 mb-20">
            <MatrixRow items={skillTiers.tier1} direction="left" speed={25} />
            <MatrixRow items={skillTiers.tier2} direction="right" speed={30} />
            <MatrixRow items={skillTiers.tier3} direction="left" speed={35} />
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

// --- SUB-COMPONENTS (PROJECT CARDS) ---
const CodeBackground = ({ tech, isPaused }) => {
  const snippets = {
    "FastAPI": "async def root(): return {'status': 'online'}\n@app.post('/shorten')\nlink = await db.create(url)\nlimit = click_limit - 1",
    "Java": "public static void main(String[] args) {\n  Socket s = new Socket('localhost', 8080);\n  Thread t1 = new Thread(new Handler());\n}",
    "Flask": "from flask import Flask, jsonify\napp = Flask(__name__)\n@app.route('/history')\ndef get_history():\n  return jsonify(data)",
    "NewsAPI": "response = newsapi.get_headlines(q='tech')\nfor article in response['articles']:\n  analyze_sentiment(article['content'])",
    "Swing": "JFrame frame = new JFrame('JEditor');\nJTextArea area = new JTextArea();\nframe.add(new JScrollPane(area));",
    "JS": "const ctx = canvas.getContext('2d');\nanalyzer.getByteFrequencyData(data);\nrequestAnimationFrame(animate);"
  };

  const code = snippets[tech[0]] || snippets["JS"];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none p-4 font-mono text-[9px] leading-relaxed whitespace-pre select-none">
      <motion.div animate={isPaused ? {} : { y: [0, -200] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className="mb-2">{code}</div>
        ))}
      </motion.div>
    </div>
  );
};

const BentoCard = ({ col, title, tech, repo, desc }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [terminalStep, setTerminalStep] = useState(0); 
  const [typedCommand, setTypedCommand] = useState("");
  const [typedDesc, setTypedDesc] = useState("");
  const command = "./launch_project --info";

  useEffect(() => {
    if (isHovered) {
      setTerminalStep(1);
      let i = 0;
      const cmdInterval = setInterval(() => {
        setTypedCommand(command.slice(0, i));
        i++;
        if (i > command.length) {
          clearInterval(cmdInterval);
          setTerminalStep(2);
          let j = 0;
          const descInterval = setInterval(() => {
            setTypedDesc(desc.slice(0, j));
            j++;
            if (j > desc.length) clearInterval(descInterval);
          }, 10);
        }
      }, 25);
      return () => clearInterval(cmdInterval);
    } else {
      setTerminalStep(0);
      setTypedCommand("");
      setTypedDesc("");
    }
  }, [isHovered, desc]);

  return (
    <motion.div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} whileHover={{ y: -8 }} className={`${col} relative bg-[#0d172a] border border-white/10 rounded-xl group overflow-hidden transition-all duration-700 flex flex-col min-h-[320px] text-left shadow-lg`}>
      <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/5 relative z-20">
        <div className="w-2 h-2 rounded-full bg-red-500/50" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
        <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        <span className="ml-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">{title.toLowerCase()} - bash</span>
      </div>

      <CodeBackground tech={tech} isPaused={isHovered} />

      <div className="relative z-10 p-8 flex flex-col justify-between flex-1">
        <div>
           <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl"><Zap size={20} /></div>
              <a href={repo} target="_blank" rel="noreferrer" className="text-slate-600 hover:text-emerald-400 transition-colors"><Github size={20} /></a>
           </div>
           <h3 className="text-3xl font-black italic text-white leading-none group-hover:text-emerald-400 transition-colors mb-6">{title}</h3>
           
           <div className="font-mono text-[11px] leading-relaxed min-h-[4rem]">
             {isHovered ? (
               <div className="space-y-2">
                 <div className="text-emerald-500">
                   tharun@csbs:~$ <span className="text-white">{typedCommand}</span>
                   {terminalStep === 1 && <span className="inline-block w-1.5 h-3 bg-emerald-500 ml-1 animate-pulse" />}
                 </div>
                 {terminalStep === 2 && (
                   <div className="text-slate-300">
                     {typedDesc}
                     <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-2.5 h-3.5 bg-emerald-500 ml-1 align-middle">█</motion.span>
                   </div>
                 )}
               </div>
             ) : (
               <div className="text-slate-600/30 italic">Process awaiting initialization...</div>
             )}
           </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {tech.map((t) => (
            <div key={t} className="relative group/tooltip">
              <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-md text-[10px] font-black text-emerald-500/60 hover:text-emerald-400 transition-all cursor-default uppercase">{t}</div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-emerald-500 text-[#0b1221] text-[9px] font-black rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">STACK: {t.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

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