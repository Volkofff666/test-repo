'use client';

import React from 'react';
import { Block } from '@/lib/types';

interface TransitionEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

const ANIMATABLE_PROPERTIES = [
  'background-color',
  'border',
  'border-radius',
  'box-shadow',
  'transform',
  'opacity',
  'color',
  'padding',
  'margin',
  'all',
];

export function TransitionEditor({ block, updateBlock }: TransitionEditorProps) {
  const transition = block.properties.transition || {
    enabled: false,
    duration: '300ms',
    easing: 'ease',
    properties: ['all'],
  };

  const handleChange = (updates: Partial<NonNullable<Block['properties']['transition']>>) => {
    updateBlock(block.id, {
      transition: {
        ...transition,
        ...updates,
      },
    });
  };

  const toggleProperty = (prop: string) => {
    const currentProps = transition.properties || [];
    if (currentProps.includes(prop)) {
      handleChange({ properties: currentProps.filter(p => p !== prop) });
    } else {
      handleChange({ properties: [...currentProps, prop] });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Transitions</h4>
        <input
          type="checkbox"
          checked={transition.enabled}
          onChange={(e) => handleChange({ enabled: e.target.checked })}
          className="h-4 w-4"
        />
      </div>

      {transition.enabled && (
        <div className="space-y-4 pt-2 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Duration</label>
              <input
                type="text"
                value={transition.duration || ''}
                onChange={(e) => handleChange({ duration: e.target.value })}
                placeholder="300ms"
                className="w-full px-2 py-1 text-sm border rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Easing</label>
              <select
                value={transition.easing || 'ease'}
                onChange={(e) => handleChange({ easing: e.target.value as NonNullable<Block['properties']['transition']>['easing'] })}
                className="w-full px-2 py-1 text-sm border rounded"
              >
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="linear">Linear</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-500">Properties to Animate</label>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              {ANIMATABLE_PROPERTIES.map((prop) => (
                <label key={prop} className="flex items-center gap-2 text-[10px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(transition.properties || []).includes(prop)}
                    onChange={() => toggleProperty(prop)}
                    className="h-3 w-3"
                  />
                  {prop}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
