import { Block, ResponsiveProperty } from './types';
import { getAllAdvancedStyles, cssPropertiesToLines } from './styling-utils';
import { breakpoints } from './responsive-config';
import { isResponsiveProperty } from './responsive-properties';

export interface GeneratedCode {
  html: string;
  css: string;
}

function generateBEMClassName(block: Block, element?: string): string {
  const base = block.bemName;
  const className = element ? `${base}__${element}` : base;
  
  if (!block.properties.modifiers) {
    return className;
  }
  
  const modifiers = Object.entries(block.properties.modifiers)
    .filter(([, value]) => value)
    .map(([key]) => `${className}--${key}`)
    .join(' ');
  
  return modifiers ? `${className} ${modifiers}` : className;
}

function generateBlockHTML(block: Block, indent: number = 0): string {
  const spaces = '  '.repeat(indent);
  const className = generateBEMClassName(block);
  
  switch (block.type) {
    case 'container': {
      const children = block.properties.children || [];
      if (children.length === 0) {
        return `${spaces}<div class="${className}"></div>`;
      }
      const childrenHTML = children
        .map(child => generateBlockHTML(child, indent + 1))
        .join('\n');
      return `${spaces}<div class="${className}">\n${childrenHTML}\n${spaces}</div>`;
    }
    
    case 'heading': {
      const tag = block.properties.tag || 'h1';
      const text = block.properties.text || 'Heading';
      return `${spaces}<${tag} class="${className}">${text}</${tag}>`;
    }
    
    case 'text': {
      const text = block.properties.text || 'Text content';
      return `${spaces}<p class="${className}">${text}</p>`;
    }
    
    case 'button': {
      const text = block.properties.text || 'Button';
      return `${spaces}<button class="${className}">${text}</button>`;
    }
    
    case 'header': {
      const logoText = block.properties.logoText || 'Logo';
      const menuItems = block.properties.menuItems || [];
      
      const menuItemsHTML = menuItems
        .map(item => `${spaces}    <a href="${item.href || '#'}" class="${className}__nav-item">${item.label}</a>`)
        .join('\n');
      
      return `${spaces}<header class="${className}">
${spaces}  <div class="${className}__container">
${spaces}    <div class="${className}__logo">${logoText}</div>
${spaces}    <nav class="${className}__nav">
${menuItemsHTML}
${spaces}    </nav>
${spaces}  </div>
${spaces}</header>`;
    }
    
    default:
      return '';
  }
}

interface ResponsiveStyles {
  tablet: string[];
  mobile: string[];
}

function getResponsiveStyles(block: Block): ResponsiveStyles {
  const tablet: string[] = [];
  const mobile: string[] = [];

  const responsivePropKeys: Array<keyof Block['properties']> = [
    'padding',
    'fontSize',
    'marginBottom',
    'gap',
  ];

  for (const key of responsivePropKeys) {
    const prop = block.properties[key];
    if (isResponsiveProperty(prop)) {
      const responsiveProp = prop as ResponsiveProperty;
      if (responsiveProp.tablet) {
        tablet.push(`  ${key}: ${responsiveProp.tablet};`);
      }
      if (responsiveProp.mobile) {
        mobile.push(`  ${key}: ${responsiveProp.mobile};`);
      }
    }
  }

  return { tablet, mobile };
}

