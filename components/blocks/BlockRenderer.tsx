'use client';

import { Block } from '@/lib/types';
import { useBlocks } from '@/lib/block-context';
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

  switch (block.type) {
    case 'container':
      return (
        <BlockContainer
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
    case 'heading':
      return (
        <BlockHeading
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
    case 'text':
      return (
        <BlockText
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
    case 'button':
      return (
        <BlockButton
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
    case 'header':
      return (
        <BlockHeader
          block={block}
          isSelected={isSelected}
          onSelect={handleSelect}
          onRemove={handleRemove}
        />
      );
    default:
      return null;
  }
}
