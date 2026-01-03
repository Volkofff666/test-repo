# Header/Navigation Component Constructor - Documentation

## Overview

A fully customizable Header/Navigation block component has been implemented for the block constructor. This component allows users to create professional navigation headers with complete control over visual properties and menu items.

## Architecture

### Files Created/Modified

#### New Files:
1. **`components/blocks/BlockHeader.tsx`** - Preview component for header blocks
2. **`components/builder/HeaderPropertyEditor.tsx`** - Dedicated property editor for headers
3. **`test-header-output.md`** - Expected output documentation

#### Modified Files:
1. **`lib/types.ts`** - Added header type and properties
2. **`lib/bem-generator.ts`** - Added HTML/CSS generation for headers
3. **`components/blocks/BlockRenderer.tsx`** - Added header rendering
4. **`components/builder/Palette.tsx`** - Added header to palette
5. **`components/builder/PropertyEditor.tsx`** - Integrated HeaderPropertyEditor

## Features Implemented

### 1. Logo/Brand Section
- **Logo Text**: Customizable text content
- **Logo Color**: Full color picker with hex input
- **Logo Font Size**: Flexible size input (px, rem, em)
- **Logo Alignment**: Vertical alignment (top, center, bottom)

### 2. Container Styling
- **Background Color**: Full color customization
- **Padding**: Flexible padding input (shorthand or individual)
- **Border Radius**: Rounded corners (px, rem, %)
- **Box Shadow**: Custom shadow with 3 presets:
  - Subtle: `0 1px 3px rgba(0,0,0,0.1)`
  - Medium: `0 2px 8px rgba(0,0,0,0.1)`
  - Strong: `0 4px 16px rgba(0,0,0,0.15)`
- **Border**: Full border control (width, style, color)
- **Margin Bottom**: Spacing below header

### 3. Menu Items Management
- **Add/Remove Items**: Dynamic menu item management
- **Per-Item Editing**:
  - Label text
  - URL/href
  - Custom color (overrides default)
- **Default Styling**:
  - Menu item color
  - Hover color
  - Font size
  - Padding
  - Gap between items

### 4. Layout Options
- **Container Layout**: 
  - Space Between (logo left, menu right)
  - Flex Start (both left)
  - Flex End (both right)
- **Logo Alignment**: Top, Center, Bottom

### 5. BEM Code Generation

#### HTML Structure:
```html
<header class="header">
  <div class="header__container">
    <div class="header__logo">Logo Text</div>
    <nav class="header__nav">
      <a href="#" class="header__nav-item">Link 1</a>
      <a href="#" class="header__nav-item">Link 2</a>
    </nav>
  </div>
</header>
```

#### CSS Classes Generated:
- `.header` - Main header block
- `.header__container` - Flex container
- `.header__logo` - Logo element
- `.header__nav` - Navigation wrapper
- `.header__nav-item` - Individual links
- `.header__nav-item:hover` - Hover states

### 6. Real-time Preview
- All property changes reflect immediately
- Interactive hover effects on menu items
- Visual selection indicator
- Delete button when selected
- Responsive to all property updates

## Usage Guide

### Adding a Header Block

1. Click the "🎯 Add Header" button in the Palette panel
2. A default header appears with:
   - Logo text: "Your Logo"
   - Three menu items: Home, About, Contact
   - Professional default styling

### Customizing the Header

#### Logo Customization:
1. Select the header block
2. In the "Logo" section:
   - Edit the logo text
   - Choose a color using the picker or hex input
   - Adjust font size (e.g., "24px", "1.5rem")

#### Container Styling:
1. In the "Container Styling" section:
   - Set background color
   - Adjust padding (e.g., "1rem 2rem")
   - Set border radius (e.g., "8px", "0.5rem")
   - Choose a shadow preset or enter custom
   - Add borders (e.g., "1px solid #ccc")
   - Set margin bottom

#### Managing Menu Items:
1. In the "Menu Items" section:
   - Click "+ Add Item" to add new links
   - For each item:
     - Edit the label
     - Set the URL/href
     - Optionally set a custom color
   - Click "Remove" to delete an item

2. Set default menu styling:
   - Default color for all items
   - Hover color
   - Font size
   - Padding around each link
   - Gap between items

#### Layout Configuration:
1. In the "Layout" section:
   - Choose container layout distribution
   - Set logo vertical alignment

### Generating Code

1. Select the "Generated Code" panel on the right
2. Switch between HTML and CSS tabs
3. Click "Copy" to copy the code
4. Paste into your project

## Technical Details

### Type Definitions

```typescript
interface MenuItem {
  id: string;
  label: string;
  href?: string;
  color?: string;
}

interface HeaderBlock {
  type: 'header';
  properties: {
    logoText?: string;
    logoColor?: string;
    logoFontSize?: string;
    backgroundColor?: string;
    padding?: string;
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
  }
}
```

