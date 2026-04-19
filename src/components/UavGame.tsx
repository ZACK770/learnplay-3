import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Target, 
  ShieldAlert, 
  Zap, 
  ArrowLeft,
  Trophy,
  AlertTriangle,
  Play,
  Rocket,
  MousePointer2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Dataset } from '../types';

interface UavGameProps {
  dataset: Dataset;
  onComplete: (accuracy: number) => void;
  onExit: () => void;
}

interface DroneData {
  id: string;
  text: string;
  isCorrect: boolean;
  x: number;
  y: number;
  baseY: number;
  speed: number;
  hoverTime: number;
  hoverSpeed: number;
  hoverAmp: number;
}

const UavGame: React.FC<UavGameProps> = ({ dataset, onComplete, onExit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [finalStats, setFinalStats] = useState({ score: 0, accuracy: 0, intercepts: 0, time: 0 });
  
  const engineRef = useRef({
    active: false,
    player: { x: 100, y: 300 },
    drones: [] as DroneData[],
    bullets: [] as { x: number, y: number }[],
    keys: {} as Record<string, boolean>,
    stats: { shots: 0, hits: 0, startTime: 0 },
    currentMission: null as any,
    gameItems: dataset.content.items || dataset.content.pairs || [],
    dimensions: { w: 0, h: 0 }
  });

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Initialize Canvas and Event Listeners
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
        engineRef.current.dimensions = { w: clientWidth, h: clientHeight };
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleKeyDown = (e: KeyboardEvent) => {
      engineRef.current.keys[e.code] = true;
      if (e.code === 'Space' && engineRef.current.active) shoot();
    };
    const handleKeyUp = (e: KeyboardEvent) => { engineRef.current.keys[e.code] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameState('playing');
    
    engineRef.current.active = true;
    engineRef.current.stats = { shots: 0, hits: 0, startTime: Date.now() };
    engineRef.current.drones = [];
    engineRef.current.bullets = [];
    engineRef.current.gameItems.forEach((i: any) => i.done = false);
    
    generateMission();
    lastTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const generateMission = () => {
    const remaining = engineRef.current.gameItems.filter((i: any) => !i.done);
    if (remaining.length === 0) {
      endGame(true);
      return;
    }

    const mission = remaining[Math.floor(Math.random() * remaining.length)];
    engineRef.current.currentMission = mission;
    setCurrentPrompt(mission.prompt || mission.target);

    const options = [mission.target || mission.label];
    const distractors = engineRef.current.gameItems
      .filter((i: any) => i !== mission)
      .map((i: any) => i.target || i.label);
    
    distractors.sort(() => Math.random() - 0.5);
    options.push(...distractors.slice(0, 2));
    options.sort(() => Math.random() - 0.5);

    options.forEach((txt, i) => {
      setTimeout(() => {
        if (!engineRef.current.active) return;
        const drone: DroneData = {
          id: Math.random().toString(36).substr(2, 9),
          text: txt,
          isCorrect: txt === (mission.target || mission.label),
          x: engineRef.current.dimensions.w + 100,
          y: 150 + Math.random() * (engineRef.current.dimensions.h - 300),
          baseY: 0,
          speed: 2 + Math.random() * 2,
          hoverTime: Math.random() * 100,
          hoverSpeed: 0.1,
          hoverAmp: 25
        };
        drone.baseY = drone.y;
        engineRef.current.drones.push(drone);
      }, i * 1800);
    });
  };

  const shoot = () => {
    const { player, bullets, stats } = engineRef.current;
    stats.shots++;
    bullets.push({ x: player.x + 50, y: player.y });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (gameState === 'playing') shoot();
  };

  const endGame = (victory: boolean) => {
    engineRef.current.active = false;
    cancelAnimationFrame(requestRef.current);
    
    const duration = (Date.now() - engineRef.current.stats.startTime) / 1000;
    const acc = engineRef.current.stats.shots > 0 
      ? (engineRef.current.stats.hits / engineRef.current.stats.shots) 
      : 0;
    
    setFinalStats({
      score: engineRef.current.stats.hits * 100,
      accuracy: acc,
      intercepts: engineRef.current.stats.hits,
      time: Math.floor(duration)
    });
    setGameState('gameover');
  };

  const gameLoop = (time: number) => {
    if (!engineRef.current.active || !canvasRef.current) return;
    const dt = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    const ctx = canvasRef.current.getContext('2d')!;
    const { w, h } = engineRef.current.dimensions;
    
    // Background
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, w, h);
    
    // Grid Lines for visibility
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for(let i=0; i<w; i+=80) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for(let i=0; i<h; i+=80) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    const { player, drones, bullets, keys } = engineRef.current;

    // Move Player
    const pSpeed = 10;
    if (keys['ArrowUp'] || keys['KeyW']) player.y = Math.max(50, player.y - pSpeed);
    if (keys['ArrowDown'] || keys['KeyS']) player.y = Math.min(h - 50, player.y + pSpeed);
    if (keys['ArrowLeft'] || keys['KeyA']) player.x = Math.max(50, player.x - pSpeed);
    if (keys['ArrowRight'] || keys['KeyD']) player.x = Math.min(w/2, player.x + pSpeed);

    // Draw Player (Flashy Neon Cyan)
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.shadowBlur = 20; ctx.shadowColor = '#00ffff';
    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.moveTo(35, 0); ctx.lineTo(-25, -20); ctx.lineTo(-15, 0); ctx.lineTo(-25, 20);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(5, 0, 8, 3, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();

    // Bullets
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 15; ctx.shadowColor = '#00ffff';
    for(let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += 18;
      ctx.fillRect(b.x, b.y - 2, 25, 4);
      if (b.x > w) bullets.splice(i, 1);
    }

    // Drones
    drones.forEach((d, i) => {
      d.x -= d.speed;
      d.hoverTime += d.hoverSpeed;
      d.y = d.baseY + Math.sin(d.hoverTime) * d.hoverAmp;

      // Draw Drone (Neon Green/Red)
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.shadowBlur = 25; ctx.shadowColor = d.isCorrect ? '#39ff14' : '#ff073a';
      ctx.fillStyle = d.isCorrect ? '#39ff14' : '#ff073a';
      ctx.beginPath();
      ctx.moveTo(-30, 0); ctx.lineTo(20, -20); ctx.lineTo(10, 0); ctx.lineTo(20, 20);
      ctx.closePath(); ctx.fill();

      // Drone Text Label
      ctx.shadowBlur = 0;
      ctx.font = 'bold 18px Heebo, sans-serif';
      const textWidth = ctx.measureText(d.text).width;
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(-textWidth/2 - 12, -55, textWidth + 24, 34);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.strokeRect(-textWidth/2 - 12, -55, textWidth + 24, 34);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center'; ctx.fillText(d.text, 0, -32);
      ctx.restore();

      // Collision with bullets
      bullets.forEach((b, bi) => {
        if (Math.abs(b.x - d.x) < 40 && Math.abs(b.y - d.y) < 35) {
          bullets.splice(bi, 1);
          if (d.isCorrect) {
            engineRef.current.stats.hits++;
            setScore(s => s + 100);
            engineRef.current.gameItems.find((gi: any) => (gi.target || gi.label) === d.text)!.done = true;
            drones.splice(i, 1);
            generateMission();
          } else {
            setScore(s => Math.max(0, s - 50));
            d.speed += 1; // Faster wrong drones
          }
        }
      });

      // Collision with player
      if (Math.abs(player.x - d.x) < 50 && Math.abs(player.y - d.y) < 40) {
        drones.splice(i, 1);
        setLives(l => {
          if (l <= 1) { endGame(false); return 0; }
          return l - 1;
        });
      }

      // Exit screen
      if (d.x < -150) {
        drones.splice(i, 1);
        setLives(l => {
          if (l <= 1) { endGame(false); return 0; }
          return l - 1;
        });
      }
    });

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-50 bg-[#050510] flex flex-col font-sans select-none overflow-hidden rtl group" dir="rtl">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.1),transparent_70%)] pointer-events-none" />
      
      <canvas 
        ref={canvasRef} 
        onMouseDown={handleCanvasClick}
        className="absolute inset-0 block cursor-crosshair" 
      />

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-40 bg-[length:100%_2px,3px_100%]" />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] z-40" />

      {/* Center Top HUD (Target Word Box) */}
      <AnimatePresence>
        {gameState === 'playing' && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <div className="bg-black/90 border-4 border-cyan-500/50 rounded-[32px] px-12 py-6 shadow-[0_0_50px_rgba(0,255,255,0.2)] text-center min-w-[320px]">
               <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-[0.3em] opacity-80">מטרת היירוט</span>
               </div>
               <h2 className="text-5xl font-black text-white leading-tight drop-shadow-lg">{currentPrompt}</h2>
               
               {/* Progress indicator */}
               <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden w-full border border-white/5">
                  <motion.div 
                    className="h-full bg-gradient-to-l from-cyan-600 to-blue-400 shadow-[0_0_15px_#22d3ee]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(engineRef.current.gameItems.filter((i:any)=>i.done).length / engineRef.current.gameItems.length) * 100}%` }}
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Internal Game Stats (Sidebar style) */}
      {gameState === 'playing' && (
        <div className="absolute top-8 right-8 z-30 pointer-events-none flex flex-col gap-4">
           <div className="bg-black/70 border border-cyan-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
              <span className="block text-[10px] font-black text-cyan-400 uppercase mb-1 opacity-60">SCORE</span>
              <span className="text-3xl font-black text-white font-mono">{score}</span>
           </div>
           <div className="bg-black/70 border border-red-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
              <span className="block text-[10px] font-black text-red-500 uppercase mb-1 opacity-60">HULL</span>
              <div className="flex gap-2">
                 {[1,2,3].map(i => <ShieldAlert key={i} className={cn("w-6 h-6", i <= lives ? "text-red-500 fill-red-500 animate-pulse" : "text-gray-800")} />)}
              </div>
           </div>
        </div>
      )}

      {/* Start Screen */}
      <AnimatePresence>
        {gameState === 'start' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-xl p-6"
          >
            <div className="max-w-xl w-full text-center">
              <h1 className="text-8xl font-black mb-4 text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">Iron Dome</h1>
              <p className="text-2xl font-bold bg-cyan-600 text-white inline-block px-8 py-2 rounded-full mb-12 uppercase tracking-widest shadow-2xl shadow-cyan-500/30">Drone Interceptor</p>
              
              <div className="bg-white/5 border border-white/10 rounded-[48px] p-12 mb-12 text-right shadow-2xl backdrop-blur-md">
                 <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-8">
                    <div className="w-20 h-20 bg-cyan-500/20 rounded-[32px] flex items-center justify-center border border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                       <Target className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div>
                       <h3 className="text-3xl font-black mb-1">משימה: {dataset.title}</h3>
                       <p className="text-gray-400 text-lg">יירט את המטרות שנושאות את המילים הנכונות!</p>
                    </div>
                 </div>
                 <div className="grid gap-6 text-xl text-gray-300 font-bold">
                    <p className="flex items-center gap-4 group"><MousePointer2 className="w-8 h-8 text-cyan-400 group-hover:scale-125 transition-transform" /> לחץ על המסך או (Space) לירי</p>
                    <p className="flex items-center gap-4 group"><Zap className="w-8 h-8 text-cyan-400 group-hover:scale-125 transition-transform" /> השתמש בחיצים או WASD לתנועה</p>
                    <p className="flex items-center gap-4 text-red-500/80 group"><ShieldAlert className="w-8 h-8 group-hover:scale-125 transition-transform" /> אל תיתן לכטב"מים לעבור את קו ההגנה!</p>
                 </div>
              </div>
              <button 
                onClick={startGame}
                className="w-full py-8 rounded-[32px] bg-cyan-600 text-white font-black text-4xl hover:bg-cyan-500 shadow-[0_0_50px_rgba(0,255,255,0.4)] transition-all flex items-center justify-center gap-8 group"
              >
                <Play className="w-12 h-12 fill-white group-hover:scale-110 transition-transform" />
                הזנק משימה
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'gameover' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-8"
          >
            <div className="max-w-2xl w-full text-center">
              <div className={cn("w-32 h-32 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-2xl border", lives>0?"bg-green-500/20 border-green-500/30":"bg-red-500/20 border-red-500/30")}>
                 {lives > 0 ? <Trophy className="w-16 h-16 text-green-500" /> : <AlertTriangle className="w-16 h-16 text-red-500" />}
              </div>
              <h2 className="text-8xl font-black mb-6 text-white tracking-tighter">
                {lives > 0 ? "המשימה הושלמה!" : "המשימה נכשלה"}
              </h2>
              <div className="grid grid-cols-2 gap-8 my-16">
                 <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-2xl">
                    <p className="text-lg text-gray-500 font-black mb-2 uppercase tracking-widest">ניקוד סופי</p>
                    <p className="text-7xl font-black text-cyan-400 tracking-tighter">{finalStats.score}</p>
                 </div>
                 <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-xl">
                    <p className="text-lg text-gray-500 font-black mb-2 uppercase tracking-widest">דיוק מבצעי</p>
                    <p className="text-7xl font-black text-cyan-400 tracking-tighter">{(finalStats.accuracy*100).toFixed(0)}%</p>
                 </div>
              </div>
              <button 
                onClick={() => onComplete(finalStats.accuracy)}
                className="w-full py-8 bg-cyan-600 rounded-[40px] text-3xl font-black hover:bg-cyan-500 transition-all flex items-center justify-center gap-6 shadow-[0_0_60px_rgba(0,255,255,0.3)]"
              >
                סיום ושמירת דוח
                <ArrowLeft className="w-8 h-8 rotate-180" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UavGame;