function generateBlockCSS(block: Block, cssRules: Set<string>): void {
  const className = block.bemName;
  
  const responsiveStyles = getResponsiveStyles(block);

  const baseStyles: string[] = [];
  
  if (block.properties.backgroundColor) {
    baseStyles.push(`  background-color: ${block.properties.backgroundColor};`);
  }
  
  if (block.properties.padding) {
    if (typeof block.properties.padding === 'string') {
      baseStyles.push(`  padding: ${block.properties.padding};`);
    }
  }
  
  if (block.properties.fontSize) {
    if (typeof block.properties.fontSize === 'string') {
      baseStyles.push(`  font-size: ${block.properties.fontSize};`);
    }
  }
  
  if (block.properties.color) {
    baseStyles.push(`  color: ${block.properties.color};`);
  }
  
  switch (block.type) {
    case 'container':
      if (!block.properties.padding) {
        baseStyles.push(`  padding: 1rem;`);
      }
      break;
    
    case 'heading':
      if (!block.properties.fontSize) {
        baseStyles.push(`  font-size: 2rem;`);
      }
      if (!block.properties.color) {
        baseStyles.push(`  color: #333;`);
      }
      baseStyles.push(`  font-weight: 600;`);
      baseStyles.push(`  margin-bottom: 0.5rem;`);
      break;
    
    case 'text':
      if (!block.properties.fontSize) {
        baseStyles.push(`  font-size: 1rem;`);
      }
      if (!block.properties.color) {
        baseStyles.push(`  color: #666;`);
      }
      baseStyles.push(`  line-height: 1.5;`);
      break;
    
    case 'button':
      if (!block.properties.padding) {
        baseStyles.push(`  padding: 0.5rem 1rem;`);
      }
      if (!block.properties.backgroundColor) {
        baseStyles.push(`  background-color: #0066cc;`);
      }
      if (!block.properties.color) {
        baseStyles.push(`  color: white;`);
      }
      baseStyles.push(`  border: none;`);
      baseStyles.push(`  border-radius: 0.25rem;`);
      baseStyles.push(`  cursor: pointer;`);
      baseStyles.push(`  font-weight: 500;`);
      break;
    
    case 'header':
      if (!block.properties.backgroundColor) {
        baseStyles.push(`  background-color: #ffffff;`);
      }
      if (!block.properties.padding) {
        baseStyles.push(`  padding: 1rem 2rem;`);
      }
      if (block.properties.borderRadius) {
        baseStyles.push(`  border-radius: ${block.properties.borderRadius};`);
      }
      if (block.properties.boxShadow) {
        baseStyles.push(`  box-shadow: ${block.properties.boxShadow};`);
      } else {
        baseStyles.push(`  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);`);
      }
      if (block.properties.border && block.properties.border !== 'none') {
        baseStyles.push(`  border: ${block.properties.border};`);
      }
      if (block.properties.marginBottom) {
        if (typeof block.properties.marginBottom === 'string') {
          baseStyles.push(`  margin-bottom: ${block.properties.marginBottom};`);
        }
      }
      break;
  }
  
  const advancedStyles = getAllAdvancedStyles(block);
  baseStyles.push(...cssPropertiesToLines(advancedStyles));
  
  let blockCSS = '';
  if (baseStyles.length > 0) {
    blockCSS = `.${className} {\n${baseStyles.join('\n')}\n}`;
  }

  if (responsiveStyles.tablet.length > 0 || responsiveStyles.mobile.length > 0) {
    const mediaQueries: string[] = [];

    if (responsiveStyles.tablet.length > 0) {
      mediaQueries.push(`@media (max-width: ${breakpoints.tablet}px) {\n  .${className} {\n${responsiveStyles.tablet.join('\n')}\n  }\n}`);
    }

    if (responsiveStyles.mobile.length > 0) {
      mediaQueries.push(`@media (max-width: ${breakpoints.mobile}px) {\n  .${className} {\n${responsiveStyles.mobile.join('\n')}\n  }\n}`);
    }

    if (blockCSS) {
      cssRules.add(blockCSS);
      mediaQueries.forEach(mq => cssRules.add(mq));
    } else {
      mediaQueries.forEach(mq => cssRules.add(mq));
    }
  } else if (blockCSS) {
    cssRules.add(blockCSS);
  }
  
  if (block.type === 'header') {
    const containerStyles: string[] = [
      `  display: flex;`,
      `  justify-content: ${block.properties.justifyContent || 'space-between'};`,
      `  align-items: center;`,
    ];
    cssRules.add(`.${className}__container {\n${containerStyles.join('\n')}\n}`);
    
    const logoStyles: string[] = [
      `  font-size: ${block.properties.logoFontSize || '24px'};`,
      `  color: ${block.properties.logoColor || '#333'};`,
      `  font-weight: bold;`,
    ];
    if (block.properties.alignment) {
      logoStyles.push(`  align-self: ${block.properties.alignment};`);
    }
    cssRules.add(`.${className}__logo {\n${logoStyles.join('\n')}\n}`);
    
    const navStyles: string[] = [
      `  display: flex;`,
      `  gap: ${block.properties.menuItemGap || '1.5rem'};`,
      `  align-items: center;`,
    ];
    cssRules.add(`.${className}__nav {\n${navStyles.join('\n')}\n}`);
    
    const navItemStyles: string[] = [
      `  color: ${block.properties.menuItemColor || '#666'};`,
      `  text-decoration: none;`,
      `  font-size: ${block.properties.menuItemFontSize || '14px'};`,
      `  padding: ${block.properties.menuItemPadding || '0.5rem 1rem'};`,
      `  transition: color 0.3s ease;`,
    ];
    cssRules.add(`.${className}__nav-item {\n${navItemStyles.join('\n')}\n}`);
    
    const navItemHoverStyles: string[] = [
      `  color: ${block.properties.menuItemHoverColor || '#0066cc'};`,
    ];
    cssRules.add(`.${className}__nav-item:hover {\n${navItemHoverStyles.join('\n')}\n}`);
  }
  
  if (block.properties.modifiers) {
    Object.entries(block.properties.modifiers).forEach(([modifier, enabled]) => {
      if (enabled) {
        const modifierStyles: string[] = [];
        
        if (modifier === 'primary' && block.type === 'button') {
          modifierStyles.push(`  background-color: #0066cc;`);
        } else if (modifier === 'secondary' && block.type === 'button') {
          modifierStyles.push(`  background-color: #6c757d;`);
        } else if (modifier === 'large') {
          modifierStyles.push(`  font-size: 1.25rem;`);
          modifierStyles.push(`  padding: 0.75rem 1.5rem;`);
        } else if (modifier === 'small') {
          modifierStyles.push(`  font-size: 0.875rem;`);
          modifierStyles.push(`  padding: 0.25rem 0.75rem;`);
        }
        
        if (modifierStyles.length > 0) {
          cssRules.add(`.${className}--${modifier} {\n${modifierStyles.join('\n')}\n}`);
        }
      }
    });
  }
  
  if (block.properties.children) {
    block.properties.children.forEach(child => generateBlockCSS(child, cssRules));
  }
}

export function generateCode(blocks: Block[]): GeneratedCode {
  const html = blocks.map(block => generateBlockHTML(block, 0)).join('\n\n');
  
  const cssRules = new Set<string>();
  blocks.forEach(block => generateBlockCSS(block, cssRules));
  const css = Array.from(cssRules).join('\n\n');
  
  return { html, css };
}

export function generateResponsiveCSS(block: Block): string {
  const cssRules = new Set<string>();
  generateBlockCSS(block, cssRules);
  return Array.from(cssRules).join('\n\n');
}
