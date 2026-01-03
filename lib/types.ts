export type BlockType = 'container' | 'text' | 'button' | 'heading';

export interface Block {
  id: string;
  type: BlockType;
  bemName: string;
  properties: {
    text?: string;
    backgroundColor?: string;
    padding?: string;
    fontSize?: string;
    color?: string;
    children?: Block[];
    modifiers?: Record<string, boolean>;
    tag?: 'h1' | 'h2' | 'h3';
  };
}

export interface BlockContextType {
  blocks: Block[];
  selectedBlockId: string | null;
  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
  selectBlock: (id: string | null) => void;
  getSelectedBlock: () => Block | null;
}
