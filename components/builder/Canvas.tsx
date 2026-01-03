'use client';

import { Fragment } from 'react';
import { useBlocks } from '@/lib/block-context';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { DropZone } from './DropZone';

export function Canvas() {
  const { blocks, selectBlock } = useBlocks();

  return (
    <div className="flex-1 bg-white p-8 overflow-y-auto" onClick={() => selectBlock(null)}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Preview Canvas</h2>
          <p className="text-sm text-gray-500 mt-1">
            Click blocks to select. Drag to reorder or drop into containers.
          </p>
        </div>

        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">No blocks yet</p>
              <p className="text-gray-400 text-sm">
                Add blocks from the palette on the left to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <DropZone parentId={null} index={0} />
            {blocks.map((block, idx) => (
              <Fragment key={block.id}>
                <BlockRenderer block={block} />
                <DropZone parentId={null} index={idx + 1} />
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
