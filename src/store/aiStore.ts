import type { Board, Position } from '../lib/types';

let aiWorker: Worker | null = null;

export function initializeAIWorker() {
  if (aiWorker) aiWorker.terminate();
  aiWorker = new Worker(new URL('../workers/aiWorker.ts', import.meta.url), {
    type: 'module',
  });
}

export async function getAIMove(
  board: Board,
  depth: number = 5,
  timeout: number = 800,
  aiRole: 'hunter' | 'wolf' = 'wolf'
): Promise<{ from: Position; to: Position; isSnipe?: boolean } | null> {
  if (!aiWorker) initializeAIWorker();

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(null);
    }, timeout + 100);

    if (!aiWorker) {
      clearTimeout(timeoutId);
      resolve(null);
      return;
    }

    aiWorker.onmessage = (e) => {
      clearTimeout(timeoutId);
      resolve(e.data);
    };

    aiWorker.onerror = () => {
      clearTimeout(timeoutId);
      resolve(null);
    };

    aiWorker.postMessage({
      board,
      maxDepth: depth,
      timeLimit: timeout,
      aiRole,
    });
  });
}

export function terminateAIWorker() {
  if (aiWorker) {
    aiWorker.terminate();
    aiWorker = null;
  }
}
