import { create } from 'zustand';
import type { Board, Position, Difficulty } from '../lib/types';
import { createInitialBoard } from '../lib/board';
import { movePiece, getValidMoves } from '../lib/moves';
import { snipe, getPossibleSnipes } from '../lib/snipe';
import { checkGameOver } from '../lib/gameState';
import { getAIMove } from './aiStore';
import { vibrateOnCapture, vibrateOnMove, vibrateOnWin, vibrateOnLoss } from '../hooks/useVibration';

interface GameStore {
  board: Board;
  currentTurn: 'hunter' | 'wolf';
  selectedPiece: Position | null;
  gameOver: boolean;
  winner: 'hunter' | 'wolf' | null;
  validMoves: Position[];
  snipeTargets: Position[];
  isThinking: boolean;
  playerRole: 'hunter' | 'wolf' | null;
  cursorPosition: Position | null;
  difficulty: Difficulty;

  resetGame: () => void;
  setPlayerRole: (role: 'hunter' | 'wolf') => void;
  setDifficulty: (difficulty: Difficulty) => void;
  selectPiece: (pos: Position) => void;
  executeMovePiece: (to: Position) => void;
  makeAIMove: (aiMove: { from: Position; to: Position; isSnipe?: boolean }) => void;
  triggerAIMove: () => Promise<void>;
  moveCursor: (direction: 'up' | 'down' | 'left' | 'right') => void;
  cancelPendingMove: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  board: createInitialBoard(),
  currentTurn: 'hunter',  // 猎人先手
  selectedPiece: null,
  gameOver: false,
  winner: null,
  validMoves: [],
  snipeTargets: [],
  isThinking: false,
  playerRole: null,
  cursorPosition: 12,
  difficulty: 'medium',

  resetGame: () => set(() => ({
    board: createInitialBoard(),
    currentTurn: 'hunter',
    selectedPiece: null,
    gameOver: false,
    winner: null,
    validMoves: [],
    snipeTargets: [],
    isThinking: false,
    cursorPosition: 12,
  })),

  setPlayerRole: (role) => set({ playerRole: role }),

  setDifficulty: (difficulty) => set({ difficulty }),

  cancelPendingMove: () => set(() => {
    return { selectedPiece: null, validMoves: [], snipeTargets: [] };
  }),

  selectPiece: (pos) => set((state) => {
    if (state.gameOver) return state;

    const cell = state.board[pos];

    if (cell === 0) {
      if (state.selectedPiece !== null && state.validMoves.includes(pos)) {
        return { ...state, selectedPiece: null, validMoves: [], snipeTargets: [] };
      }
      return { selectedPiece: null, validMoves: [], snipeTargets: [] };
    }

    if (state.currentTurn === 'hunter' && cell === 1 && state.playerRole === 'hunter') {
      const moves = getValidMoves(state.board, pos);
      const snipes = getPossibleSnipes(state.board, pos);

      return { selectedPiece: pos, validMoves: moves, snipeTargets: snipes };
    }

    if (state.currentTurn === 'wolf' && cell === 2 && state.playerRole === 'wolf') {
      const moves = getValidMoves(state.board, pos);
      return { selectedPiece: pos, validMoves: moves, snipeTargets: [] };
    }

    return state;
  }),

  makeAIMove: (aiMove) => set((state) => {
    if (state.gameOver) return state;

    let newBoard: Board;

    if (aiMove.isSnipe) {
      newBoard = snipe(state.board, aiMove.from, aiMove.to);
      vibrateOnCapture();
    } else {
      newBoard = movePiece(state.board, aiMove.from, aiMove.to);
      vibrateOnMove();
    }

    const gameResult = checkGameOver(newBoard);

    if (gameResult.gameOver) {
      if (gameResult.winner === state.playerRole) vibrateOnWin();
      else vibrateOnLoss();
    }

    return {
      board: newBoard,
      currentTurn: gameResult.gameOver ? state.currentTurn : (state.currentTurn === 'hunter' ? 'wolf' : 'hunter'),
      gameOver: gameResult.gameOver,
      winner: gameResult.winner,
    };
  }),

