import type { Board } from './types';
import { WOLF, HUNTER } from './types';
import { isAdjacent } from './moves';

export function evaluateBoard(board: Board): number {
  const wolves: number[] = [];
  const hunters: number[] = [];

  for (let i = 0; i < 25; i++) {
    if (board[i] === WOLF) wolves.push(i);
    if (board[i] === HUNTER) hunters.push(i);
  }

  const wolfCountScore = wolves.length * 1000;

  let wolfCompactness = 0;
  for (let i = 0; i < wolves.length; i++) {
    for (let j = i + 1; j < wolves.length; j++) {
      const dist = manhattanDistance(wolves[i], wolves[j]);
      wolfCompactness -= dist;
    }
  }
  wolfCompactness *= 10;

  let hunterMobility = 0;
  for (const hunter of hunters) {
    const validMoves = getValidMoves(board, hunter);
    const snipes = getPossibleSnipes(board, hunter);
    hunterMobility += validMoves.length + snipes.length * 2;
  }
  hunterMobility *= 5;

  const wolfAvgRow = wolves.reduce((sum, pos) => sum + Math.floor(pos / 5), 0) / wolves.length;
  const advancementScore = wolfAvgRow * 3;

  let trapPotential = 0;
  for (const wolf of wolves) {
    for (const hunter of hunters) {
      if (isAdjacent(wolf, hunter)) {
        trapPotential += 15;
      }
    }
  }

  return wolfCountScore + wolfCompactness - hunterMobility + advancementScore + trapPotential;
}

function manhattanDistance(pos1: number, pos2: number): number {
  const row1 = Math.floor(pos1 / 5);
  const col1 = pos1 % 5;
  const row2 = Math.floor(pos2 / 5);
  const col2 = pos2 % 5;
  return Math.abs(row1 - row2) + Math.abs(col1 - col2);
}

function getValidMoves(board: Board, pos: number): number[] {
  const adjacent: number[] = [];
  const row = Math.floor(pos / 5);
  const col = pos % 5;

  if (row > 0 && board[pos - 5] === 0) adjacent.push(pos - 5);
  if (row < 4 && board[pos + 5] === 0) adjacent.push(pos + 5);
  if (col > 0 && board[pos - 1] === 0) adjacent.push(pos - 1);
  if (col < 4 && board[pos + 1] === 0) adjacent.push(pos + 1);

  return adjacent;
}

function getPossibleSnipes(board: Board, hunterPos: number): number[] {
  const snipeTargets: number[] = [];
  const directions = [2, -2, 10, -10];

  for (const diff of directions) {
    const targetPos = hunterPos + diff;
    if (targetPos >= 0 && targetPos < 25) {
      const midPos = (hunterPos + targetPos) / 2;
      if (
        board[hunterPos] === HUNTER &&
        board[targetPos] === WOLF &&
        board[midPos] === 0
      ) {
        snipeTargets.push(targetPos);
      }
    }
  }

  return snipeTargets;
}
