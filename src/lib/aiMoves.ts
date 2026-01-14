import type { Board, Position } from './types';
import { WOLF, HUNTER } from './types';
import { getValidMoves } from './moves';
import { getPossibleSnipes } from './snipe';

export interface Move {
  from: Position;
  to: Position;
  isSnipe?: boolean;
}

export function generateWolfMoves(board: Board): Move[] {
  const moves: Move[] = [];

  for (let i = 0; i < 25; i++) {
    if (board[i] === WOLF) {
      const validMoves = getValidMoves(board, i);
      for (const to of validMoves) {
        moves.push({ from: i, to });
      }
    }
  }

  return moves;
}

export function generateHunterMoves(board: Board): Move[] {
  const moves: Move[] = [];

  for (let i = 0; i < 25; i++) {
    if (board[i] === HUNTER) {
      const validMoves = getValidMoves(board, i);
      for (const to of validMoves) {
        moves.push({ from: i, to, isSnipe: false });
      }

      const snipes = getPossibleSnipes(board, i);
      for (const to of snipes) {
        moves.push({ from: i, to, isSnipe: true });
      }
    }
  }

  return moves;
}

export function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => {
    if (a.isSnipe && !b.isSnipe) return -1;
    if (!a.isSnipe && b.isSnipe) return 1;

    const centerDistA = distanceToCenter(a.to);
    const centerDistB = distanceToCenter(b.to);

    return centerDistA - centerDistB;
  });
}

function distanceToCenter(pos: Position): number {
  const row = Math.floor(pos / 5);
  const col = pos % 5;
  return Math.abs(row - 2) + Math.abs(col - 2);
}
