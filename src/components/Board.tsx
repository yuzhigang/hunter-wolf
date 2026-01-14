import { useGameStore } from '../store/gameStore';
import { EMPTY, HUNTER, WOLF } from '../lib/types';
import Piece from './Piece';

export default function Board() {
  const { board, selectedPiece, validMoves, snipeTargets, selectPiece, moveHunter, cursorPosition, playerRole } = useGameStore();

  const handleClick = (pos: number) => {
    const cell = board[pos];

    if (cell === HUNTER && useGameStore.getState().currentTurn === 'hunter' && playerRole === 'hunter') {
      selectPiece(pos);
    } else if (cell === WOLF && useGameStore.getState().currentTurn === 'wolf' && playerRole === 'wolf') {
      selectPiece(pos);
    } else if (selectedPiece !== null && (validMoves.includes(pos) || snipeTargets.includes(pos))) {
      moveHunter(pos);
    }
  };

  const getCellClass = (pos: number) => {
    const cell = board[pos];
    const isValidMove = validMoves.includes(pos);
    const isSnipeTarget = snipeTargets.includes(pos);
    const isSelected = selectedPiece === pos;
    const isCursor = cursorPosition === pos;

    let classes = 'aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 relative ';

    if (isCursor) {
      classes += 'ring-4 ring-yellow-400 ring-opacity-80 z-10 ';
    }

    if (cell === EMPTY) {
      if (isValidMove) {
        classes += 'bg-green-200 dark:bg-green-800 ';
      } else if (isSnipeTarget) {
        classes += 'bg-red-200 dark:bg-red-800 animate-pulse ';
      } else {
        classes += 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 ';
      }
    } else {
      if (isSelected) {
        classes += 'bg-blue-100 dark:bg-blue-900/30 ';
      } else {
        classes += 'bg-gray-100 dark:bg-gray-800 ';
      }
    }

    return classes;
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="grid grid-cols-5 grid-rows-5 gap-2 aspect-square">
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={getCellClass(index)}
          >
            {cell === HUNTER && (
              <Piece
                type="hunter"
                isSelected={selectedPiece === index}
                onClick={() => handleClick(index)}
              />
            )}
            {cell === WOLF && (
              <Piece type="wolf" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
