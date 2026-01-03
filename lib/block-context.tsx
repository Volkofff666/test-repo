'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Block, BlockContextType } from './types';

const BlockContext = createContext<BlockContextType | undefined>(undefined);

function generateId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function cloneBlocks(blocks: Block[]): Block[] {
  if (typeof structuredClone === 'function') {
    return structuredClone(blocks);
  }
  return JSON.parse(JSON.stringify(blocks)) as Block[];
}

function findBlockById(blocks: Block[], id: string): Block | null {
  for (const block of blocks) {
    if (block.id === id) return block;
    const children = block.properties.children;
    if (children && children.length) {
      const found = findBlockById(children, id);
      if (found) return found;
    }
  }
  return null;
}

function containsId(block: Block, id: string): boolean {
  if (block.id === id) return true;
  const children = block.properties.children;
  if (!children?.length) return false;
  return children.some(child => containsId(child, id));
}

function removeBlockById(
  blocks: Block[],
  id: string
): { blocks: Block[]; removed: Block | null } {
  let removed: Block | null = null;

  const next = blocks
    .map(block => {
      if (block.id === id) {
        removed = block;
        return null;
      }

      const children = block.properties.children;
      if (children?.length) {
        const result = removeBlockById(children, id);
        if (result.removed) {
          removed = result.removed;
          return {
            ...block,
            properties: {
              ...block.properties,
              children: result.blocks,
            },
          };
        }
      }

      return block;
    })
    .filter(Boolean) as Block[];

  return { blocks: next, removed };
}

function insertBlock(
  blocks: Block[],
  parentId: string | null,
  index: number,
  blockToInsert: Block
): Block[] {
  if (parentId === null) {
    const next = [...blocks];
    const clampedIndex = Math.max(0, Math.min(index, next.length));
    next.splice(clampedIndex, 0, blockToInsert);
    return next;
  }

  return blocks.map(block => {
    if (block.id === parentId) {
      if (block.type !== 'container') return block;

      const currentChildren = block.properties.children ?? [];
      const nextChildren = [...currentChildren];
      const clampedIndex = Math.max(0, Math.min(index, nextChildren.length));
      nextChildren.splice(clampedIndex, 0, blockToInsert);

      return {
        ...block,
        properties: {
          ...block.properties,
          children: nextChildren,
        },
      };
    }

    const children = block.properties.children;
    if (children?.length) {
      return {
        ...block,
        properties: {
          ...block.properties,
          children: insertBlock(children, parentId, index, blockToInsert),
        },
      };
    }

    return block;
  });
}

function findParentAndIndex(
  blocks: Block[],
  id: string,
  parentId: string | null = null
): { parentId: string | null; index: number } | null {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.id === id) {
      return { parentId, index: i };
    }

    const children = block.properties.children;
    if (children?.length) {
      const found = findParentAndIndex(children, id, block.id);
      if (found) return found;
    }
  }

  return null;
}

export function BlockProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const [projectId, setProjectId] = useState(() => generateId('project'));
  const [projectName, setProjectNameState] = useState('Untitled Project');
  const [projectCreatedAt, setProjectCreatedAt] = useState(() => new Date().toISOString());

  const [history, setHistory] = useState<Block[][]>([]);

  const addBlock = (block: Block) => {
    setBlocks(prev => [...prev, block]);
  }; 

  const removeBlock = (id: string) => {
    setBlocks(prev => {
      const result = removeBlockById(prev, id);
      if (selectedBlockId && !findBlockById(result.blocks, selectedBlockId)) {
        setSelectedBlockId(null);
      }
      return result.blocks;
    });
  };

  const updateBlock = (id: string, properties: Partial<Block['properties']>) => {
    setBlocks(prev => {
      const updateRecursive = (list: Block[]): Block[] => {
        return list.map(block => {
          if (block.id === id) {
            return {
              ...block,
              properties: {
                ...block.properties,
                ...properties,
              },
            };
          }
          const children = block.properties.children;
          if (children?.length) {
            return {
              ...block,
              properties: {
                ...block.properties,
                children: updateRecursive(children),
              },
            };
          }
          return block;
        });
      };

      return updateRecursive(prev);
    });
  };

  const selectBlock = (id: string | null) => {
    setSelectedBlockId(id);
  };

  const getSelectedBlock = (): Block | null => {
    if (!selectedBlockId) return null;
    return findBlockById(blocks, selectedBlockId);
  };

  const replaceBlocks = (nextBlocks: Block[]) => {
    setBlocks(nextBlocks);
    setSelectedBlockId(null);
    setHistory([]);
  };

  const loadProject: BlockContextType['loadProject'] = project => {
    setProjectId(project.id);
    setProjectNameState(project.name);
    setProjectCreatedAt(project.createdAt ?? new Date().toISOString());
    replaceBlocks(project.blocks);
  };

  const setProjectName: BlockContextType['setProjectName'] = name => {
    setProjectNameState(name);
  };

  const moveBlock: BlockContextType['moveBlock'] = (blockId, targetParentId, targetIndex) => {
    setBlocks(prev => {
      const source = findParentAndIndex(prev, blockId);
      if (!source) return prev;

      if (targetParentId) {
        const parent = findBlockById(prev, targetParentId);
        if (!parent || parent.type !== 'container') {
          return prev;
        }
      }

      const removedResult = removeBlockById(prev, blockId);
      if (!removedResult.removed) return prev;

      if (targetParentId && containsId(removedResult.removed, targetParentId)) {
        return prev;
      }

      let nextIndex = targetIndex;
      if (source.parentId === targetParentId) {
        if (source.index < targetIndex) {
          nextIndex = targetIndex - 1;
        }
        if (source.index === nextIndex) {
          return prev;
        }
      }

      setHistory(h => [cloneBlocks(prev), ...h].slice(0, 50));
      return insertBlock(removedResult.blocks, targetParentId, nextIndex, removedResult.removed);
    });
  };

  const undo = () => {
    setHistory(prev => {
      if (!prev.length) return prev;
      const [last, ...rest] = prev;
      setBlocks(last);
      setSelectedBlockId(null);
      return rest;
    });
  };

  const canUndo = history.length > 0;

  const value: BlockContextType = {
    blocks,
    selectedBlockId,
    projectId,
    projectName,
    projectCreatedAt,
    setProjectName,
    addBlock,
    removeBlock,
    updateBlock,
    selectBlock,
    getSelectedBlock,
    replaceBlocks,
    loadProject,
    moveBlock,
    undo,
    canUndo,
  };

  return <BlockContext.Provider value={value}>{children}</BlockContext.Provider>;
}

export function useBlocks() {
  const context = useContext(BlockContext);
  if (context === undefined) {
    throw new Error('useBlocks must be used within a BlockProvider');
  }
  return context;
}
