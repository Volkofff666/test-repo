'use client';

import React from 'react';
import { Block } from '@/lib/types';
import { shadowPresets } from '@/lib/styling-presets';

interface ShadowEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

export function ShadowEditor({ block, updateBlock }: ShadowEditorProps) {
  const boxShadow = typeof block.properties.boxShadow === 'object' ? block.properties.boxShadow : { preset: 'none' };
  
  // For custom shadow state
  const [customValues, setCustomValues] = React.useState({
    x: 0,
    y: 2,
    blur: 8,
    color: '#000000',
    opacity: 0.1
  });

  const handleChange = (updates: Partial<NonNullable<Extract<Block['properties']['boxShadow'], object>>>) => {
    updateBlock(block.id, {
      boxShadow: {
        ...(typeof block.properties.boxShadow === 'object' ? block.properties.boxShadow : {}),
        ...updates,
      },
    });
  };

  const handleCustomChange = (updates: Partial<typeof customValues>) => {
    const newValues = { ...customValues, ...updates };
    setCustomValues(newValues);
    
    // Convert hex to rgba for opacity
    const hex = newValues.color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    const customStr = `${newValues.x}px ${newValues.y}px ${newValues.blur}px rgba(${r}, ${g}, ${b}, ${newValues.opacity})`;
    handleChange({ custom: customStr, preset: 'none' });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <h4 className="font-medium text-sm">Box Shadow</h4>

      <div className="space-y-1">
        <label className="text-xs text-gray-500">Preset</label>
        <select
          value={boxShadow?.preset || 'none'}
          onChange={(e) => {
            const preset = e.target.value as NonNullable<Extract<Block['properties']['boxShadow'], object>>['preset'];
            if (preset === 'none') {
              updateBlock(block.id, { boxShadow: 'none' });
            } else {
              handleChange({ preset, custom: undefined });
            }
          }}
          className="w-full px-2 py-1 text-sm border rounded"
        >
          {Object.keys(shadowPresets).map((name) => (
            <option key={name} value={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </div>

      {(boxShadow?.preset === 'custom' || !boxShadow?.preset) && (
        <div className="space-y-3 pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase">Offset X: {customValues.x}px</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={customValues.x}
                onChange={(e) => handleCustomChange({ x: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase">Offset Y: {customValues.y}px</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={customValues.y}
                onChange={(e) => handleCustomChange({ y: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Blur: {customValues.blur}px</label>
            <input
              type="range"
              min="0"
              max="50"
              value={customValues.blur}
              onChange={(e) => handleCustomChange({ blur: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Shadow Color & Opacity</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={customValues.color}
                onChange={(e) => handleCustomChange({ color: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={customValues.opacity}
                onChange={(e) => handleCustomChange({ opacity: parseFloat(e.target.value) })}
                className="flex-1"
              />
              <span className="text-[10px] w-8 text-right">{Math.round(customValues.opacity * 100)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
