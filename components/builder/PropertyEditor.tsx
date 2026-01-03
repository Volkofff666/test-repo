'use client';

import { useBlocks } from '@/lib/block-context';
import { HeaderPropertyEditor } from './HeaderPropertyEditor';
import { AdvancedPropertyEditor } from './AdvancedPropertyEditor';

export function PropertyEditor() {
  const { getSelectedBlock, updateBlock } = useBlocks();
  const selectedBlock = getSelectedBlock();

  if (!selectedBlock) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Properties</h3>
        <p className="text-gray-400 text-sm">
          Select a block to edit its properties
        </p>
      </div>
    );
  }

  // Render specialized editor for header blocks
  if (selectedBlock.type === 'header') {
    return (
      <div className="pb-20">
        <HeaderPropertyEditor />
        <div className="px-4">
          <AdvancedPropertyEditor block={selectedBlock} updateBlock={updateBlock} />
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: string) => {
    updateBlock(selectedBlock.id, { [property]: value });
  };

  return (
    <div className="p-4 pb-20">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Properties</h3>
      
      <div className="space-y-4">
        {/* BEM Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            BEM Class Name
          </label>
          <input
            type="text"
            value={selectedBlock.bemName}
            disabled
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Base BEM class name</p>
        </div>

        {/* Text Content (for heading, text, button) */}
        {(selectedBlock.type === 'heading' || 
          selectedBlock.type === 'text' || 
          selectedBlock.type === 'button') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <textarea
              value={selectedBlock.properties.text || ''}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Heading Tag (for heading only) */}
        {selectedBlock.type === 'heading' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading Tag
            </label>
            <select
              value={selectedBlock.properties.tag || 'h1'}
              onChange={(e) => handlePropertyChange('tag', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
            </select>
          </div>
        )}

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedBlock.properties.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedBlock.properties.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Text Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Text Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedBlock.properties.color || '#000000'}
              onChange={(e) => handlePropertyChange('color', e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedBlock.properties.color || '#000000'}
              onChange={(e) => handlePropertyChange('color', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Padding */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Padding
          </label>
          <input
            type="text"
            value={selectedBlock.properties.padding || ''}
            onChange={(e) => handlePropertyChange('padding', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 1rem or 16px"
          />
        </div>

        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Size
          </label>
          <input
            type="text"
            value={selectedBlock.properties.fontSize || ''}
            onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 1rem or 16px"
          />
        </div>

        <AdvancedPropertyEditor block={selectedBlock} updateBlock={updateBlock} />
      </div>
    </div>
  );
}
