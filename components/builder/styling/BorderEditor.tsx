'use client';

import React from 'react';
import { Block } from '@/lib/types';
import { borderPresets } from '@/lib/styling-presets';

interface BorderEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

export function BorderEditor({ block, updateBlock }: BorderEditorProps) {
  const border = typeof block.properties.border === 'object' ? block.properties.border : {};
  const [showIndividual, setShowIndividual] = React.useState(false);

  const handleChange = (updates: Partial<NonNullable<Extract<Block['properties']['border'], object>>>) => {
    updateBlock(block.id, {
      border: {
        ...(typeof block.properties.border === 'object' ? block.properties.border : {}),
        ...updates,
      },
    });
  };

  const applyPreset = (name: keyof typeof borderPresets) => {
    updateBlock(block.id, { border: borderPresets[name] });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Borders</h4>
        <div className="flex gap-1">
          {Object.keys(borderPresets).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name as keyof typeof borderPresets)}
              className="px-2 py-0.5 text-[10px] bg-white border rounded hover:bg-gray-100 capitalize"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Width</label>
          <input
            type="text"
            value={border?.width || ''}
            onChange={(e) => handleChange({ width: e.target.value })}
            placeholder="1px"
            className="w-full px-2 py-1 text-sm border rounded"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500">Style</label>
          <select
            value={border?.style || 'none'}
            onChange={(e) => handleChange({ style: e.target.value as NonNullable<Extract<Block['properties']['border'], object>>['style'] })}
            className="w-full px-2 py-1 text-sm border rounded"
          >
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={border?.color || '#000000'}
            onChange={(e) => handleChange({ color: e.target.value })}
            className="w-8 h-8 p-0 border rounded"
          />
          <input
            type="text"
            value={border?.color || ''}
            onChange={(e) => handleChange({ color: e.target.value })}
            placeholder="#000000"
            className="flex-1 px-2 py-1 text-sm border rounded"
          />
        </div>
      </div>

      <button
        onClick={() => setShowIndividual(!showIndividual)}
        className="text-xs text-blue-600 hover:underline"
      >
        {showIndividual ? 'Hide' : 'Show'} Individual Sides
      </button>

      {showIndividual && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Top</label>
            <input
              type="text"
              value={border?.top || ''}
              onChange={(e) => handleChange({ top: e.target.value })}
              placeholder="e.g. 1px solid red"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Right</label>
            <input
              type="text"
              value={border?.right || ''}
              onChange={(e) => handleChange({ right: e.target.value })}
              placeholder="e.g. 1px solid red"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Bottom</label>
            <input
              type="text"
              value={border?.bottom || ''}
              onChange={(e) => handleChange({ bottom: e.target.value })}
              placeholder="e.g. 1px solid red"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Left</label>
            <input
              type="text"
              value={border?.left || ''}
              onChange={(e) => handleChange({ left: e.target.value })}
              placeholder="e.g. 1px solid red"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
