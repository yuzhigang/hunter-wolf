import type { Board } from './types';
import { HUNTER, WOLF } from './types';
import { getValidMoves } from './moves';
import { getPossibleSnipes } from './snipe';

export function countWolves(board: Board): number {
  return board.filter(cell => cell === WOLF).length;
}

export function countHunters(board: Board): number {
  return board.filter(cell => cell === HUNTER).length;
}

export function checkHunterWin(board: Board): boolean {
  return countWolves(board) <= 3;
}

export function canHunterMove(board: Board, hunterPos: number): boolean {
  const moves = getValidMoves(board, hunterPos);
  const snipes = getPossibleSnipes(board, hunterPos);
  return moves.length > 0 || snipes.length > 0;
}

export function checkWolfWin(board: Board): boolean {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === HUNTER) {
      if (canHunterMove(board, i)) {
        return false;
      }
    }
  }
  return true;
}

export function checkGameOver(board: Board): { gameOver: boolean; winner: 'hunter' | 'wolf' | null } {
  if (checkHunterWin(board)) {
    return { gameOver: true, winner: 'hunter' };
  }

  if (checkWolfWin(board)) {
    return { gameOver: true, winner: 'wolf' };
  }

  return { gameOver: false, winner: null };
}
