import { useGameStore } from '../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { Difficulty } from '../lib/types';
import Board from './Board';

export default function GameInfo() {
  const { 
    board, currentTurn, gameOver, winner, resetGame, 
    playerRole, setPlayerRole, difficulty, setDifficulty 
  } = useGameStore();

  const wolves = board.filter((cell: number) => cell === 2).length;

  const statusInfo = gameOver 
    ? (winner === 'hunter' ? { text: '猎人凯旋', color: 'text-blue-500' } : { text: '狼群吞噬', color: 'text-red-600' })
    : (currentTurn === 'hunter' ? { text: '猎客局', color: 'text-blue-400' } : { text: '狼群局', color: 'text-red-400' });

  const difficulties: { label: string; value: Difficulty }[] = [
    { label: '新兵', value: 'easy' },
    { label: '老兵', value: 'medium' },
    { label: '统帅', value: 'hard' },
  ];

  const handleRoleChange = (role: 'hunter' | 'wolf') => {
    resetGame();
    setPlayerRole(role);
  };

  return (
    <div className="flex flex-col h-full w-full mx-auto px-0.5">
      
      {/* 1. TOP SECTION: SETTINGS (Very compact) */}
      <div className="flex flex-col space-y-0.5 mb-1">
        
        {/* Row 1: Quick Settings (Ultra compact) */}
        <div className="flex items-center justify-between px-2 py-0.5 bg-black/50 backdrop-blur-sm border-b border-white/5">
          {/* Side Select */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[7px] font-black text-yellow-600/60 uppercase tracking-widest text-nowrap">阵营 Side</span>
            <div className="flex bg-[#0a0a0a] p-0.5 rounded border border-white/5">
              <button 
                onClick={() => handleRoleChange('hunter')}
                className={`px-2 py-0.5 text-[7px] font-bold uppercase transition-all rounded-sm ${playerRole === 'hunter' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                🏹 猎客
              </button>
              <button 
                onClick={() => handleRoleChange('wolf')}
                className={`px-2 py-0.5 text-[7px] font-bold uppercase transition-all rounded-sm ${playerRole === 'wolf' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                🐺 狼群
              </button>
            </div>
          </div>

          {/* Difficulty Select */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[7px] font-black text-yellow-600/60 uppercase tracking-widest text-nowrap">难度 Level</span>
            <div className="flex bg-[#0a0a0a] p-0.5 rounded border border-white/5">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`px-2 py-0.5 text-[7px] font-bold uppercase transition-all rounded-sm ${
                    difficulty === d.value ? 'bg-yellow-600 text-black' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Battle Dashboard (Ultra slim) */}
        <div className="grid grid-cols-3 items-center bg-[#1a0f0a] border-y border-[#d4af37]/20 py-0.5 px-4 shadow-lg">
          {/* Left: Hunter Stats */}
          <div className={`flex flex-col items-center transition-all duration-500 ${currentTurn === 'hunter' ? 'scale-105' : 'opacity-20 grayscale'}`}>
             <div className="flex items-center space-x-1">
                <span className="text-sm">🏹</span>
                <span className="text-xl font-medieval font-black text-blue-500">{3}</span>
             </div>
             <span className="text-[5px] font-black text-blue-400/70 uppercase tracking-widest">Hunters</span>
          </div>

          {/* Center: Status */}
          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={statusInfo.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-sm md:text-base font-medieval font-black tracking-widest text-center ${statusInfo.color} uppercase`}
              >
                {statusInfo.text}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Wolf Stats */}
          <div className={`flex flex-col items-center transition-all duration-500 ${currentTurn === 'wolf' ? 'scale-105' : 'opacity-20 grayscale'}`}>
             <div className="flex items-center space-x-1">
                <span className="text-xl font-medieval font-black text-red-600">{wolves}</span>
                <span className="text-sm">🐺</span>
             </div>
             <span className="text-[5px] font-black text-red-500/70 uppercase tracking-widest">Wolves</span>
          </div>
        </div>
      </div>

      {/* 2. CENTER: MAXIMIZED BOARD (Fill space) */}
      <div className="flex-1 flex items-center justify-center min-h-0 py-0.5 overflow-hidden">
         <div className="xiangqi-table w-full max-w-[min(99vw,92vh)] aspect-square shadow-2xl relative">
           <Board />
         </div>
      </div>

      {/* 3. BOTTOM: CORE ACTION (Snug to board) */}
      <div className="flex flex-col items-center mt-1 mb-1">
        <button 
          onClick={resetGame}
          className="btn-medieval bg-[#4a1608] border-[#d4af37]/80 py-1 px-12 text-[9px] font-black shadow-lg hover:scale-105 active:scale-95 transition-all group relative overflow-hidden rounded-sm"
        >
           <span className="relative z-10 flex items-center tracking-widest uppercase text-nowrap">
             🔄 重整棋局 RESTART
           </span>
        </button>

        {/* Global Progress Line (Integrated into tiny bottom margin) */}
        <div className="w-full max-w-xs mt-1.5 h-0.5 bg-black/60 rounded-full overflow-hidden relative opacity-40">
           <motion.div 
             className="h-full bg-gradient-to-r from-blue-900 via-yellow-600 to-red-900 shadow-[0_0_5px_rgba(212,175,55,0.3)]"
             initial={{ width: 0 }}
             animate={{ width: `${((15-wolves)/12)*100}%` }}
             transition={{ duration: 1.5, ease: "easeInOut" }}
           />
        </div>
      </div>

    </div>
  );
}
