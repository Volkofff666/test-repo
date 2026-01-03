'use client';

import React from 'react';
import { Block } from '@/lib/types';
import { gradientPresets } from '@/lib/styling-presets';

interface GradientEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

export function GradientEditor({ block, updateBlock }: GradientEditorProps) {
  const gradient = block.properties.gradient || { enabled: false, type: 'linear', angle: 180, color1: '#ffffff', color2: '#000000' };

  const handleChange = (updates: Partial<NonNullable<Block['properties']['gradient']>>) => {
    updateBlock(block.id, {
      gradient: {
        ...gradient,
        ...updates,
      },
    });
  };

  const applyPreset = (preset: typeof gradientPresets[0]) => {
    handleChange({
      enabled: true,
      color1: preset.colors[0],
      color2: preset.colors[1],
      color3: preset.colors[2],
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Gradient</h4>
        <input
          type="checkbox"
          checked={gradient.enabled}
          onChange={(e) => handleChange({ enabled: e.target.checked })}
          className="h-4 w-4"
        />
      </div>

      {gradient.enabled && (
        <div className="space-y-4 pt-2 border-t">
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {gradientPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="flex-shrink-0 w-8 h-8 rounded border hover:scale-110 transition-transform"
                style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                title={preset.name}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Type</label>
              <select
                value={gradient.type || 'linear'}
                onChange={(e) => handleChange({ type: e.target.value as NonNullable<Block['properties']['gradient']>['type'] })}
                className="w-full px-2 py-1 text-sm border rounded"
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </div>
            {gradient.type === 'linear' && (
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Angle: {gradient.angle}°</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={gradient.angle || 180}
                  onChange={(e) => handleChange({ angle: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gradient.color1 || '#ffffff'}
                onChange={(e) => handleChange({ color1: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="text"
                value={gradient.color1 || ''}
                onChange={(e) => handleChange({ color1: e.target.value })}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={gradient.color2 || '#000000'}
                onChange={(e) => handleChange({ color2: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="text"
                value={gradient.color2 || ''}
                onChange={(e) => handleChange({ color2: e.target.value })}
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
