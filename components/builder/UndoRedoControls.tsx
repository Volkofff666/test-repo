'use client';

import { useBlocks } from '@/lib/block-context';

export function UndoRedoControls() {
  const { undo, redo, canUndo, canRedo } = useBlocks();

  const handleUndo = () => {
    if (canUndo) {
      undo();
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <button
          type="button"
          onClick={handleUndo}
          disabled={!canUndo}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title={canUndo ? 'Undo last action (Ctrl+Z)' : 'No actions to undo'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={handleRedo}
        disabled={!canRedo}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title={canRedo ? 'Redo action (Ctrl+Y)' : 'No actions to redo'}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
        </svg>
      </button>

      <span className="text-xs text-gray-400 ml-1 mr-2">|</span>
      
      <span className="text-xs text-gray-500 hidden sm:inline">
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono text-xs">
          Ctrl
        </kbd>
        <span className="mx-1">+</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono text-xs">
          Z
        </kbd>
        <span className="mx-1">/</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono text-xs">
          Y
        </kbd>
      </span>
    </div>
  );
}
