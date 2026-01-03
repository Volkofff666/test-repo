'use client';

import React from 'react';
import { Block } from '@/lib/types';

interface TransformEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

export function TransformEditor({ block, updateBlock }: TransformEditorProps) {
  const transform = block.properties.transform || {
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    translateX: '0px',
    translateY: '0px',
  };

  const handleChange = (updates: Partial<NonNullable<Block['properties']['transform']>>) => {
    updateBlock(block.id, {
      transform: {
        ...transform,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <h4 className="font-medium text-sm">Transform</h4>

      <div className="space-y-3 pt-2 border-t">
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase flex justify-between">
            Rotate <span>{transform.rotate}°</span>
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={transform.rotate ?? 0}
            onChange={(e) => handleChange({ rotate: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase flex justify-between">
              Scale X <span>{transform.scaleX}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={transform.scaleX ?? 1}
              onChange={(e) => handleChange({ scaleX: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase flex justify-between">
              Scale Y <span>{transform.scaleY}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={transform.scaleY ?? 1}
              onChange={(e) => handleChange({ scaleY: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase flex justify-between">
              Skew X <span>{transform.skewX}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="90"
              value={transform.skewX ?? 0}
              onChange={(e) => handleChange({ skewX: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase flex justify-between">
              Skew Y <span>{transform.skewY}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="90"
              value={transform.skewY ?? 0}
              onChange={(e) => handleChange({ skewY: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Translate X</label>
            <input
              type="text"
              value={transform.translateX || ''}
              onChange={(e) => handleChange({ translateX: e.target.value })}
              placeholder="0px"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Translate Y</label>
            <input
              type="text"
              value={transform.translateY || ''}
              onChange={(e) => handleChange({ translateY: e.target.value })}
              placeholder="0px"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
