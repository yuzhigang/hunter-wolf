import { type Board, EMPTY, HUNTER, WOLF } from './types';

export function createInitialBoard(): Board {
  const board: Board = Array(25).fill(EMPTY);

  for (let i = 0; i < 15; i++) {
    board[i] = WOLF;
  }

  board[21] = HUNTER;
  board[22] = HUNTER;
  board[23] = HUNTER;

  return board;
}

export function isValidPosition(pos: number): boolean {
  return pos >= 0 && pos < 25;
}

export function getRow(pos: number): number {
  return Math.floor(pos / 5);
}

export function getCol(pos: number): number {
  return pos % 5;
}

export function isSameRow(pos1: number, pos2: number): boolean {
  return getRow(pos1) === getRow(pos2);
}

export function isSameCol(pos1: number, pos2: number): boolean {
  return getCol(pos1) === getCol(pos2);
}
