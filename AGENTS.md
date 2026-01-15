# AGENTS.md

## Build & Development Commands

```bash
# Development
npm run dev              # Start Vite dev server

# Build & Test
npm run build           # TypeScript check + Vite build
npm run lint            # Run ESLint on all files
npm run preview         # Preview production build locally
```

**Note**: No test framework currently configured. To add tests, use Vitest (`npm install -D vitest @vitest/ui`) and run `vitest` for all tests or `vitest <filename>` for single test.

## Code Style Guidelines

### Import Statements

```typescript
// Order: External libraries → Type imports → Internal modules
import { create } from 'zustand';
import { motion } from 'framer-motion';

import type { Board, Position } from './lib/types';
import { useGameStore } from './store/gameStore';
import Board from './components/Board';
```

### Type Definitions

- Use `const` for primitive constants: `export const EMPTY = 0;`
- Use `type` for aliases: `export type Board = CellValue[];`
- Use `interface` for object shapes with properties
- Prefer type inference for simple cases

```typescript
// types.ts - Central type definitions
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
```

### Naming Conventions

| Context | Convention | Examples |
|---------|------------|----------|
| Constants | `UPPER_SNAKE_CASE` | `EMPTY`, `HUNTER`, `WOLF` |
| Functions | `camelCase` | `isAdjacent()`, `getValidMoves()`, `movePiece()` |
| React Components | `PascalCase` | `Board`, `Piece`, `GameInfo` |
| Variables | `camelCase` | `newBoard`, `validMoves`, `snipes` |
| State Stores | `useXxxStore` | `useGameStore`, `useAIStore` |
| Files | `PascalCase` (components), `camelCase` (lib) | `Board.tsx`, `moves.ts` |

### Component Structure

```typescript
// Functional component with hooks
import { useEffect } from 'react';

function ComponentName() {
  // Hooks first
  const { state, setState } = useGameStore();

  // Event handlers
  const handleClick = () => { /* ... */ };

  // Side effects
  useEffect(() => {
    // cleanup
    return () => { /* ... */ };
  }, []);

  // Render
  return <div>...</div>;
}

export default ComponentName;
```

### State Management (Zustand)

```typescript
import { create } from 'zustand';

interface GameStore {
  state: State;
  action: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  state: initialState,

  action: () => set((state) => {
    // Return updated state
    return { ...state, /* updates */ };
  }),
}));

// Usage in handlers
const handleMove = () => {
  const currentState = useGameStore.getState(); // Read without subscription
  currentState.action(); // Direct method call
};
```

### Error Handling

- Use early returns for invalid states in Zustand actions
- Guard clauses in event handlers
- Explicit checks before state mutations

```typescript
const movePiece = (to: Position) => set((state) => {
  if (state.selectedPiece === null) return state; // Early return
  if (state.gameOver) return state;                // Guard clause

  // Execute logic
  return { /* new state */ };
});
```

### Project Structure

```
src/
├── components/      # React components (Board.tsx, Piece.tsx)
├── lib/             # Game logic (types.ts, moves.ts, evaluation.ts)
├── store/           # Zustand stores (gameStore.ts, aiStore.ts)
├── workers/         # Web Workers (aiWorker.ts)
├── hooks/           # Custom hooks (useVibration.ts)
├── App.tsx          # Root component
└── main.tsx         # Entry point
```

### Board Representation

- Board is a 1D array of length 25 (5×5 grid)
- Position = index in array (0-24)
- Convert: `row = Math.floor(pos / 5)`, `col = pos % 5`
- Adjacent: ±1 (same row), ±5 (same column)

### Animation (Framer Motion)

```typescript
import { motion } from 'framer-motion';

<motion.div
  variants={variants}
  initial="initial"
  animate="animate"
  whileHover="hover"
  whileTap="tap"
/>
```

### Keyboard Handling

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        // action
        break;
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

## Architecture Notes

### AI Implementation
- **Algorithm**: Negamax + Alpha-Beta pruning
- **Depth**: Adaptive (4-6) based on remaining wolves
- **Execution**: Web Worker to prevent UI blocking
- **Evaluation**: Wolf count ×1000, compactness, mobility, advancement

### PWA Configuration
- Service Worker: `vite-plugin-pwa`
- Manifest: `vite.config.ts`
- Icons: `pwa-192x192.svg`, `pwa-512x512.svg`
- Caching: NetworkFirst for external assets

## Development Workflow

1. Type-check before commit: `npm run build`
2. Lint fixes: `npm run lint`
3. Dev server: `npm run dev`
4. Test responsive: Use browser devtools (mobile view)
5. Test PWA: Chrome DevTools → Application → Service Workers
