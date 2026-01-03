'use client';

import { Fragment, useState } from 'react';
import { Block } from '@/lib/types';
import { useBlocks } from '@/lib/block-context';
import { getDraggedBlockId } from '@/lib/drag-handler';
import { DropZone } from '@/components/builder/DropZone';
import { BlockRenderer } from './BlockRenderer';
import { getAllAdvancedStyles } from '@/lib/styling-utils';

interface BlockContainerProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function BlockContainer({ block, isSelected, onSelect, onRemove }: BlockContainerProps) {
  const { moveBlock } = useBlocks();
  const [isDropOver, setIsDropOver] = useState(false);

  const style: React.CSSProperties = {
    backgroundColor: block.properties.backgroundColor,
    padding: block.properties.padding || '1rem',
    ...getAllAdvancedStyles(block),
  };

  const children = block.properties.children ?? [];

  return (
    <div
      className={`relative group border-2 transition-colors ${
        isSelected ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
      } ${isDropOver ? 'ring-2 ring-blue-300' : ''}`}
      style={style}
      onClick={e => {
        e.stopPropagation();
        onSelect();
      }}
      onDragOver={e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDropOver(true);
      }}
      onDragLeave={() => setIsDropOver(false)}
      onDrop={e => {
        e.preventDefault();
        setIsDropOver(false);
        const draggedId = getDraggedBlockId(e);
        if (!draggedId) return;
        moveBlock(draggedId, block.id, children.length);
      }}
    >
      {isSelected && (
        <button
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 z-10"
        >
          Delete
        </button>
      )}

      {children.length > 0 ? (
        <div className="space-y-2">
          <DropZone parentId={block.id} index={0} />
          {children.map((child, idx) => (
            <Fragment key={child.id}>
              <BlockRenderer block={child} />
              <DropZone parentId={block.id} index={idx + 1} />
            </Fragment>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-sm italic">Empty container (drop blocks here)</div>
      )}
    </div>
  );
}
