import { useGameStore } from '../store/gameStore';
import { HUNTER, WOLF } from '../lib/types';
import { motion } from 'framer-motion';

const BOARD_SIZE = 500;
const CELL_SIZE = BOARD_SIZE / 5;
const GAP = 8;

function getCellCoordinates(pos: number) {
  const row = Math.floor(pos / 5);
  const col = pos % 5;
  return {
    x: col * CELL_SIZE + GAP / 2,
    y: row * CELL_SIZE + GAP / 2,
  };
}

export default function Board() {
  const {
    board,
    selectedPiece,
    validMoves,
    snipeTargets,
    cursorPosition,
    playerRole,
  } = useGameStore();

  const handleCellClick = (pos: number) => {
    const latestState = useGameStore.getState();
    const { validMoves, snipeTargets } = latestState;

    const cell = board[pos];
    const currentTurn = latestState.currentTurn;
    const isHunter = cell === HUNTER && currentTurn === 'hunter' && playerRole === 'hunter';
    const isWolf = cell === WOLF && currentTurn === 'wolf' && playerRole === 'wolf';
    const isSnipeTargetValid = snipeTargets.includes(pos);

    if (isHunter || isWolf) {
      latestState.selectPiece(pos);
    } else if (selectedPiece !== null && (validMoves.includes(pos) || isSnipeTargetValid)) {
      latestState.executeMovePiece(pos);
    } else {
      latestState.cancelPendingMove();
    }
  };

  return (
    <div className="flex flex-col items-center relative max-h-full max-w-full">
      {/* Outer Glow for the board */}
      <div className="absolute inset-0 bg-[#d4af37]/5 blur-2xl rounded-lg pointer-events-none" />

      <svg
        viewBox={`0 0 ${BOARD_SIZE} ${BOARD_SIZE}`}
        className="w-full h-full max-h-[92vh] aspect-square relative z-10 drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
      >
        <defs>
          <linearGradient id="woodInlay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fefae0" />
            <stop offset="100%" stopColor="#faedcd" />
          </linearGradient>

          <radialGradient id="hunterStone" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="70%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>

          <radialGradient id="wolfStone" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="70%" stopColor="#374151" />
            <stop offset="100%" stopColor="#111827" />
          </radialGradient>

          <filter id="pieceShadow" x="-20%" y="-20%" width="150%" height="150%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main Board Surface */}
        <rect
          x={0}
          y={0}
          width={BOARD_SIZE}
          height={BOARD_SIZE}
          fill="url(#woodInlay)"
          rx={2}
        />

        {/* Traditional Double Border */}
        <rect x={4} y={4} width={BOARD_SIZE-8} height={BOARD_SIZE-8} fill="none" stroke="#8b5e34" strokeWidth={1} />
        <rect x={10} y={10} width={BOARD_SIZE-20} height={BOARD_SIZE-20} fill="none" stroke="#8b5e34" strokeWidth={3} />

        {/* Grid Lines - Inset Wood Style */}
        {[...Array(5)].map((_, i) => (
          <g key={i}>
            <line
              x1={CELL_SIZE / 2}
              y1={i * CELL_SIZE + CELL_SIZE / 2}
              x2={BOARD_SIZE - CELL_SIZE / 2}
              y2={i * CELL_SIZE + CELL_SIZE / 2}
              stroke="#8b5e34"
              strokeWidth={1.5}
              opacity={0.8}
            />
            <line
              x1={i * CELL_SIZE + CELL_SIZE / 2}
              y1={CELL_SIZE / 2}
              x2={i * CELL_SIZE + CELL_SIZE / 2}
              y2={BOARD_SIZE - CELL_SIZE / 2}
              stroke="#8b5e34"
              strokeWidth={1.5}
              opacity={0.8}
            />
          </g>
        ))}

        {/* Decorative Center Cross (Like Xiangqi River area markers) */}
        <path d="M 240 250 L 260 250 M 250 240 L 250 260" stroke="#8b5e34" strokeWidth={1} opacity={0.4} />

        {/* Cells and Pieces */}
        {board.map((cell, index) => {
          const { x, y } = getCellCoordinates(index);
          const isValidMove = validMoves.includes(index);
          const isSnipeTarget = snipeTargets.includes(index);
          const isSelected = selectedPiece === index;
          const isCursor = cursorPosition === index;

          return (
            <g key={index} onClick={() => handleCellClick(index)} cursor="pointer">
              {/* Interaction highlight */}
              <motion.circle
                cx={x + (CELL_SIZE - GAP) / 2}
                cy={y + (CELL_SIZE - GAP) / 2}
                r={CELL_SIZE / 2 - 4}
                fill={
                  isSelected
                    ? 'rgba(59, 130, 246, 0.15)'
                    : isSnipeTarget
                    ? 'rgba(239, 68, 68, 0.2)'
                    : isValidMove
                    ? 'rgba(34, 197, 94, 0.15)'
                    : 'transparent'
                }
              />

              {/* Cursor Highlight - Classic corners style */}
              {isCursor && (
                <g>
                   <path d={`M ${x+5} ${y+15} L ${x+5} ${y+5} L ${x+15} ${y+5}`} fill="none" stroke="#d4af37" strokeWidth={2} />
                   <path d={`M ${x+CELL_SIZE-GAP-15} ${y+5} L ${x+CELL_SIZE-GAP-5} ${y+5} L ${x+CELL_SIZE-GAP-5} ${y+15}`} fill="none" stroke="#d4af37" strokeWidth={2} />
                   <path d={`M ${x+5} ${y+CELL_SIZE-GAP-15} L ${x+5} ${y+CELL_SIZE-GAP-5} ${x+15} ${y+CELL_SIZE-GAP-5}`} fill="none" stroke="#d4af37" strokeWidth={2} />
                   <path d={`M ${x+CELL_SIZE-GAP-15} ${y+CELL_SIZE-GAP-5} L ${x+CELL_SIZE-GAP-5} ${y+CELL_SIZE-GAP-5} L ${x+CELL_SIZE-GAP-5} ${y+CELL_SIZE-GAP-15}`} fill="none" stroke="#d4af37" strokeWidth={2} />
                </g>
              )}

              {/* Grid Intersection Points */}
              <circle
                cx={x + (CELL_SIZE - GAP) / 2}
                cy={y + (CELL_SIZE - GAP) / 2}
                r={3}
                fill="#8b5e34"
                opacity={0.4}
              />

              {/* Valid move indicator - elegant dot */}
              {isValidMove && (
                <circle
                  cx={x + (CELL_SIZE - GAP) / 2}
                  cy={y + (CELL_SIZE - GAP) / 2}
                  r={6}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth={2}
                  opacity={0.6}
                />
              )}

              {/* Snipe target indicator - pulsing ring */}
              {isSnipeTarget && (
                <motion.circle
                  cx={x + (CELL_SIZE - GAP) / 2}
                  cy={y + (CELL_SIZE - GAP) / 2}
                  r={10}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth={2}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}

              {/* Piece */}
              {(cell === HUNTER || cell === WOLF) && (
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: isSelected ? 1.1 : 1 }}
                  filter="url(#pieceShadow)"
                >
                  <circle
                    cx={x + (CELL_SIZE - GAP) / 2}
                    cy={y + (CELL_SIZE - GAP) / 2}
                    r={CELL_SIZE / 2 - 12}
                    fill={cell === HUNTER ? 'url(#hunterStone)' : 'url(#wolfStone)'}
                    stroke={isSelected ? '#d4af37' : '#2c1810'}
                    strokeWidth={isSelected ? 3 : 1}
                  />
                  
                  {/* Diegetic Label (Traditional Piece Look) */}
                  <text
                    x={x + (CELL_SIZE - GAP) / 2}
                    y={y + (CELL_SIZE - GAP) / 2 + 6}
                    textAnchor="middle"
                    fill={cell === HUNTER ? '#dbeafe' : '#f3f4f6'}
                    fontSize="18"
                    fontWeight="bold"
                    fontFamily="MedievalSharp"
                    className="select-none pointer-events-none"
                    opacity={0.9}
                  >
                    {cell === HUNTER ? 'H' : 'W'}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
