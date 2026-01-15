import { useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import RoleSelection from './components/RoleSelection';
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
        case 'Escape':
          e.preventDefault();
          useGameStore.getState().cancelPendingMove();
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

  useEffect(() => {
    // 当角色选择后，检查是否需要立即触发AI移动
    if (playerRole) {
      const state = useGameStore.getState();
      if (playerRole === 'wolf' && state.currentTurn === 'hunter') {
        triggerAIMove();
      }
    }
  }, [playerRole, triggerAIMove]);

  if (!playerRole) {
    return <RoleSelection onSelectRole={(role) => {
      useGameStore.getState().resetGame();
      useGameStore.getState().setPlayerRole(role);
    }} />;
  }

  return (
    <div className="h-screen w-full bg-[var(--stone-dark)] flex flex-col items-center overflow-hidden relative">
      {/* Global Background Texture */}
      <div className="fixed inset-0 opacity-20 pointer-events-none bg-[url('/textures/dark-matter.png')] z-0" />
      
      <div className="flex-1 w-full max-w-6xl relative z-10 flex flex-col p-2 md:p-4">
        {/* The Game Console - Adaptive Height */}
        <GameInfo />
      </div>

      {/* Subtle Table Shadow */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-0" />
    </div>
  );
}

export default App;
