'use client';

import { useMemo, useState } from 'react';
import { Block } from '@/lib/types';
import { useBlocks } from '@/lib/block-context';
import { getDraggedBlockId, setDraggedBlockId } from '@/lib/drag-handler';

interface LayerItemProps {
  block: Block;
  depth: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  disableDrag?: boolean;
}

function getTypeIcon(type: Block['type']) {
  switch (type) {
    case 'header':
      return '🎯';
    case 'container':
      return '📦';
    case 'heading':
      return '📝';
    case 'text':
      return '📄';
    case 'button':
      return '🔘';
    default:
      return '⬛';
  }
}

function getPreviewText(block: Block) {
  if (block.properties.name?.trim()) {
    const name = block.properties.name.trim();
    return name.length > 30 ? `${name.slice(0, 30)}…` : name;
  }

  const raw =
    block.type === 'header'
      ? block.properties.logoText
      : block.properties.text;

  const fallback = block.type.charAt(0).toUpperCase() + block.type.slice(1);
  if (!raw) return fallback;

  return raw.length > 30 ? `${raw.slice(0, 30)}…` : raw;
}

export function LayerItem({ block, depth, isExpanded, onToggleExpand, disableDrag }: LayerItemProps) {
  const { selectedBlockId, selectBlock, removeBlock, updateBlock, moveBlock } = useBlocks();
  const isSelected = selectedBlockId === block.id;

  const canExpand = block.type === 'container';
  const childCount = block.properties.children?.length ?? 0;

  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [isDropIntoOver, setIsDropIntoOver] = useState(false);

  const label = useMemo(() => getPreviewText(block), [block]);

  const commitRename = () => {
    const next = draftName.trim();
    updateBlock(block.id, { name: next || undefined });
    setIsEditing(false);
  };

  return (
    <div
      className={`group flex items-center gap-2 px-2 py-1 rounded border transition-colors select-none ${
        isSelected
          ? 'bg-blue-50 border-blue-300'
          : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50'
      } ${isDropIntoOver ? 'ring-2 ring-blue-300' : ''}`}
      style={{ paddingLeft: 8 + depth * 16 }}
      onClick={e => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
      onDragOver={e => {
        if (disableDrag) return;
        if (!canExpand) return;
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDropIntoOver(true);
      }}
      onDragLeave={e => {
        e.stopPropagation();
        setIsDropIntoOver(false);
      }}
      onDrop={e => {
        if (disableDrag) return;
        if (!canExpand) return;
        e.stopPropagation();
        e.preventDefault();
        setIsDropIntoOver(false);
        const draggedId = getDraggedBlockId(e);
        if (!draggedId) return;
        moveBlock(draggedId, block.id, childCount);
        if (!isExpanded) onToggleExpand();
      }}
    >
      <div
        draggable={!disableDrag}
        onDragStart={e => {
          if (disableDrag) return;
          e.stopPropagation();
          setDraggedBlockId(e, block.id);
          e.currentTarget.classList.add('opacity-50');
        }}
        onDragEnd={e => {
          e.currentTarget.classList.remove('opacity-50');
        }}
        className={`w-5 text-gray-400 cursor-grab active:cursor-grabbing ${
          disableDrag ? 'cursor-not-allowed opacity-50' : ''
        }`}
        title={disableDrag ? 'Drag disabled while filtering' : 'Drag to reorder'}
      >
        ⋮⋮
      </div>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          if (!canExpand) return;
          onToggleExpand();
        }}
        className={`w-5 text-xs text-gray-500 ${
          canExpand ? 'hover:text-gray-800' : 'opacity-0'
        }`}
        aria-label={canExpand ? (isExpanded ? 'Collapse' : 'Expand') : undefined}
      >
        {canExpand ? (isExpanded ? '▾' : '▸') : ''}
      </button>

      <span className="w-6" aria-hidden>
        {getTypeIcon(block.type)}
      </span>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            value={draftName}
            onChange={e => setDraftName(e.target.value)}
            onBlur={commitRename}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                commitRename();
              }
              if (e.key === 'Escape') {
                setIsEditing(false);
                setDraftName(block.properties.name ?? '');
              }
            }}
            autoFocus
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            placeholder={label}
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <div
            className="text-sm text-gray-800 truncate"
            onDoubleClick={e => {
              e.stopPropagation();
              setDraftName(block.properties.name ?? '');
              setIsEditing(true);
            }}
            title={label}
          >
            {label}
          </div>
        )}
        {canExpand && (
          <div className="text-[11px] text-gray-400">{childCount} child{childCount === 1 ? '' : 'ren'}</div>
        )}
      </div>

      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          removeBlock(block.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-opacity px-1"
        aria-label="Delete block"
        title="Delete"
      >
        ✕
      </button>
    </div>
  );
}
