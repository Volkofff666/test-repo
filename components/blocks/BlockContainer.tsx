'use client';

import { Block } from '@/lib/types';
import { BlockRenderer } from './BlockRenderer';

interface BlockContainerProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function BlockContainer({ block, isSelected, onSelect, onRemove }: BlockContainerProps) {
  const style: React.CSSProperties = {
    backgroundColor: block.properties.backgroundColor,
    padding: block.properties.padding || '1rem',
  };

  return (
    <div
      className={`relative group border-2 transition-colors ${
        isSelected ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
      }`}
      style={style}
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
      {block.properties.children && block.properties.children.length > 0 ? (
        <div className="space-y-2">
          {block.properties.children.map((child) => (
            <BlockRenderer key={child.id} block={child} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-sm italic">Empty container</div>
      )}
    </div>
  );
}
