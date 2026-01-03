import type { DragEvent } from 'react';

const BLOCK_ID_MIME = 'application/x-cto-block-id';

export function setDraggedBlockId(e: DragEvent, blockId: string) {
  e.dataTransfer.setData(BLOCK_ID_MIME, blockId);
  e.dataTransfer.setData('text/plain', blockId);
  e.dataTransfer.effectAllowed = 'move';
}

export function getDraggedBlockId(e: DragEvent): string | null {
  const fromCustom = e.dataTransfer.getData(BLOCK_ID_MIME);
  if (fromCustom) return fromCustom;

  const fromPlain = e.dataTransfer.getData('text/plain');
  return fromPlain || null;
}