  triggerAIMove: async () => {
    const state = get();
    if (state.gameOver) return;

    // AI扮演的角色与当前回合相同
    const aiRole = state.currentTurn;
    set({ isThinking: true });

    // 根据AI角色和难度调整搜索深度
    let depth: number;
    const { difficulty } = state;

    if (aiRole === 'wolf') {
      const wolvesCount = state.board.filter(cell => cell === 2).length;
      if (difficulty === 'easy') {
        depth = 3;
      } else if (difficulty === 'medium') {
        depth = wolvesCount > 10 ? 4 : 5;
      } else {
        depth = 6;
      }
    } else {
      if (difficulty === 'easy') {
        depth = 4;
      } else if (difficulty === 'medium') {
        depth = 6;
      } else {
        depth = 8;
      }
    }

    const aiMove = await getAIMove(state.board, depth, 1500, aiRole);

    set({ isThinking: false });

    if (aiMove) {
      get().makeAIMove(aiMove);
    }
  },

  executeMovePiece: (to) => set((state) => {
    if (state.selectedPiece === null) return state;

    const pieceType = state.board[state.selectedPiece];
    const isHunter = pieceType === 1;
    const isWolf = pieceType === 2;

    if (isHunter && state.currentTurn === 'hunter') {
      if (state.snipeTargets.includes(to)) {
        const newBoard = snipe(state.board, state.selectedPiece, to);
        const gameResult = checkGameOver(newBoard);

        vibrateOnCapture();
        if (gameResult.gameOver) {
          if (gameResult.winner === 'hunter') vibrateOnWin();
          else vibrateOnLoss();
        }

        return {
          ...state,
          board: newBoard,
          selectedPiece: null,
          validMoves: [],
          snipeTargets: [],
          currentTurn: gameResult.gameOver ? state.currentTurn : 'wolf',
          gameOver: gameResult.gameOver,
          winner: gameResult.winner,
        };
      }

      if (state.validMoves.includes(to)) {
        const newBoard = movePiece(state.board, state.selectedPiece, to);
        const gameResult = checkGameOver(newBoard);

        vibrateOnMove();

        return {
          ...state,
          board: newBoard,
          selectedPiece: null,
          validMoves: [],
          snipeTargets: [],
          currentTurn: gameResult.gameOver ? state.currentTurn : 'wolf',
          gameOver: gameResult.gameOver,
          winner: gameResult.winner,
        };
      }
    }

    if (isWolf && state.currentTurn === 'wolf' && state.playerRole === 'wolf') {
      if (state.validMoves.includes(to)) {
        const newBoard = movePiece(state.board, state.selectedPiece, to);
        const gameResult = checkGameOver(newBoard);

        vibrateOnMove();

        return {
          ...state,
          board: newBoard,
          selectedPiece: null,
          validMoves: [],
          snipeTargets: [],
          currentTurn: gameResult.gameOver ? state.currentTurn : 'hunter',
          gameOver: gameResult.gameOver,
          winner: gameResult.winner,
        };
      }
    }

    return state;
  }),

  moveCursor: (direction) => set((state) => {
    if (state.cursorPosition === null) return state;

    const currentRow = Math.floor(state.cursorPosition / 5);
    const currentCol = state.cursorPosition % 5;
    let newRow = currentRow;
    let newCol = currentCol;

    switch (direction) {
      case 'up':
        newRow = Math.max(0, currentRow - 1);
        break;
      case 'down':
        newRow = Math.min(4, currentRow + 1);
        break;
      case 'left':
        newCol = Math.max(0, currentCol - 1);
        break;
      case 'right':
        newCol = Math.min(4, currentCol + 1);
        break;
    }

    return { cursorPosition: newRow * 5 + newCol };
  }),
}));
