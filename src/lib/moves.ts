import type { Board, Position } from './types';

export function isAdjacent(pos1: Position, pos2: Position): boolean {
  const row1 = Math.floor(pos1 / 5);
  const col1 = pos1 % 5;
  const row2 = Math.floor(pos2 / 5);
  const col2 = pos2 % 5;

  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function getAdjacentPositions(pos: Position): Position[] {
  const adjacent: Position[] = [];
  const row = Math.floor(pos / 5);
  const col = pos % 5;

  if (row > 0) adjacent.push(pos - 5);
  if (row < 4) adjacent.push(pos + 5);
  if (col > 0) adjacent.push(pos - 1);
  if (col < 4) adjacent.push(pos + 1);

  return adjacent;
}

export function canMove(board: Board, from: Position, to: Position): boolean {
  if (board[to] !== 0) return false;

  return isAdjacent(from, to);
}

export function getValidMoves(board: Board, from: Position): Position[] {
  const adjacent = getAdjacentPositions(from);
  return adjacent.filter(to => canMove(board, from, to));
}

export function movePiece(board: Board, from: Position, to: Position): Board {
  const newBoard = [...board];
  newBoard[to] = newBoard[from];
  newBoard[from] = 0;
  return newBoard;
}
