import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import RoleSelection from './components/RoleSelection';
import Board from './components/Board';
import GameInfo from './components/GameInfo';

function App() {
  const { playerRole, triggerAIMove, currentTurn } = useGameStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { playerRole: role, gameOver } = useGameStore.getState();

      if (!role || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          useGameStore.getState().moveCursor('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          useGameStore.getState().moveCursor('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          useGameStore.getState().moveCursor('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          useGameStore.getState().moveCursor('right');
          break;
        case ' ':
          e.preventDefault();
          useGameStore.getState().confirmMove();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (playerRole) {
      if (playerRole === 'hunter' && currentTurn === 'wolf') {
        triggerAIMove();
      } else if (playerRole === 'wolf' && currentTurn === 'hunter') {
        triggerAIMove();
      }
    }
  }, [currentTurn, playerRole, triggerAIMove]);

  if (!playerRole) {
    return <RoleSelection onSelectRole={useGameStore.getState().setPlayerRole} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <GameInfo />
      <Board />
    </div>
  );
}

export default App;
