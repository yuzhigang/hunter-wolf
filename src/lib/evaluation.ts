import type { Board } from './types';
import { WOLF, HUNTER, EMPTY } from './types';
import { isAdjacent } from './moves';
import { canSnipe } from './snipe';

// 专门针对狼的评估函数
export function evaluateWolfPerspective(board: Board): number {
  let score = 0;
  const wolves: number[] = [];
  const hunters: number[] = [];

  for (let i = 0; i < 25; i++) {
    if (board[i] === WOLF) {
      wolves.push(i);
      score += 1000; // 狼数量基础分
    } else if (board[i] === HUNTER) {
      hunters.push(i);
    }
  }

  // 1. 避免被射杀 (极其重要)
  for (const hunter of hunters) {
    for (const wolf of wolves) {
      if (canSnipe(board, hunter, wolf)) {
        score -= 800; // 发现危险立即扣分
      }
    }
  }

  // 2. 狼群聚集度 (简化版：计算到中心点的距离之和)
  let distToCenter = 0;
  for (const wolf of wolves) {
    const r = Math.floor(wolf / 5);
    const c = wolf % 5;
    distToCenter += Math.abs(r - 2) + Math.abs(c - 2);
  }
  score -= distToCenter * 5;

  // 3. 限制猎人移动
  let hunterMobility = 0;
  for (const hunter of hunters) {
    // 简单计算猎人周围的空位数
    const r = Math.floor(hunter / 5);
    const c = hunter % 5;
    const adj = [
      { r: r - 1, c }, { r: r + 1, c }, { r, c: c - 1 }, { r, c: c + 1 }
    ];
    for (const a of adj) {
      if (a.r >= 0 && a.r < 5 && a.c >= 0 && a.c < 5 && board[a.r * 5 + a.c] === EMPTY) {
        hunterMobility++;
      }
    }
  }
  score -= hunterMobility * 20;

  // 4. 围堵猎人
  for (const wolf of wolves) {
    for (const hunter of hunters) {
      if (isAdjacent(wolf, hunter)) {
        score += 30;
      }
    }
  }

  return score;
}

// 专门针对猎人的评估函数
export function evaluateHunterPerspective(board: Board): number {
  let score = 0;
  const wolves: number[] = [];
  const hunters: number[] = [];

  for (let i = 0; i < 25; i++) {
    if (board[i] === WOLF) {
      wolves.push(i);
    } else if (board[i] === HUNTER) {
      hunters.push(i);
    }
  }

  // 1. 狼越少越好
  score += (15 - wolves.length) * 1000;

  // 2. 射杀机会
  for (const hunter of hunters) {
    for (const wolf of wolves) {
      if (canSnipe(board, hunter, wolf)) {
        score += 500;
      }
    }
  }

  // 3. 保护自己不被围堵
  for (const hunter of hunters) {
    let surroundedCount = 0;
    const r = Math.floor(hunter / 5);
    const c = hunter % 5;
    const adj = [
      { r: r - 1, c }, { r: r + 1, c }, { r, c: c - 1 }, { r, c: c + 1 }
    ];
    for (const a of adj) {
      if (a.r >= 0 && a.r < 5 && a.c >= 0 && a.c < 5 && board[a.r * 5 + a.c] === WOLF) {
        surroundedCount++;
      }
    }
    if (surroundedCount >= 3) score -= 600;
    else if (surroundedCount >= 2) score -= 200;
  }

  return score;
}

export function evaluateBoard(board: Board, perspective: 'wolf' | 'hunter' = 'wolf'): number {
  return perspective === 'wolf' ? evaluateWolfPerspective(board) : evaluateHunterPerspective(board);
}
