'use client';

import { Block } from '@/lib/types';

interface BlockButtonProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function BlockButton({ block, isSelected, onSelect, onRemove }: BlockButtonProps) {
  const text = block.properties.text || 'Button';
  
  const style: React.CSSProperties = {
    padding: block.properties.padding || '0.5rem 1rem',
    backgroundColor: block.properties.backgroundColor || '#0066cc',
    color: block.properties.color || 'white',
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: block.properties.fontSize || '1rem',
  };

  return (
    <div
      className={`relative group border-2 transition-colors inline-block ${
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
          className="absolute -top-8 right-0 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 z-10"
        >
          Delete
        </button>
      )}
      <button style={style}>{text}</button>
    </div>
  );
}
