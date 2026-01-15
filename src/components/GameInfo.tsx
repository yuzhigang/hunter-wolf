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
    <div className="flex flex-col h-full w-full mx-auto px-1">
      
      {/* 1. TOP SECTION: SETTINGS & DASHBOARD */}
      <div className="flex flex-col space-y-2 mb-4 mt-2">
        
        {/* Row 1: Quick Settings - Two Rows for Side and Difficulty */}
        <div className="flex flex-col space-y-2.5 px-4 py-3 bg-black/60 backdrop-blur-md border border-white/5 rounded-md shadow-2xl">
          {/* Side Select Row */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-black text-yellow-600/90 uppercase tracking-[0.15em] text-nowrap">阵营 SIDE</span>
            <div className="flex bg-[#0a0a0a] p-1.5 rounded border border-white/10 shadow-inner">
              <button 
                onClick={() => handleRoleChange('hunter')}
                className={`px-4 py-1.5 text-[12px] font-bold uppercase transition-all rounded-sm ${playerRole === 'hunter' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
              >
                🏹 猎客
              </button>
              <button 
                onClick={() => handleRoleChange('wolf')}
                className={`px-4 py-1.5 text-[12px] font-bold uppercase transition-all rounded-sm ${playerRole === 'wolf' ? 'bg-slate-700 text-white shadow-lg shadow-slate-900/40' : 'text-slate-500 hover:text-slate-300'}`}
              >
                🐺 狼群
              </button>
            </div>
          </div>

          {/* Divider Line */}
          <div className="h-[1px] w-full bg-white/10" />

          {/* Difficulty Select Row */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-black text-yellow-600/90 uppercase tracking-[0.15em] text-nowrap">难度 LEVEL</span>
            <div className="flex bg-[#0a0a0a] p-1.5 rounded border border-white/10 shadow-inner">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`px-4 py-1.5 text-[12px] font-bold uppercase transition-all rounded-sm ${
                    difficulty === d.value ? 'bg-yellow-600 text-black shadow-lg shadow-yellow-900/40' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Battle Dashboard */}
        <div className="grid grid-cols-3 items-center bg-[#1a0f0a] border border-[#d4af37]/30 py-2 px-6 shadow-2xl rounded-md relative overflow-hidden group">
          {/* Background Highlight */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-red-900/5 opacity-50" />
          
          {/* Left: Hunter Stats */}
          <div className={`flex flex-col items-center transition-all duration-500 relative z-10 ${currentTurn === 'hunter' ? 'scale-110' : 'opacity-30 grayscale'}`}>
             <div className="flex items-center space-x-2">
                <span className="text-lg">🏹</span>
                <span className="text-2xl md:text-3xl font-medieval font-black text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">{3}</span>
             </div>
             <span className="text-[8px] font-black text-blue-400/90 uppercase tracking-[0.2em]">HUNTERS</span>
          </div>

          {/* Center: Status */}
          <div className="flex flex-col items-center relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={statusInfo.text}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`text-lg md:text-2xl font-medieval font-black tracking-[0.15em] text-center ${statusInfo.color} uppercase drop-shadow-md`}
              >
                {statusInfo.text}
              </motion.div>
            </AnimatePresence>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent mt-1" />
          </div>

          {/* Right: Wolf Stats */}
          <div className={`flex flex-col items-center transition-all duration-500 relative z-10 ${currentTurn === 'wolf' ? 'scale-110' : 'opacity-30 grayscale'}`}>
             <div className="flex items-center space-x-2">
                <span className="text-2xl md:text-3xl font-medieval font-black text-red-600 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">{wolves}</span>
                <span className="text-lg">🐺</span>
             </div>
             <span className="text-[8px] font-black text-red-500/90 uppercase tracking-[0.2em]">WOLVES</span>
          </div>
        </div>
      </div>

      {/* 2. CENTER: MAXIMIZED BOARD */}
      <div className="flex-1 flex items-center justify-center min-h-0 py-1 overflow-hidden">
         <div className="xiangqi-table w-full max-w-[min(99vw,92vh)] aspect-square shadow-2xl relative">
           <Board />
         </div>
      </div>

      {/* 3. BOTTOM: CORE ACTION (Snug to board) */}
      <div className="flex flex-col items-center mt-0.5 mb-2">
        <button 
          onClick={resetGame}
          className="btn-medieval bg-[#4a1608] border-[#d4af37]/80 py-2.5 px-16 text-[14px] md:text-[16px] font-black shadow-lg hover:scale-105 active:scale-95 transition-all group relative overflow-hidden rounded-sm"
        >
           <span className="relative z-10 flex items-center tracking-[0.2em] uppercase text-nowrap">
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
