import { useState } from 'react';

interface RoleSelectionProps {
  onSelectRole: (role: 'hunter' | 'wolf') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const [hovered, setHovered] = useState<'hunter' | 'wolf' | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
          猎人与狼
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          选择你要扮演的角色
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <button
          onClick={() => onSelectRole('hunter')}
          onMouseEnter={() => setHovered('hunter')}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered('hunter')}
          onBlur={() => setHovered(null)}
          className={`
            relative p-8 rounded-2xl transition-all duration-300 transform
            ${hovered === 'hunter' ? 'scale-105 shadow-2xl' : 'shadow-lg hover:scale-105'}
            bg-gradient-to-br from-blue-500 to-blue-600 text-white
            focus:outline-none focus:ring-4 focus:ring-blue-400
          `}
        >
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4">🏹</div>
            <h2 className="text-2xl font-bold mb-2">猎人</h2>
            <p className="text-center text-blue-100 text-sm">
              控制 3 枚猎人棋子<br />
              可以隔空射杀狼<br />
              目标：消灭狼至 3 只以下
            </p>
          </div>
          {hovered === 'hunter' && (
            <div className="absolute -top-2 -right-2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                推荐新手
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => onSelectRole('wolf')}
          onMouseEnter={() => setHovered('wolf')}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered('wolf')}
          onBlur={() => setHovered(null)}
          className={`
            relative p-8 rounded-2xl transition-all duration-300 transform
            ${hovered === 'wolf' ? 'scale-105 shadow-2xl' : 'shadow-lg hover:scale-105'}
            bg-gradient-to-br from-red-500 to-red-600 text-white
            focus:outline-none focus:ring-4 focus:ring-red-400
          `}
        >
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4">🐺</div>
            <h2 className="text-2xl font-bold mb-2">狼群</h2>
            <p className="text-center text-red-100 text-sm">
              控制 15 枚狼棋子<br />
              逐步合围猎人<br />
              目标：让所有猎人无法移动
            </p>
          </div>
          {hovered === 'wolf' && (
            <div className="absolute -top-2 -right-2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                挑战性
              </span>
            </div>
          )}
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>💡 提示：选择后可以用键盘方向键移动棋子，空格键确认</p>
      </div>
    </div>
  );
}
