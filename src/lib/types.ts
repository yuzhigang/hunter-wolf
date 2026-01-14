export const EMPTY = 0;
export const HUNTER = 1;
export const WOLF = 2;

export type CellValue = typeof EMPTY | typeof HUNTER | typeof WOLF;
export type Board = CellValue[];
export type Position = number;

export interface GameState {
  board: Board;
  currentTurn: 'hunter' | 'wolf';
  gameOver: boolean;
  winner: 'hunter' | 'wolf' | null;
}
