import type { Board, Position } from '../lib/types';
import { evaluateBoard } from '../lib/evaluation';
import { checkGameOver } from '../lib/gameState';
import { generateWolfMoves, generateHunterMoves, orderMoves, type Move } from '../lib/aiMoves';
import { movePiece } from '../lib/moves';

interface AIMoveRequest {
  board: Board;
  maxDepth: number;
  timeLimit: number;
}

interface AIMoveResponse {
  from: Position;
  to: Position;
  isSnipe?: boolean;
  score: number;
}

self.onmessage = (e: MessageEvent<AIMoveRequest>) => {
  const { board, maxDepth, timeLimit } = e.data;
  const startTime = Date.now();
  let bestMove: Move | null = null;
  let bestScore = -Infinity;

  const allMoves = generateWolfMoves(board);

  if (allMoves.length === 0) {
    self.postMessage(null);
    return;
  }

  const orderedMoves = orderMoves(allMoves);

  for (const move of orderedMoves) {
    if (Date.now() - startTime > timeLimit) break;

    const newBoard = applyMove(board, move);
    const score = negamax(newBoard, maxDepth - 1, -Infinity, Infinity, false, startTime, timeLimit);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (bestMove) {
    self.postMessage({ ...bestMove, score: bestScore } as AIMoveResponse);
  } else {
    self.postMessage(null);
  }
};

function applyMove(board: Board, move: Move): Board {
  return movePiece(board, move.from, move.to);
}

function negamax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  startTime: number,
  timeLimit: number
): number {
  if (Date.now() - startTime > timeLimit) {
    return evaluateBoard(board);
  }

  if (depth === 0) {
    return evaluateBoard(board);
  }

  const gameOver = checkGameOver(board);
  if (gameOver.gameOver) {
    return gameOver.winner === 'wolf' ? 100000 : -100000;
  }

  const moves = isMaximizing ? generateWolfMoves(board) : generateHunterMoves(board);

  if (moves.length === 0) {
    return isMaximizing ? -100000 : 100000;
  }

  const orderedMoves = orderMoves(moves);
  let bestValue = -Infinity;

  for (const move of orderedMoves) {
    const newBoard = applyMove(board, move);
    const value = -negamax(newBoard, depth - 1, -beta, -alpha, !isMaximizing, startTime, timeLimit);

    bestValue = Math.max(bestValue, value);
    alpha = Math.max(alpha, value);

    if (alpha >= beta) break;
  }

  return bestValue;
}
