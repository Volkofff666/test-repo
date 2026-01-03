'use client';

import type { ReactNode } from 'react';
import { Block } from '@/lib/types';
import { useBlocks } from '@/lib/block-context';
import { setDraggedBlockId } from '@/lib/drag-handler';
import { BlockContainer } from './BlockContainer';
import { BlockHeading } from './BlockHeading';
import { BlockText } from './BlockText';
import { BlockButton } from './BlockButton';
import { BlockHeader } from './BlockHeader';

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { selectedBlockId, selectBlock, removeBlock } = useBlocks();
  const isSelected = selectedBlockId === block.id;

  const handleSelect = () => {
    selectBlock(block.id);
  };

  const handleRemove = () => {
    removeBlock(block.id);
  };

  let content: ReactNode = null;

  switch (block.type) {
    case 'container':
      content = (
        <BlockContainer
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
      break;
    case 'heading':
      content = (
        <BlockHeading
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
      break;
    case 'text':
      content = (
        <BlockText
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
      break;
    case 'button':
      content = (
        <BlockButton
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
      break;
    case 'header':
      content = (
        <BlockHeader
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
      break;
    default:
      content = null;
  }

  if (!content) return null;

  return (
    <div
      draggable
      className="cursor-move transition-opacity"
      onDragStart={e => {
        e.stopPropagation();
        setDraggedBlockId(e, block.id);
        e.currentTarget.classList.add('opacity-60');
      }}
      onDragEnd={e => {
        e.currentTarget.classList.remove('opacity-60');
      }}
    >
      {content}
    </div>
  );
}
