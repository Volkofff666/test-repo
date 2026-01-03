'use client';

import { Fragment, useMemo, useState } from 'react';
import { useBlocks } from '@/lib/block-context';
import { Block } from '@/lib/types';
import { countBlocks } from '@/lib/project-storage';
import { DropZone } from './DropZone';
import { LayerItem } from './LayerItem';

function matchesQuery(block: Block, query: string) {
  const q = query.toLowerCase();
  const name = block.properties.name?.toLowerCase() ?? '';
  const text = block.properties.text?.toLowerCase() ?? '';
  const logoText = block.properties.logoText?.toLowerCase() ?? '';
  const type = block.type.toLowerCase();

  return name.includes(q) || text.includes(q) || logoText.includes(q) || type.includes(q);
}

function filterBlocks(blocks: Block[], query: string): Block[] {
  if (!query.trim()) return blocks;

  const q = query.trim();
  return blocks.flatMap(block => {
    const children = block.properties.children ?? [];
    const filteredChildren = filterBlocks(children, q);
    const shouldInclude = matchesQuery(block, q) || filteredChildren.length > 0;

    if (!shouldInclude) return [];

    return [
      {
        ...block,
        properties: {
          ...block.properties,
          children: filteredChildren,
        },
      },
    ];
  });
}

export function LayersPanel() {
  const { blocks, selectBlock } = useBlocks();
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState('');

  const total = useMemo(() => countBlocks(blocks), [blocks]);
  const isFiltering = query.trim().length > 0;

  const visibleBlocks = useMemo(() => filterBlocks(blocks, query), [blocks, query]);

  const isExpanded = (id: string) => {
    if (isFiltering) return true;
    return !collapsed.has(id);
  };

  const toggleExpanded = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderLevel = (list: Block[], parentId: string | null, depth: number) => {
    const indent = 8 + depth * 16;

    return (
      <div>
        <DropZone parentId={parentId} index={0} indent={indent} disabled={isFiltering} />
        {list.map((block, idx) => {
          const canExpand = block.type === 'container';
          const expandedHere = canExpand && isExpanded(block.id);

          return (
            <Fragment key={block.id}>
              <LayerItem
                block={block}
                depth={depth}
                isExpanded={expandedHere}
                onToggleExpand={() => toggleExpanded(block.id)}
                disableDrag={isFiltering}
              />

              {canExpand && expandedHere && (block.properties.children?.length ?? 0) > 0 && (
                <div className="mt-1">
                  {renderLevel(block.properties.children ?? [], block.id, depth + 1)}
                </div>
              )}

              <DropZone parentId={parentId} index={idx + 1} indent={indent} disabled={isFiltering} />
            </Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Layers</h3>
          <div className="text-xs text-gray-500">{total} block{total === 1 ? '' : 's'}</div>
        </div>

        <div className="mt-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search layers…"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
          />
          {isFiltering && (
            <div className="text-[11px] text-gray-400 mt-1">Drag & drop is disabled while filtering.</div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2 bg-gray-50" onClick={() => selectBlock(null)}>
        {blocks.length === 0 ? (
          <div className="text-sm text-gray-400 px-2 py-4">No blocks yet.</div>
        ) : visibleBlocks.length === 0 ? (
          <div className="text-sm text-gray-400 px-2 py-4">No matching blocks.</div>
        ) : (
          renderLevel(visibleBlocks, null, 0)
        )}
      </div>
    </div>
  );
}
