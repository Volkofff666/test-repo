'use client';

import { useBlocks } from '@/lib/block-context';
import { MenuItem } from '@/lib/types';

function generateMenuItemId(): string {
  return `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function HeaderPropertyEditor() {
  const { getSelectedBlock, updateBlock } = useBlocks();
  const selectedBlock = getSelectedBlock();

  if (!selectedBlock || selectedBlock.type !== 'header') {
    return null;
  }

  const handlePropertyChange = (property: string, value: string | MenuItem[]) => {
    updateBlock(selectedBlock.id, { [property]: value });
  };

  const menuItems = selectedBlock.properties.menuItems || [];

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: generateMenuItemId(),
      label: 'New Link',
      href: '#',
    };
    handlePropertyChange('menuItems', [...menuItems, newItem]);
  };

  const removeMenuItem = (id: string) => {
    handlePropertyChange('menuItems', menuItems.filter(item => item.id !== id));
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: string) => {
    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    handlePropertyChange('menuItems', updatedItems);
  };

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Header Properties</h3>

      {/* Logo Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Logo</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Text
          </label>
          <input
            type="text"
            value={selectedBlock.properties.logoText || ''}
            onChange={(e) => handlePropertyChange('logoText', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Your Logo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedBlock.properties.logoColor || '#333333'}
              onChange={(e) => handlePropertyChange('logoColor', e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedBlock.properties.logoColor || '#333333'}
              onChange={(e) => handlePropertyChange('logoColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="#333333"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Font Size
          </label>
          <input
            type="text"
            value={selectedBlock.properties.logoFontSize || ''}
            onChange={(e) => handlePropertyChange('logoFontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 24px or 1.5rem"
          />
        </div>
      </div>

      {/* Header Container Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Container Styling</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedBlock.properties.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedBlock.properties.backgroundColor || '#ffffff'}
              onChange={(e) => handlePropertyChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Padding
          </label>
          <input
            type="text"
            value={selectedBlock.properties.padding || ''}
            onChange={(e) => handlePropertyChange('padding', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 1rem 2rem"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Border Radius
          </label>
          <input
            type="text"
            value={selectedBlock.properties.borderRadius || ''}
            onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 8px or 0.5rem"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Box Shadow
          </label>
          <input
            type="text"
            value={selectedBlock.properties.boxShadow || ''}
            onChange={(e) => handlePropertyChange('boxShadow', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 0 2px 8px rgba(0,0,0,0.1)"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handlePropertyChange('boxShadow', '0 1px 3px rgba(0,0,0,0.1)')}
              className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Subtle
            </button>
            <button
              onClick={() => handlePropertyChange('boxShadow', '0 2px 8px rgba(0,0,0,0.1)')}
              className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Medium
            </button>
            <button
              onClick={() => handlePropertyChange('boxShadow', '0 4px 16px rgba(0,0,0,0.15)')}
              className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              Strong
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Border
          </label>
          <input
            type="text"
            value={selectedBlock.properties.border || ''}
            onChange={(e) => handlePropertyChange('border', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 1px solid #ccc"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Margin Bottom
          </label>
          <input
            type="text"
            value={selectedBlock.properties.marginBottom || ''}
            onChange={(e) => handlePropertyChange('marginBottom', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 1rem"
          />
        </div>
      </div>

      {/* Menu Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h4 className="text-sm font-semibold text-gray-700">Menu Items</h4>
          <button
            onClick={addMenuItem}
            className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            + Add Item
          </button>
        </div>

        {menuItems.length === 0 ? (
          <p className="text-sm text-gray-400">No menu items yet. Click &quot;Add Item&quot; to create one.</p>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Menu Item</span>
                  <button
                    onClick={() => removeMenuItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateMenuItem(item.id, 'label', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={item.href || ''}
                    onChange={(e) => updateMenuItem(item.id, 'href', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-mono"
                    placeholder="URL (e.g., #home)"
                  />
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={item.color || selectedBlock.properties.menuItemColor || '#666666'}
                      onChange={(e) => updateMenuItem(item.id, 'color', e.target.value)}
                      className="h-8 w-12 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={item.color || ''}
                      onChange={(e) => updateMenuItem(item.id, 'color', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs font-mono"
                      placeholder="Color (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Menu Item Color (Default)
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedBlock.properties.menuItemColor || '#666666'}
              onChange={(e) => handlePropertyChange('menuItemColor', e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedBlock.properties.menuItemColor || '#666666'}
              onChange={(e) => handlePropertyChange('menuItemColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="#666666"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Menu Item Hover Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedBlock.properties.menuItemHoverColor || '#0066cc'}
              onChange={(e) => handlePropertyChange('menuItemHoverColor', e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedBlock.properties.menuItemHoverColor || '#0066cc'}
              onChange={(e) => handlePropertyChange('menuItemHoverColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              placeholder="#0066cc"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Menu Item Font Size
          </label>
          <input
            type="text"
            value={selectedBlock.properties.menuItemFontSize || ''}
            onChange={(e) => handlePropertyChange('menuItemFontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 14px or 0.875rem"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Menu Item Padding
          </label>
          <input
            type="text"
            value={selectedBlock.properties.menuItemPadding || ''}
            onChange={(e) => handlePropertyChange('menuItemPadding', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 0.5rem 1rem"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gap Between Items
          </label>
          <input
            type="text"
            value={selectedBlock.properties.menuItemGap || ''}
            onChange={(e) => handlePropertyChange('menuItemGap', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
            placeholder="e.g., 1.5rem"
          />
        </div>
      </div>

      {/* Layout Section */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Layout</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Container Layout
          </label>
          <select
            value={selectedBlock.properties.justifyContent || 'space-between'}
            onChange={(e) => handlePropertyChange('justifyContent', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="space-between">Space Between (Logo left, Menu right)</option>
            <option value="flex-start">Flex Start (Both left)</option>
            <option value="flex-end">Flex End (Both right)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Alignment
          </label>
          <select
            value={selectedBlock.properties.alignment || 'center'}
            onChange={(e) => handlePropertyChange('alignment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="flex-start">Top</option>
            <option value="center">Center</option>
            <option value="flex-end">Bottom</option>
          </select>
        </div>
      </div>
    </div>
  );
}