### Default Values

```javascript
{
  logoText: 'Your Logo',
  logoColor: '#333333',
  logoFontSize: '24px',
  backgroundColor: '#ffffff',
  padding: '1rem 2rem',
  borderRadius: '0px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: 'none',
  marginBottom: '1rem',
  menuItems: [
    { id: 'auto-generated', label: 'Home', href: '#home' },
    { id: 'auto-generated', label: 'About', href: '#about' },
    { id: 'auto-generated', label: 'Contact', href: '#contact' }
  ],
  menuItemColor: '#666666',
  menuItemHoverColor: '#0066cc',
  menuItemFontSize: '14px',
  menuItemPadding: '0.5rem 1rem',
  menuItemGap: '1.5rem',
  justifyContent: 'space-between',
  alignment: 'center'
}
```

## CSS Properties Supported

### Border Radius
- Supports: `px`, `rem`, `em`, `%`
- Examples: `8px`, `0.5rem`, `50%`
- Can use shorthand: `8px 8px 0 0` (top corners only)

### Box Shadow
- Supports full CSS box-shadow syntax
- Examples:
  - `0 2px 8px rgba(0,0,0,0.1)` - Basic shadow
  - `0 4px 16px rgba(0,0,0,0.15)` - Larger shadow
  - `inset 0 2px 4px rgba(0,0,0,0.1)` - Inset shadow
  - `0 0 0 2px blue` - Outline effect

### Border
- Supports full CSS border syntax
- Examples:
  - `1px solid #ccc` - Solid border
  - `2px dashed red` - Dashed border
  - `3px double #000` - Double border

### Padding
- Supports: `px`, `rem`, `em`
- Can use shorthand:
  - `1rem` - All sides
  - `1rem 2rem` - Vertical | Horizontal
  - `1rem 2rem 1rem 2rem` - Top | Right | Bottom | Left

## Best Practices

### 1. Color Contrast
- Ensure logo color contrasts with background
- Menu item colors should be readable
- Hover colors should be noticeably different

### 2. Spacing
- Use consistent padding values
- Maintain adequate gap between menu items
- Consider mobile responsiveness (future feature)

### 3. Border Radius
- Use subtle radius (4-8px) for professional look
- Larger radius (12-16px) for modern/playful designs
- 0px for sharp, traditional headers

### 4. Box Shadow
- Subtle shadows work best for headers
- Avoid overly dramatic shadows
- Consider the overall page design

### 5. Menu Items
- Keep labels concise (1-2 words)
- Use meaningful hrefs (or # for demos)
- Limit to 5-7 items for best UX

## Acceptance Criteria Status

✅ Can add header block to canvas
✅ Can customize all header properties (colors, spacing, borders, border-radius, shadows)
✅ Menu items can be added/removed/edited
✅ Real-time preview updates as properties change
✅ Generated HTML/CSS is BEM-compliant and correct
✅ Header code can be copied from CodeViewer
✅ Border-radius works with px and % values
✅ Box-shadow presets or custom values work
✅ Hover effects on menu items in preview
✅ Multiple headers can be added to canvas
✅ Header can be deleted like other blocks

## Future Enhancements (Optional)

### Potential Improvements:
1. **Mobile Responsive Menu**: Hamburger menu for small screens
2. **Logo Image Support**: Upload and position logo images
3. **Dropdown Menus**: Multi-level navigation
4. **Sticky Header**: Fixed positioning on scroll
5. **Animation Presets**: Smooth transitions and effects
6. **Theme Presets**: Pre-designed header templates
7. **Search Integration**: Built-in search bar
8. **Social Icons**: Quick add social media links
9. **Call-to-Action Button**: Highlighted button in header
10. **Accessibility Options**: ARIA labels and keyboard navigation

## Troubleshooting

### Issue: Menu items not displaying
- **Solution**: Ensure menuItems array is not empty. Add items using "+ Add Item" button.

### Issue: Hover effect not working
- **Solution**: Check menuItemHoverColor is set and different from default color.

### Issue: Border radius not visible
- **Solution**: Ensure value includes unit (e.g., "8px" not "8"). Try increasing value.

### Issue: Box shadow not showing
- **Solution**: Check background color contrasts with shadow. Increase opacity in rgba value.

### Issue: Generated CSS looks different from preview
- **Solution**: Preview uses inline styles for real-time updates. Generated CSS uses BEM classes for production use.

## Support

For issues or questions:
1. Check this documentation
2. Review the generated code in the CodeViewer
3. Examine default values in Palette.tsx
4. Test with minimal properties first, then add complexity

## Conclusion

The Header/Navigation component constructor is a powerful tool for creating customizable, production-ready navigation headers. With extensive styling options, dynamic menu management, and BEM-compliant code generation, it provides everything needed to build professional website headers quickly and efficiently.
