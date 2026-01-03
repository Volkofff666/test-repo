'use client';

import { Block } from '@/lib/types';
import { getAllAdvancedStyles } from '@/lib/styling-utils';

interface BlockHeaderProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function BlockHeader({ block, isSelected, onSelect, onRemove }: BlockHeaderProps) {
  const logoText = block.properties.logoText || 'Logo';
  const menuItems = block.properties.menuItems || [];
  
  const containerStyle: React.CSSProperties = {
    backgroundColor: block.properties.backgroundColor || '#ffffff',
    padding: block.properties.padding || '1rem 2rem',
    marginBottom: block.properties.marginBottom || '0',
    display: 'flex',
    justifyContent: block.properties.justifyContent || 'space-between',
    alignItems: 'center',
    ...getAllAdvancedStyles(block),
  };

  const logoStyle: React.CSSProperties = {
    fontSize: block.properties.logoFontSize || '24px',
    color: block.properties.logoColor || '#333',
    fontWeight: 'bold',
    alignSelf: block.properties.alignment || 'center',
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: block.properties.menuItemGap || '1.5rem',
    alignItems: 'center',
  };

  const menuItemColor = block.properties.menuItemColor || '#666';
  const menuItemHoverColor = block.properties.menuItemHoverColor || '#0066cc';
  const menuItemFontSize = block.properties.menuItemFontSize || '14px';
  const menuItemPadding = block.properties.menuItemPadding || '0.5rem 1rem';

  return (
    <div
      className={`relative group border-2 transition-colors ${
        isSelected ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-8 right-0 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 z-10"
        >
          Delete
        </button>
      )}
      <header style={containerStyle}>
        <div style={logoStyle}>{logoText}</div>
        <nav style={navStyle}>
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href || '#'}
              style={{
                color: item.color || menuItemColor,
                textDecoration: 'none',
                fontSize: menuItemFontSize,
                padding: menuItemPadding,
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = menuItemHoverColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = item.color || menuItemColor;
              }}
              onClick={(e) => e.preventDefault()}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>
    </div>
  );
}
