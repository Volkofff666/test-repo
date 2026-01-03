export type BlockType = 'container' | 'text' | 'button' | 'heading' | 'header';

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  color?: string;
}

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
    
    // Header-specific properties
    logoText?: string;
    logoColor?: string;
    logoFontSize?: string;
    marginBottom?: string;
    borderRadius?: string;
    boxShadow?: string;
    border?: string;
    menuItems?: MenuItem[];
    menuItemColor?: string;
    menuItemHoverColor?: string;
    menuItemFontSize?: string;
    menuItemPadding?: string;
    menuItemGap?: string;
    alignment?: 'flex-start' | 'center' | 'flex-end';
    justifyContent?: 'space-between' | 'flex-start' | 'flex-end';
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
