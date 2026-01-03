'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Block, BlockContextType } from './types';

const BlockContext = createContext<BlockContextType | undefined>(undefined);

export function BlockProvider({ children }: { children: ReactNode }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = (block: Block) => {
    setBlocks(prev => [...prev, block]);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => {
      const removeRecursive = (blocks: Block[]): Block[] => {
        return blocks.filter(block => {
          if (block.id === id) {
            return false;
          }
          if (block.properties.children) {
            block.properties.children = removeRecursive(block.properties.children);
          }
          return true;
        });
      };
      return removeRecursive(prev);
    });
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const updateBlock = (id: string, properties: Partial<Block['properties']>) => {
    setBlocks(prev => {
      const updateRecursive = (blocks: Block[]): Block[] => {
        return blocks.map(block => {
          if (block.id === id) {
            return {
              ...block,
              properties: {
                ...block.properties,
                ...properties,
              },
            };
          }
          if (block.properties.children) {
            return {
              ...block,
              properties: {
                ...block.properties,
                children: updateRecursive(block.properties.children),
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
    
    const findBlock = (blocks: Block[]): Block | null => {
      for (const block of blocks) {
        if (block.id === selectedBlockId) {
          return block;
        }
        if (block.properties.children) {
          const found = findBlock(block.properties.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    return findBlock(blocks);
  };

  return (
    <BlockContext.Provider
      value={{
        blocks,
        selectedBlockId,
        addBlock,
        removeBlock,
        updateBlock,
        selectBlock,
        getSelectedBlock,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
}

export function useBlocks() {
  const context = useContext(BlockContext);
  if (context === undefined) {
    throw new Error('useBlocks must be used within a BlockProvider');
  }
  return context;
}
