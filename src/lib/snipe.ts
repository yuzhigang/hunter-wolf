import type { Board, Position } from './types';
import { HUNTER, WOLF, EMPTY } from './types';

export function canSnipe(board: Board, hunterPos: Position, targetPos: Position): boolean {
  if (board[hunterPos] !== HUNTER) return false;
  if (board[targetPos] !== WOLF) return false;

  const hunterRow = Math.floor(hunterPos / 5);
  const hunterCol = hunterPos % 5;
  const targetRow = Math.floor(targetPos / 5);
  const targetCol = targetPos % 5;

  // Must be on the same row or column
  const sameRow = hunterRow === targetRow;
  const sameCol = hunterCol === targetCol;

  if (!sameRow && !sameCol) return false;

  // Must be exactly 2 cells apart
  if (sameRow) {
    if (Math.abs(hunterCol - targetCol) !== 2) return false;
  } else {
    if (Math.abs(hunterRow - targetRow) !== 2) return false;
  }

  // Check that the middle cell is empty
  const midRow = (hunterRow + targetRow) / 2;
  const midCol = (hunterCol + targetCol) / 2;
  const midPos = midRow * 5 + midCol;

  return board[midPos] === EMPTY;
}

export function snipe(board: Board, hunterPos: Position, targetPos: Position): Board {
  const newBoard = [...board];

  const hunterRow = Math.floor(hunterPos / 5);
  const hunterCol = hunterPos % 5;
  const targetRow = Math.floor(targetPos / 5);
  const targetCol = targetPos % 5;

  // Calculate middle position
  const midRow = (hunterRow + targetRow) / 2;
  const midCol = (hunterCol + targetCol) / 2;
  const midPos = midRow * 5 + midCol;

  // Move hunter to target position
  newBoard[targetPos] = HUNTER;
  // Clear middle position
  newBoard[midPos] = EMPTY;
  // Clear original position
  newBoard[hunterPos] = EMPTY;

  return newBoard;
}

export function getPossibleSnipes(board: Board, hunterPos: Position): Position[] {
  const snipeTargets: Position[] = [];

  const hunterRow = Math.floor(hunterPos / 5);
  const hunterCol = hunterPos % 5;

  // Check all 4 directions: up, down, left, right (2 cells away)
  const directions = [
    { dRow: 0, dCol: 2 },   // right
    { dRow: 0, dCol: -2 },  // left
    { dRow: 2, dCol: 0 },   // down
    { dRow: -2, dCol: 0 },  // up
  ];

  for (const { dRow, dCol } of directions) {
    const targetRow = hunterRow + dRow;
    const targetCol = hunterCol + dCol;

    // Check bounds
    if (targetRow < 0 || targetRow > 4 || targetCol < 0 || targetCol > 4) continue;

    const targetPos = targetRow * 5 + targetCol;

    if (canSnipe(board, hunterPos, targetPos)) {
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
