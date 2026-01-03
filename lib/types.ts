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
    name?: string;
    text?: string;
    backgroundColor?: string;
    padding?: string;
    fontSize?: string;
    color?: string;
    children?: Block[];
    modifiers?: Record<string, boolean>;
    tag?: 'h1' | 'h2' | 'h3';

    // Advanced Styling
    border?: {
      width?: string;
      style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none';
      color?: string;
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    } | string;
    
    borderRadius?: {
      all?: string;
      topLeft?: string;
      topRight?: string;
      bottomRight?: string;
      bottomLeft?: string;
    } | string;
    
    boxShadow?: {
      preset?: 'none' | 'subtle' | 'medium' | 'strong';
      custom?: string;
    } | string;
    
    gradient?: {
      enabled?: boolean;
      type?: 'linear' | 'radial';
      angle?: number;
      color1?: string;
      color2?: string;
      color3?: string;
      stops?: Array<{color: string; position: number}>;
    };
    
    opacity?: number;
    
    textShadow?: {
      offsetX?: string;
      offsetY?: string;
      blur?: string;
      color?: string;
    };
    
    filters?: {
      blur?: number;
      brightness?: number;
      contrast?: number;
      saturate?: number;
      hueRotate?: number;
      invert?: number;
      sepia?: number;
      grayscale?: number;
    };
    
    transform?: {
      rotate?: number;
      scaleX?: number;
      scaleY?: number;
      skewX?: number;
      skewY?: number;
      translateX?: string;
      translateY?: string;
    };
    
    transition?: {
      enabled?: boolean;
      duration?: string;
      easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
      properties?: string[];
    };

    // Header-specific properties
    logoText?: string;
    logoColor?: string;
    logoFontSize?: string;
    marginBottom?: string;
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

  projectId: string;
  projectName: string;
  projectCreatedAt: string;
  setProjectName: (name: string) => void;

  addBlock: (block: Block) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
  selectBlock: (id: string | null) => void;
  getSelectedBlock: () => Block | null;

  replaceBlocks: (blocks: Block[]) => void;
  loadProject: (project: { id: string; name: string; createdAt?: string; blocks: Block[] }) => void;

  moveBlock: (blockId: string, targetParentId: string | null, targetIndex: number) => void;
  undo: () => void;
  canUndo: boolean;
}
