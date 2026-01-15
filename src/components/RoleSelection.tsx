import { useState } from 'react';
import { motion } from 'framer-motion';

interface RoleSelectionProps {
  onSelectRole: (role: 'hunter' | 'wolf') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const [hovered, setHovered] = useState<'hunter' | 'wolf' | null>(null);

  return (
    <div className="min-h-screen w-full bg-[var(--stone-dark)] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="fixed inset-0 opacity-10 pointer-events-none bg-[url('/textures/dark-matter.png')] z-0" />
      
      <motion.div
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 mb-4 drop-shadow-2xl">
          猎人与狼
        </h1>
        <div className="flex items-center justify-center space-x-4">
          <div className="h-px w-12 bg-yellow-600/50" />
          <p className="text-xl text-yellow-500/80 font-medieval tracking-widest uppercase">
            Hunter & Wolf · Strategic Battlefield
          </p>
          <div className="h-px w-12 bg-yellow-600/50" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl mb-12 relative z-10">
        {/* Hunter Card */}
        <motion.button
          onClick={() => onSelectRole('hunter')}
          onMouseEnter={() => setHovered('hunter')}
          onMouseLeave={() => setHovered(null)}
          className={`
            relative group p-1 rounded-sm transition-all duration-500
            ${hovered === 'hunter' ? 'scale-105 rotate-1' : ''}
          `}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className={`
            absolute inset-0 bg-blue-600 blur-2xl opacity-0 transition-opacity duration-500
            ${hovered === 'hunter' ? 'opacity-20' : ''}
          `} />
          
          <div className="game-card h-full p-8 flex flex-col items-center border-blue-900/30">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 animate-pulse" />
              <svg width="100" height="100" viewBox="0 0 80 80" className="relative z-10">
                <defs>
                  <radialGradient id="hunterCardGradient" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#1D4ED8" />
                  </radialGradient>
                </defs>
                <circle cx="40" cy="40" r="35" fill="url(#hunterCardGradient)" stroke="#1e3a8a" strokeWidth="2" />
                <path d="M40 20 L40 60 M20 40 L60 40" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <circle cx="40" cy="40" r="10" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 2" />
              </svg>
            </div>

            <h2 className="text-4xl font-medieval font-bold mb-4 text-slate-900">猎人</h2>
            
            <div className="space-y-3 text-slate-700 text-lg mb-8 font-medium italic">
              <div className="flex items-center">
                <span className="w-8 text-center">🏹</span>
                <span>精锐 3 人组</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 text-center">⚡</span>
                <span>隔空射杀之术</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 text-center">💀</span>
                <span>斩草除根</span>
              </div>
            </div>

            <div className="mt-auto w-full">
              <div className="btn-medieval w-full text-center py-4 text-xl">
                成为猎人
              </div>
            </div>
          </div>
        </motion.button>

        {/* Wolf Card */}
        <motion.button
          onClick={() => onSelectRole('wolf')}
          onMouseEnter={() => setHovered('wolf')}
          onMouseLeave={() => setHovered(null)}
          className={`
            relative group p-1 rounded-sm transition-all duration-500
            ${hovered === 'wolf' ? 'scale-105 -rotate-1' : ''}
          `}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`
            absolute inset-0 bg-red-600 blur-2xl opacity-0 transition-opacity duration-500
            ${hovered === 'wolf' ? 'opacity-20' : ''}
          `} />

          <div className="game-card h-full p-8 flex flex-col items-center border-red-900/30">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gray-600 blur-xl opacity-20" />
              <svg width="100" height="100" viewBox="0 0 80 80" className="relative z-10">
                <defs>
                  <radialGradient id="wolfCardGradient" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#9CA3AF" />
                    <stop offset="100%" stopColor="#374151" />
                  </radialGradient>
                </defs>
                <circle cx="40" cy="40" r="35" fill="url(#wolfCardGradient)" stroke="#111827" strokeWidth="2" />
                <circle cx="40" cy="40" r="15" fill="rgba(0,0,0,0.3)" />
                <path d="M30 35 Q40 25 50 35 L40 55 Z" fill="rgba(255,255,255,0.1)" />
              </svg>
            </div>

            <h2 className="text-4xl font-medieval font-bold mb-4 text-slate-900">狼群</h2>
            
            <div className="space-y-3 text-slate-700 text-lg mb-8 font-medium italic">
              <div className="flex items-center">
                <span className="w-8 text-center">🐺</span>
                <span>15 狼众之威</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 text-center">⛓️</span>
                <span>围猎合围之策</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 text-center">🌑</span>
                <span>暗影统领</span>
              </div>
            </div>

            <div className="mt-auto w-full">
              <div className="btn-medieval bg-gradient-to-b from-slate-700 to-slate-900 border-slate-950 w-full text-center py-4 text-xl">
                统领狼群
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      <motion.div
        className="relative z-10 bg-black/40 backdrop-blur-md px-8 py-4 rounded-full border border-yellow-600/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-yellow-600 mt-4 font-medieval tracking-widest text-sm uppercase flex items-center space-x-4">
          <span>⌨️ Arrow Keys to Select</span>
          <span className="h-1 w-1 bg-yellow-600 rounded-full" />
          <span>Space to Confirm</span>
        </p>
      </motion.div>
    </div>
  );
}
