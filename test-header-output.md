# Header Block Code Generation Test

This document shows the expected output from the header block implementation.

## Test Block Configuration

```javascript
{
  id: 'header-1',
  type: 'header',
  bemName: 'header',
  properties: {
    logoText: 'My Brand',
    logoColor: '#2c3e50',
    logoFontSize: '28px',
    backgroundColor: '#ffffff',
    padding: '1.5rem 3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e0e0e0',
    marginBottom: '2rem',
    menuItems: [
      { id: '1', label: 'Home', href: '#home' },
      { id: '2', label: 'About', href: '#about' },
      { id: '3', label: 'Services', href: '#services' },
      { id: '4', label: 'Contact', href: '#contact' },
    ],
    menuItemColor: '#666666',
    menuItemHoverColor: '#0066cc',
    menuItemFontSize: '16px',
    menuItemPadding: '0.75rem 1.25rem',
    menuItemGap: '2rem',
    justifyContent: 'space-between',
    alignment: 'center',
  }
}
```

## Expected HTML Output

```html
<header class="header">
  <div class="header__container">
    <div class="header__logo">My Brand</div>
    <nav class="header__nav">
      <a href="#home" class="header__nav-item">Home</a>
      <a href="#about" class="header__nav-item">About</a>
      <a href="#services" class="header__nav-item">Services</a>
      <a href="#contact" class="header__nav-item">Contact</a>
    </nav>
  </div>
</header>
```

## Expected CSS Output

```css
.header {
  background-color: #ffffff;
  padding: 1.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  margin-bottom: 2rem;
}

.header__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header__logo {
  font-size: 28px;
  color: #2c3e50;
  font-weight: bold;
  align-self: center;
}

.header__nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.header__nav-item {
  color: #666666;
  text-decoration: none;
  font-size: 16px;
  padding: 0.75rem 1.25rem;
  transition: color 0.3s ease;
}

.header__nav-item:hover {
  color: #0066cc;
}
```

## Features Implemented

✅ **Logo Customization**
- Logo text
- Logo color
- Logo font size
- Logo alignment

✅ **Container Styling**
- Background color
- Padding
- Border radius (supports px, rem, %)
- Box shadow (with presets: subtle, medium, strong)
- Border (with style and color)
- Margin bottom

✅ **Menu Items**
- Add/remove menu items dynamically
- Edit label, href, and individual color per item
- Default menu item color
- Menu item hover color
- Menu item font size
- Menu item padding
- Gap between items

✅ **Layout Options**
- Container layout (space-between, flex-start, flex-end)
- Logo alignment (top, center, bottom)

✅ **BEM Methodology**
- Proper BEM class structure (block__element)
- Semantic HTML (header, nav, a tags)
- Hover state styling
- Production-ready code

✅ **Real-time Preview**
- Live updates as properties change
- Interactive hover effects
- Visual selection indicator
- Delete functionality
