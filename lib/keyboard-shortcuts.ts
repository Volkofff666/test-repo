import { useEffect, useCallback } from 'react';

export function registerKeyboardShortcuts(
  onUndo: () => void,
  onRedo: () => void,
  ignoreInputs: boolean = true
): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    
    if (ignoreInputs) {
      const isInput = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.tagName === 'SELECT' ||
                      target.isContentEditable;
      if (isInput) return;
    }

    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    if (isCtrlOrMeta && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      onUndo();
    }

    if (isCtrlOrMeta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      onRedo();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export function useKeyboardShortcuts(
  onUndo: () => void,
  onRedo: () => void,
  ignoreInputs: boolean = true
): void {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    
    if (ignoreInputs) {
      const isInput = target.tagName === 'INPUT' || 
                      target.tagName === 'TEXTAREA' || 
                      target.tagName === 'SELECT' ||
                      target.isContentEditable;
      if (isInput) return;
    }

    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    if (isCtrlOrMeta && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      onUndo();
    }

    if (isCtrlOrMeta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      onRedo();
    }
  }, [onUndo, onRedo, ignoreInputs]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
