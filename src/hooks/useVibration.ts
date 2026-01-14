export function vibrate(pattern: number | number[]): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

export function vibrateOnCapture(): void {
  vibrate([50, 30, 50]);
}

export function vibrateOnMove(): void {
  vibrate(30);
}

export function vibrateOnWin(): void {
  vibrate([100, 50, 100, 50, 100]);
}

export function vibrateOnLoss(): void {
  vibrate([50, 50, 100]);
}
