import type { Board, Position } from './types';
import { HUNTER, WOLF, EMPTY } from './types';

export function canSnipe(board: Board, hunterPos: Position, targetPos: Position): boolean {
  if (board[hunterPos] !== HUNTER) return false;
  if (board[targetPos] !== WOLF) return false;

  const diff = targetPos - hunterPos;
  const validDiffs = [2, -2, 10, -10];

  if (!validDiffs.includes(diff)) return false;

  const midPos = (hunterPos + targetPos) / 2;
  return board[midPos] === EMPTY;
}

export function snipe(board: Board, hunterPos: Position, targetPos: Position): Board {
  const newBoard = [...board];
  const midPos = (hunterPos + targetPos) / 2;

  newBoard[targetPos] = HUNTER;
  newBoard[midPos] = EMPTY;
  newBoard[hunterPos] = EMPTY;

  return newBoard;
}

export function getPossibleSnipes(board: Board, hunterPos: Position): Position[] {
  const snipeTargets: Position[] = [];
  const directions = [2, -2, 10, -10];

  for (const diff of directions) {
    const targetPos = hunterPos + diff;
    if (targetPos >= 0 && targetPos < 25 && canSnipe(board, hunterPos, targetPos)) {
      snipeTargets.push(targetPos);
    }
  }

  return snipeTargets;
}

export function getAllHunterSnipes(board: Board): Map<Position, Position[]> {
  const snipes = new Map<Position, Position[]>();

  for (let i = 0; i < board.length; i++) {
    if (board[i] === HUNTER) {
      const possibleSnipes = getPossibleSnipes(board, i);
      if (possibleSnipes.length > 0) {
        snipes.set(i, possibleSnipes);
      }
    }
  }

  return snipes;
}
