'use client';

import { useState } from 'react';
import { useBlocks } from '@/lib/block-context';
import { getDraggedBlockId } from '@/lib/drag-handler';

interface DropZoneProps {
  parentId: string | null;
  index: number;
  indent?: number;
  disabled?: boolean;
}

export function DropZone({ parentId, index, indent = 0, disabled }: DropZoneProps) {
  const { moveBlock } = useBlocks();
  const [isOver, setIsOver] = useState(false);

  if (disabled) {
    return <div style={{ marginLeft: indent }} className="h-2" />;
  }

  return (
    <div
      style={{ marginLeft: indent }}
      className={`h-2 rounded transition-colors ${
        isOver ? 'bg-blue-200' : 'bg-transparent'
      }`}
      onDragOver={e => {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDragEnter={e => {
        e.stopPropagation();
        setIsOver(true);
      }}
      onDragLeave={e => {
        e.stopPropagation();
        setIsOver(false);
      }}
      onDrop={e => {
        e.stopPropagation();
        e.preventDefault();
        setIsOver(false);
        const draggedId = getDraggedBlockId(e);
        if (!draggedId) return;
        moveBlock(draggedId, parentId, index);
      }}
    />
  );
}
