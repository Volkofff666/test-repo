'use client';

import { Block } from '@/lib/types';
import { getAllAdvancedStyles } from '@/lib/styling-utils';

interface BlockHeadingProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function BlockHeading({ block, isSelected, onSelect, onRemove }: BlockHeadingProps) {
  const Tag = block.properties.tag || 'h1';
  const text = block.properties.text || 'Heading';
  
  const style: React.CSSProperties = {
    fontSize: block.properties.fontSize || '2rem',
    color: block.properties.color || '#333',
    fontWeight: 600,
    marginBottom: '0.5rem',
    ...getAllAdvancedStyles(block),
  };

  return (
    <div
      className={`relative group border-2 transition-colors ${
        isSelected ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 z-10"
        >
          Delete
        </button>
      )}
      <Tag style={style}>{text}</Tag>
    </div>
  );
}
