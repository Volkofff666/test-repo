'use client';

import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from 'react';
import { Block, BlockContextType } from './types';
import {
  createHistoryManager,
  pushHistory,
  undo as performUndo,
  redo as performRedo,
  canUndo as checkCanUndo,
  canRedo as checkCanRedo,
} from './history-manager';

const BlockContext = createContext<BlockContextType | undefined>(undefined);

function generateId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
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

  const historyRef = useRef(createHistoryManager());
  const [canUndoState, setCanUndoState] = useState(false);
  const [canRedoState, setCanRedoState] = useState(false);

  useEffect(() => {
    setCanUndoState(checkCanUndo(historyRef.current));
    setCanRedoState(checkCanRedo(historyRef.current));
  }, [blocks]);

  const addBlock = useCallback((block: Block) => {
    setBlocks(prev => {
      const newBlocks = [...prev, block];
      historyRef.current = pushHistory(historyRef.current, prev, `Added ${block.type}`);
      setCanUndoState(true);
      setCanRedoState(false);
      return newBlocks;
    });
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const result = removeBlockById(prev, id);
      if (selectedBlockId && !findBlockById(result.blocks, selectedBlockId)) {
        setSelectedBlockId(null);
      }
      if (result.removed) {
        historyRef.current = pushHistory(
          historyRef.current,
          prev,
          `Removed ${result.removed.type}`
        );
        setCanUndoState(true);
        setCanRedoState(false);
      }
      return result.blocks;
    });
  }, [selectedBlockId]);

  const updateBlock = useCallback(
    (id: string, properties: Partial<Block['properties']>) => {
      setBlocks(prev => {
        const block = findBlockById(prev, id);
        const blockType = block?.type || 'block';
        const newBlocks = prev.map(b => {
          if (b.id === id) {
            return {
              ...b,
              properties: {
                ...b.properties,
                ...properties,
              },
            };
          }
          const children = b.properties.children;
          if (children?.length) {
            return {
              ...b,
              properties: {
                ...b.properties,
                children: children.map((child: Block) => {
                  if (child.id === id) {
                    return {
                      ...child,
                      properties: {
                        ...child.properties,
                        ...properties,
                      },
                    };
                  }
                  return child;
                }),
              },
            };
          }
          return b;
        });
        historyRef.current = pushHistory(
          historyRef.current,
          prev,
          `Updated ${blockType} properties`
        );
        setCanUndoState(true);
        setCanRedoState(false);
        return newBlocks;
      });
    },
    []
  );

  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  const getSelectedBlock = useCallback((): Block | null => {
    if (!selectedBlockId) return null;
    return findBlockById(blocks, selectedBlockId);
  }, [blocks, selectedBlockId]);

  const replaceBlocks = useCallback((nextBlocks: Block[]) => {
    setBlocks(nextBlocks);
    setSelectedBlockId(null);
    historyRef.current = createHistoryManager();
    setCanUndoState(false);
    setCanRedoState(false);
  }, []);

  const loadProject: BlockContextType['loadProject'] = project => {
    setProjectId(project.id);
    setProjectNameState(project.name);
    setProjectCreatedAt(project.createdAt ?? new Date().toISOString());
    replaceBlocks(project.blocks);
    historyRef.current = pushHistory(
      historyRef.current,
      [],
      `Loaded project: ${project.name}`
    );
    setCanUndoState(true);
    setCanRedoState(false);
  };

  const setProjectName: BlockContextType['setProjectName'] = name => {
    setProjectNameState(name);
  };

  const moveBlock = useCallback(
    (blockId: string, targetParentId: string | null, targetIndex: number) => {
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

        const movedBlock = removedResult.removed;
        historyRef.current = pushHistory(
          historyRef.current,
          prev,
          `Moved ${movedBlock.type}`
        );
        setCanUndoState(true);
        setCanRedoState(false);
        return insertBlock(removedResult.blocks, targetParentId, nextIndex, removedResult.removed);
      });
    },
    []
  );

  const undo = useCallback(() => {
    const result = performUndo(historyRef.current);
    if (result.blocks) {
      setBlocks(result.blocks);
      setSelectedBlockId(null);
    }
    historyRef.current = result.manager;
    setCanUndoState(checkCanUndo(historyRef.current));
    setCanRedoState(checkCanRedo(historyRef.current));
  }, []);

  const redo = useCallback(() => {
    const result = performRedo(historyRef.current);
    if (result.blocks) {
      setBlocks(result.blocks);
      setSelectedBlockId(null);
    }
    historyRef.current = result.manager;
    setCanUndoState(checkCanUndo(historyRef.current));
    setCanRedoState(checkCanRedo(historyRef.current));
  }, []);

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
    redo,
    canUndo: canUndoState,
    canRedo: canRedoState,
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
