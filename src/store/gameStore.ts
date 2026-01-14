import { create } from 'zustand';
import type { Board, Position } from '../lib/types';
import { createInitialBoard } from '../lib/board';
import { movePiece, getValidMoves } from '../lib/moves';
import { canSnipe, snipe } from '../lib/snipe';
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

  resetGame: () => void;
  setPlayerRole: (role: 'hunter' | 'wolf') => void;
  selectPiece: (pos: Position) => void;
  executeMovePiece: (to: Position) => void;
  moveHunter: (to: Position) => void;
  hunterSnipe: (to: Position) => void;
  makeAIMove: (aiMove: { from: Position; to: Position; isSnipe?: boolean }) => void;
  triggerAIMove: () => Promise<void>;
  moveCursor: (direction: 'up' | 'down' | 'left' | 'right') => void;
  confirmMove: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  board: createInitialBoard(),
  currentTurn: 'hunter',
  selectedPiece: null,
  gameOver: false,
  winner: null,
  validMoves: [],
  snipeTargets: [],
  isThinking: false,
  playerRole: null,
  cursorPosition: 12,

  resetGame: () => set({
    board: createInitialBoard(),
    currentTurn: 'hunter',
    selectedPiece: null,
    gameOver: false,
    winner: null,
    validMoves: [],
    snipeTargets: [],
    isThinking: false,
    cursorPosition: 12,
  }),

  setPlayerRole: (role) => set({ playerRole: role }),

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
      const snipes: Position[] = [];

      const directions = [2, -2, 10, -10];
      for (const diff of directions) {
        const targetPos = pos + diff;
        if (targetPos >= 0 && targetPos < 25 && canSnipe(state.board, pos, targetPos)) {
          snipes.push(targetPos);
        }
      }

      return { selectedPiece: pos, validMoves: moves, snipeTargets: snipes };
    }

    if (state.currentTurn === 'wolf' && cell === 2 && state.playerRole === 'wolf') {
      const moves = getValidMoves(state.board, pos);
      return { selectedPiece: pos, validMoves: moves, snipeTargets: [] };
    }

    return state;
  }),

  moveHunter: (to) => set((state) => {
    if (state.selectedPiece === null || state.currentTurn !== 'hunter') return state;

    if (state.snipeTargets.includes(to)) {
      const newBoard = snipe(state.board, state.selectedPiece, to);
      const gameResult = checkGameOver(newBoard);

      vibrateOnCapture();
      if (gameResult.gameOver) {
        if (gameResult.winner === 'hunter') vibrateOnWin();
        else vibrateOnLoss();
      }

      return {
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
        board: newBoard,
        selectedPiece: null,
        validMoves: [],
        snipeTargets: [],
        currentTurn: gameResult.gameOver ? state.currentTurn : 'wolf',
        gameOver: gameResult.gameOver,
        winner: gameResult.winner,
      };
    }

    return state;
  }),

  hunterSnipe: (to) => set((state) => {
    if (state.selectedPiece === null || state.currentTurn !== 'hunter') return state;

    if (state.snipeTargets.includes(to)) {
      const newBoard = snipe(state.board, state.selectedPiece, to);
      const gameResult = checkGameOver(newBoard);

      vibrateOnCapture();
      if (gameResult.gameOver) {
        if (gameResult.winner === 'hunter') vibrateOnWin();
        else vibrateOnLoss();
      }

      return {
        board: newBoard,
        selectedPiece: null,
        validMoves: [],
        snipeTargets: [],
        currentTurn: gameResult.gameOver ? state.currentTurn : 'wolf',
        gameOver: gameResult.gameOver,
        winner: gameResult.winner,
      };
    }

    return state;
  }),

  makeAIMove: (aiMove) => set((state) => {
    if (state.currentTurn !== 'wolf' || state.gameOver) return state;

    let newBoard: Board;

    if (aiMove.isSnipe) {
      newBoard = snipe(state.board, aiMove.from, aiMove.to);
    } else {
      newBoard = movePiece(state.board, aiMove.from, aiMove.to);
    }

    const gameResult = checkGameOver(newBoard);

    vibrateOnMove();
    if (gameResult.gameOver) {
      if (gameResult.winner === 'wolf') vibrateOnWin();
      else vibrateOnLoss();
    }

    return {
      board: newBoard,
      currentTurn: gameResult.gameOver ? state.currentTurn : 'hunter',
      gameOver: gameResult.gameOver,
      winner: gameResult.winner,
    };
  }),

  triggerAIMove: async () => {
    const state = get();
    if (state.currentTurn !== 'wolf' || state.gameOver) return;

    set({ isThinking: true });

    const wolvesCount = state.board.filter(cell => cell === 2).length;
    const depth = wolvesCount > 12 ? 6 : wolvesCount > 6 ? 5 : 4;

    const aiMove = await getAIMove(state.board, depth, 800);

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

  confirmMove: () => {
    const state = get();
    if (state.cursorPosition === null) return;

    const cell = state.board[state.cursorPosition];

    if (state.gameOver) return;

    if (state.selectedPiece === null) {
      if (cell === 1 && state.currentTurn === 'hunter' && state.playerRole === 'hunter') {
        const moves = getValidMoves(state.board, state.cursorPosition);
        const snipes: number[] = [];

        const directions = [2, -2, 10, -10];
        for (const diff of directions) {
          const targetPos = state.cursorPosition + diff;
          if (targetPos >= 0 && targetPos < 25 && canSnipe(state.board, state.cursorPosition, targetPos)) {
            snipes.push(targetPos);
          }
        }

        set({ selectedPiece: state.cursorPosition, validMoves: moves, snipeTargets: snipes });
        return;
      }

      if (cell === 2 && state.currentTurn === 'wolf' && state.playerRole === 'wolf') {
        const moves = getValidMoves(state.board, state.cursorPosition);
        set({ selectedPiece: state.cursorPosition, validMoves: moves, snipeTargets: [] });
        return;
      }
    } else {
      if (state.validMoves.includes(state.cursorPosition) || state.snipeTargets.includes(state.cursorPosition)) {
        get().executeMovePiece(state.cursorPosition);
        return;
      }
    }

    set({ selectedPiece: null, validMoves: [], snipeTargets: [] });
  },
}));
