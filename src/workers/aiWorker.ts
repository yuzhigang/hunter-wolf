import type { Board } from '../lib/types';
import { evaluateWolfPerspective, evaluateHunterPerspective } from '../lib/evaluation';
import { checkGameOver } from '../lib/gameState';
import { generateWolfMoves, generateHunterMoves, type Move } from '../lib/aiMoves';
import { canSnipe } from '../lib/snipe';

interface AIMoveRequest {
  board: Board;
  maxDepth: number;
  timeLimit: number;
  aiRole: 'hunter' | 'wolf';
}

self.onmessage = (e: MessageEvent<AIMoveRequest>) => {
  const { board, maxDepth, timeLimit, aiRole } = e.data;
  const startTime = Date.now();

  const allMoves = aiRole === 'wolf' ? generateWolfMoves(board) : generateHunterMoves(board);
  if (allMoves.length === 0) {
    self.postMessage(null);
    return;
  }

  // 1. 过滤危险移动 (狼不能自杀)
  let filteredMoves = allMoves;
  if (aiRole === 'wolf') {
    filteredMoves = allMoves.filter(m => !isDangerousForWolf(board, m));
  }

  // 2. 如果全都是危险移动，至少保命
  if (filteredMoves.length === 0) filteredMoves = allMoves;

  let bestMove = filteredMoves[0];
  let bestScore = -Infinity;
  let currentAlpha = -Infinity;
  const currentBeta = Infinity;

  // 3. 顶层循环 (Minimax 第 0 层)
  for (const move of filteredMoves) {
    if (Date.now() - startTime > timeLimit) break;

    const nextBoard = applyMove(board, move);
    const score = minimax(
      nextBoard,
      maxDepth - 1,
      currentAlpha,
      currentBeta,
      false, // 接下来是对手回合
      aiRole,
      startTime,
      timeLimit
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    currentAlpha = Math.max(currentAlpha, bestScore);
  }

  self.postMessage({ ...bestMove, score: bestScore });
};

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiRole: 'hunter' | 'wolf',
  startTime: number,
  timeLimit: number
): number {
  // 超时检查
  if (Date.now() - startTime > timeLimit) {
    return evaluate(board, aiRole);
  }

  // 终局检查
  const gameStatus = checkGameOver(board);
  if (gameStatus.gameOver) {
    if (gameStatus.winner === aiRole) return 100000 + depth;
    return -100000 - depth;
  }

  // 递归终止
  if (depth <= 0) {
    return evaluate(board, aiRole);
  }

  const opponentRole = aiRole === 'wolf' ? 'hunter' : 'wolf';

  if (isMaximizing) {
    // AI 的回合
    let maxEval = -Infinity;
    const moves = aiRole === 'wolf' ? generateWolfMoves(board) : generateHunterMoves(board);

    if (moves.length === 0) return -100000;

    for (const move of moves) {
      const score = minimax(applyMove(board, move), depth - 1, alpha, beta, false, aiRole, startTime, timeLimit);
      maxEval = Math.max(maxEval, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    // 对手回合
    let minEval = Infinity;
    const moves = opponentRole === 'wolf' ? generateWolfMoves(board) : generateHunterMoves(board);

    if (moves.length === 0) return 100000;

    for (const move of moves) {
      const score = minimax(applyMove(board, move), depth - 1, alpha, beta, true, aiRole, startTime, timeLimit);
      minEval = Math.min(minEval, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function evaluate(board: Board, aiRole: 'hunter' | 'wolf'): number {
  return aiRole === 'wolf' ? evaluateWolfPerspective(board) : evaluateHunterPerspective(board);
}

function applyMove(board: Board, move: Move): Board {
  if (move.isSnipe) {
    const newBoard = [...board];
    const midPos = (move.from + move.to) / 2; // 简化计算，适用于直线射杀
    newBoard[move.to] = board[move.from];
    newBoard[midPos] = 0;
    newBoard[move.from] = 0;
    return newBoard;
  }
  const newBoard = [...board];
  newBoard[move.to] = board[move.from];
  newBoard[move.from] = 0;
  return newBoard;
}

function isDangerousForWolf(board: Board, move: Move): boolean {
  const nextBoard = applyMove(board, move);
  const hunters: number[] = [];
  for (let i = 0; i < 25; i++) if (nextBoard[i] === 1) hunters.push(i);

  // 检查移动后狼是否能被任何猎人射杀
  for (const hPos of hunters) {
    if (canSnipe(nextBoard, hPos, move.to)) return true;
  }
  return false;
}
