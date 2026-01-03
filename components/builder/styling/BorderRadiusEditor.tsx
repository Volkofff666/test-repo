'use client';

import React from 'react';
import { Block } from '@/lib/types';
import { borderRadiusPresets } from '@/lib/styling-presets';

interface BorderRadiusEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

export function BorderRadiusEditor({ block, updateBlock }: BorderRadiusEditorProps) {
  const borderRadius = typeof block.properties.borderRadius === 'object' ? block.properties.borderRadius : {};
  const [showIndividual, setShowIndividual] = React.useState(false);

  const handleChange = (updates: Partial<NonNullable<Extract<Block['properties']['borderRadius'], object>>>) => {
    updateBlock(block.id, {
      borderRadius: {
        ...(typeof block.properties.borderRadius === 'object' ? block.properties.borderRadius : {}),
        ...updates,
      },
    });
  };

  const applyPreset = (name: keyof typeof borderRadiusPresets) => {
    updateBlock(block.id, { borderRadius: { all: borderRadiusPresets[name] } });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Border Radius</h4>
        <div className="flex gap-1 flex-wrap justify-end">
          {Object.keys(borderRadiusPresets).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name as keyof typeof borderRadiusPresets)}
              className="px-2 py-0.5 text-[10px] bg-white border rounded hover:bg-gray-100 capitalize"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-500">All Corners</label>
        <input
          type="text"
          value={borderRadius?.all || ''}
          onChange={(e) => handleChange({ all: e.target.value })}
          placeholder="8px"
          className="w-full px-2 py-1 text-sm border rounded"
        />
      </div>

      <button
        onClick={() => setShowIndividual(!showIndividual)}
        className="text-xs text-blue-600 hover:underline"
      >
        {showIndividual ? 'Hide' : 'Show'} Individual Corners
      </button>

      {showIndividual && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Top-Left</label>
            <input
              type="text"
              value={borderRadius?.topLeft || ''}
              onChange={(e) => handleChange({ topLeft: e.target.value })}
              placeholder="8px"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Top-Right</label>
            <input
              type="text"
              value={borderRadius?.topRight || ''}
              onChange={(e) => handleChange({ topRight: e.target.value })}
              placeholder="8px"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Bottom-Right</label>
            <input
              type="text"
              value={borderRadius?.bottomRight || ''}
              onChange={(e) => handleChange({ bottomRight: e.target.value })}
              placeholder="8px"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Bottom-Left</label>
            <input
              type="text"
              value={borderRadius?.bottomLeft || ''}
              onChange={(e) => handleChange({ bottomLeft: e.target.value })}
              placeholder="8px"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
}
