'use client';

import { Block } from '@/lib/types';
import { getAllAdvancedStyles } from '@/lib/styling-utils';

interface BlockTextProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function BlockText({ block, isSelected, onSelect, onRemove }: BlockTextProps) {
  const text = block.properties.text || 'Text content';
  
  const style: React.CSSProperties = {
    fontSize: block.properties.fontSize || '1rem',
    color: block.properties.color || '#666',
    lineHeight: 1.5,
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
      <p style={style}>{text}</p>
    </div>
  );
}
