'use client';

import React from 'react';
import { Block } from '@/lib/types';

interface TextShadowEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

export function TextShadowEditor({ block, updateBlock }: TextShadowEditorProps) {
  const textShadow = block.properties.textShadow || {
    offsetX: '0px',
    offsetY: '2px',
    blur: '4px',
    color: 'rgba(0,0,0,0.5)',
  };

  const handleChange = (updates: Partial<NonNullable<Block['properties']['textShadow']>>) => {
    updateBlock(block.id, {
      textShadow: {
        ...textShadow,
        ...updates,
      },
    });
  };

  const [enabled, setEnabled] = React.useState(!!block.properties.textShadow);

  return (
    <div className="space-y-4 p-4 border rounded-md bg-gray-50">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm">Text Shadow</h4>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => {
            setEnabled(e.target.checked);
            if (e.target.checked) {
              updateBlock(block.id, { textShadow: textShadow });
            } else {
              updateBlock(block.id, { textShadow: undefined });
            }
          }}
          className="h-4 w-4"
        />
      </div>

      {enabled && (
        <div className="space-y-3 pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase">Offset X</label>
              <input
                type="text"
                value={textShadow.offsetX || ''}
                onChange={(e) => handleChange({ offsetX: e.target.value })}
                placeholder="0px"
                className="w-full px-2 py-1 text-xs border rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 uppercase">Offset Y</label>
              <input
                type="text"
                value={textShadow.offsetY || ''}
                onChange={(e) => handleChange({ offsetY: e.target.value })}
                placeholder="2px"
                className="w-full px-2 py-1 text-xs border rounded"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Blur</label>
            <input
              type="text"
              value={textShadow.blur || ''}
              onChange={(e) => handleChange({ blur: e.target.value })}
              placeholder="4px"
              className="w-full px-2 py-1 text-xs border rounded"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 uppercase">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textShadow.color?.startsWith('#') ? textShadow.color : '#000000'}
                onChange={(e) => handleChange({ color: e.target.value })}
                className="w-8 h-8 p-0 border rounded"
              />
              <input
                type="text"
                value={textShadow.color || ''}
                onChange={(e) => handleChange({ color: e.target.value })}
                placeholder="rgba(0,0,0,0.5)"
                className="flex-1 px-2 py-1 text-sm border rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
