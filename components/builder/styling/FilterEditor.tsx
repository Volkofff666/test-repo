'use client';

import React from 'react';
import { Block } from '@/lib/types';
import { filterPresets } from '@/lib/styling-presets';

interface FilterEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

export function FilterEditor({ block, updateBlock }: FilterEditorProps) {
  const filters = block.properties.filters || {
    blur: 0,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    invert: 0,
    sepia: 0,
    grayscale: 0,
  };

  const handleChange = (updates: Partial<NonNullable<Block['properties']['filters']>>) => {
    updateBlock(block.id, {
      filters: {
        ...filters,
        ...updates,
      },
    });
  };

  const applyPreset = (name: keyof typeof filterPresets) => {
    updateBlock(block.id, { filters: { ...filters, ...filterPresets[name] } });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Filters</h4>
        <div className="flex gap-1 overflow-x-auto">
          {Object.keys(filterPresets).map((name) => (
            <button
              key={name}
              onClick={() => applyPreset(name as keyof typeof filterPresets)}
              className="px-2 py-0.5 text-[10px] bg-white border rounded hover:bg-gray-100 capitalize whitespace-nowrap"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Blur <span>{filters.blur}px</span>
          </label>
          <input
            type="range"
            min="0"
            max="20"
            value={filters.blur ?? 0}
            onChange={(e) => handleChange({ blur: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Brightness <span>{filters.brightness}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.brightness ?? 100}
            onChange={(e) => handleChange({ brightness: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Contrast <span>{filters.contrast}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.contrast ?? 100}
            onChange={(e) => handleChange({ contrast: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Saturate <span>{filters.saturate}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.saturate ?? 100}
            onChange={(e) => handleChange({ saturate: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Grayscale <span>{filters.grayscale}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.grayscale ?? 0}
            onChange={(e) => handleChange({ grayscale: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Sepia <span>{filters.sepia}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.sepia ?? 0}
            onChange={(e) => handleChange({ sepia: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Invert <span>{filters.invert}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.invert ?? 0}
            onChange={(e) => handleChange({ invert: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Hue Rotate <span>{filters.hueRotate}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={filters.hueRotate ?? 0}
            onChange={(e) => handleChange({ hueRotate: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
