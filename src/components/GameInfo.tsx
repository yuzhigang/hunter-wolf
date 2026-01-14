import { useGameStore } from '../store/gameStore';

export default function GameInfo() {
  const { board, currentTurn, gameOver, winner, resetGame } = useGameStore();

  const wolves = board.filter(cell => cell === 2).length;

  const getStatusText = () => {
    if (gameOver) {
      if (winner === 'hunter') {
        return '🎉 猎人胜利！狼群已被削减到3只以下';
      } else {
        return '🐺 狼群胜利！猎人已被包围';
      }
    }
    return currentTurn === 'hunter' ? '🎯 猎人的回合' : '🐺 狼群的回合';
  };

  const getStatusClass = () => {
    if (gameOver) {
      return winner === 'hunter'
        ? 'text-green-600 dark:text-green-400'
        : 'text-gray-600 dark:text-gray-400';
    }
    return 'text-gray-800 dark:text-gray-200';
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          猎人与狼
        </h1>

        <div className="space-y-3">
          <div className={`text-center text-lg font-semibold ${getStatusClass()}`}>
            {getStatusText()}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">猎人</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/20 rounded-lg p-3">
              <div className="text-sm text-gray-600 dark:text-gray-400">狼群</div>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{wolves}</div>
            </div>
          </div>

          {gameOver && (
            <button
              onClick={resetGame}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              重新开始
            </button>
          )}
        </div>
      </div>

      {!gameOver && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
          <strong>提示：</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>点击猎人选中，再点击目标位置移动</li>
            <li>猎人可以"射杀"（跳过空格吃掉狼）</li>
            <li>猎人的目标是削减狼群到3只以下</li>
            <li>狼群的目标是包围所有猎人使其无法移动</li>
          </ul>
        </div>
      )}
    </div>
  );
}
