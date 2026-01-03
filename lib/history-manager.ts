import { Block } from './types';

export interface HistoryState {
  blocks: Block[];
  timestamp: number;
  action: string;
}

export interface HistoryManager {
  history: HistoryState[];
  currentIndex: number;
}

export function createHistoryManager(): HistoryManager {
  return {
    history: [],
    currentIndex: -1,
  };
}

export function pushHistory(
  manager: HistoryManager,
  blocks: Block[],
  action: string
): HistoryManager {
  const newManager = { ...manager };

  newManager.history = manager.history.slice(0, manager.currentIndex + 1);

  newManager.history.push({
    blocks: deepCloneBlocks(blocks),
    timestamp: Date.now(),
    action,
  });

  if (newManager.history.length > 50) {
    newManager.history.shift();
  } else {
    newManager.currentIndex++;
  }

  return newManager;
}

export function undo(manager: HistoryManager): { manager: HistoryManager; blocks: Block[] | null } {
  if (manager.currentIndex > 0) {
    const newIndex = manager.currentIndex - 1;
    return {
      manager: { ...manager, currentIndex: newIndex },
      blocks: manager.history[newIndex].blocks,
    };
  }
  return { manager, blocks: null };
}

export function redo(manager: HistoryManager): { manager: HistoryManager; blocks: Block[] | null } {
  if (manager.currentIndex < manager.history.length - 1) {
    const newIndex = manager.currentIndex + 1;
    return {
      manager: { ...manager, currentIndex: newIndex },
      blocks: manager.history[newIndex].blocks,
    };
  }
  return { manager, blocks: null };
}

export function canUndo(manager: HistoryManager): boolean {
  return manager.currentIndex > 0;
}

export function canRedo(manager: HistoryManager): boolean {
  return manager.currentIndex < manager.history.length - 1;
}

export function getLastAction(manager: HistoryManager): string | null {
  if (manager.currentIndex >= 0 && manager.history[manager.currentIndex]) {
    return manager.history[manager.currentIndex].action;
  }
  return null;
}

export function getRedoAction(manager: HistoryManager): string | null {
  const nextIndex = manager.currentIndex + 1;
  if (nextIndex < manager.history.length) {
    return manager.history[nextIndex].action;
  }
  return null;
}

function deepCloneBlocks(blocks: Block[]): Block[] {
  if (typeof structuredClone === 'function') {
    return structuredClone(blocks);
  }
  return JSON.parse(JSON.stringify(blocks)) as Block[];
}
