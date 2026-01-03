'use client';

import { useBlocks } from '@/lib/block-context';
import { Block, BlockType } from '@/lib/types';

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createBlock(type: BlockType): Block {
  const id = generateBlockId();
  
  const baseBlock: Block = {
    id,
    type,
    bemName: type,
    properties: {},
  };

  switch (type) {
    case 'container':
      return {
        ...baseBlock,
        bemName: 'container',
        properties: {
          backgroundColor: '#f5f5f5',
          padding: '2rem',
          children: [],
        },
      };
    
    case 'heading':
      return {
        ...baseBlock,
        bemName: 'heading',
        properties: {
          text: 'New Heading',
          tag: 'h1',
          fontSize: '2rem',
          color: '#333',
        },
      };
    
    case 'text':
      return {
        ...baseBlock,
        bemName: 'text',
        properties: {
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          fontSize: '1rem',
          color: '#666',
        },
      };
    
    case 'button':
      return {
        ...baseBlock,
        bemName: 'button',
        properties: {
          text: 'Click Me',
          backgroundColor: '#0066cc',
          color: 'white',
          padding: '0.5rem 1rem',
        },
      };
    
    case 'header':
      return {
        ...baseBlock,
        bemName: 'header',
        properties: {
          logoText: 'Your Logo',
          logoColor: '#333333',
          logoFontSize: '24px',
          backgroundColor: '#ffffff',
          padding: '1rem 2rem',
          borderRadius: '0px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: 'none',
          marginBottom: '1rem',
          menuItems: [
            { id: generateBlockId(), label: 'Home', href: '#home' },
            { id: generateBlockId(), label: 'About', href: '#about' },
            { id: generateBlockId(), label: 'Contact', href: '#contact' },
          ],
          menuItemColor: '#666666',
          menuItemHoverColor: '#0066cc',
          menuItemFontSize: '14px',
          menuItemPadding: '0.5rem 1rem',
          menuItemGap: '1.5rem',
          justifyContent: 'space-between',
          alignment: 'center',
        },
      };
    
    default:
      return baseBlock;
  }
}

export function Palette() {
  const { addBlock } = useBlocks();

  const handleAddBlock = (type: BlockType) => {
    const block = createBlock(type);
    addBlock(block);
  };

  const blockTypes: { type: BlockType; label: string; icon: string }[] = [
    { type: 'header', label: 'Header', icon: '🎯' },
    { type: 'container', label: 'Container', icon: '📦' },
    { type: 'heading', label: 'Heading', icon: '📝' },
    { type: 'text', label: 'Text', icon: '📄' },
    { type: 'button', label: 'Button', icon: '🔘' },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Block Palette</h2>
      <div className="space-y-2">
        {blockTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => handleAddBlock(type)}
            className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-3 group"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
            <span className="font-medium text-gray-700 group-hover:text-blue-600">
              Add {label}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Click on any block in the canvas to edit its properties.
        </p>
      </div>
    </div>
  );
}
