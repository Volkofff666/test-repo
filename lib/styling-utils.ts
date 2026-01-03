import { Block } from './types';

export function getBorderStyle(block: Block): React.CSSProperties {
  const { border } = block.properties;
  if (!border) return {};

  if (typeof border === 'string') {
    return { border };
  }

  if (border.style === 'none') return { border: 'none' };

  const style: React.CSSProperties = {};
  
  if (border.width) style.borderWidth = border.width;
  if (border.style) style.borderStyle = border.style;
  if (border.color) style.borderColor = border.color;

  if (border.top) style.borderTop = border.top;
  if (border.right) style.borderRight = border.right;
  if (border.bottom) style.borderBottom = border.bottom;
  if (border.left) style.borderLeft = border.left;

  return style;
}

export function getBorderRadiusStyle(block: Block): React.CSSProperties {
  const { borderRadius } = block.properties;
  if (!borderRadius) return {};

  if (typeof borderRadius === 'string') {
    return { borderRadius };
  }

  const style: React.CSSProperties = {};
  if (borderRadius.all) style.borderRadius = borderRadius.all;
  if (borderRadius.topLeft) style.borderTopLeftRadius = borderRadius.topLeft;
  if (borderRadius.topRight) style.borderTopRightRadius = borderRadius.topRight;
  if (borderRadius.bottomRight) style.borderBottomRightRadius = borderRadius.bottomRight;
  if (borderRadius.bottomLeft) style.borderBottomLeftRadius = borderRadius.bottomLeft;

  return style;
}

export function getBoxShadowStyle(block: Block): React.CSSProperties {
  const { boxShadow } = block.properties;
  if (!boxShadow) return {};

  if (typeof boxShadow === 'string') {
    return { boxShadow };
  }

  if (boxShadow.preset && boxShadow.preset !== 'none') {
    switch (boxShadow.preset) {
      case 'subtle':
        return { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' };
      case 'medium':
        return { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)' };
      case 'strong':
        return { boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' };
    }
  }

  if (boxShadow.custom) {
    return { boxShadow: boxShadow.custom };
  }

  return {};
}

export function getGradientStyle(block: Block): React.CSSProperties {
  const { gradient } = block.properties;
  if (!gradient || !gradient.enabled) return {};

  const { type = 'linear', angle = 180, color1 = '#ffffff', color2 = '#000000', color3, stops } = gradient;

  let gradientStr = '';
  if (type === 'linear') {
    if (stops && stops.length > 0) {
      const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
      gradientStr = `linear-gradient(${angle}deg, ${stopsStr})`;
    } else {
      gradientStr = `linear-gradient(${angle}deg, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;
    }
  } else {
    if (stops && stops.length > 0) {
      const stopsStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
      gradientStr = `radial-gradient(circle, ${stopsStr})`;
    } else {
      gradientStr = `radial-gradient(circle, ${color1}, ${color2}${color3 ? `, ${color3}` : ''})`;
    }
  }

  return { background: gradientStr };
}

export function getOpacityStyle(block: Block): React.CSSProperties {
  const { opacity } = block.properties;
  if (opacity === undefined) return {};
  return { opacity };
}

export function getTextShadowStyle(block: Block): React.CSSProperties {
  const { textShadow } = block.properties;
  if (!textShadow) return {};

  const { offsetX = '0px', offsetY = '2px', blur = '4px', color = 'rgba(0,0,0,0.5)' } = textShadow;
  return { textShadow: `${offsetX} ${offsetY} ${blur} ${color}` };
}

export function getFilterStyle(block: Block): React.CSSProperties {
  const { filters } = block.properties;
  if (!filters) return {};

  const filterParts = [];
  if (filters.blur !== undefined) filterParts.push(`blur(${filters.blur}px)`);
  if (filters.brightness !== undefined) filterParts.push(`brightness(${filters.brightness}%)`);
  if (filters.contrast !== undefined) filterParts.push(`contrast(${filters.contrast}%)`);
  if (filters.saturate !== undefined) filterParts.push(`saturate(${filters.saturate}%)`);
  if (filters.hueRotate !== undefined) filterParts.push(`hue-rotate(${filters.hueRotate}deg)`);
  if (filters.invert !== undefined) filterParts.push(`invert(${filters.invert}%)`);
  if (filters.sepia !== undefined) filterParts.push(`sepia(${filters.sepia}%)`);
  if (filters.grayscale !== undefined) filterParts.push(`grayscale(${filters.grayscale}%)`);

  if (filterParts.length === 0) return {};
  return { filter: filterParts.join(' ') };
}

export function getTransformStyle(block: Block): React.CSSProperties {
  const { transform } = block.properties;
  if (!transform) return {};

  const transformParts = [];
  if (transform.rotate !== undefined) transformParts.push(`rotate(${transform.rotate}deg)`);
  if (transform.scaleX !== undefined || transform.scaleY !== undefined) {
    transformParts.push(`scale(${transform.scaleX ?? 1}, ${transform.scaleY ?? 1})`);
  }
  if (transform.skewX !== undefined || transform.skewY !== undefined) {
    transformParts.push(`skew(${transform.skewX ?? 0}deg, ${transform.skewY ?? 0}deg)`);
  }
  if (transform.translateX !== undefined || transform.translateY !== undefined) {
    transformParts.push(`translate(${transform.translateX ?? '0px'}, ${transform.translateY ?? '0px'})`);
  }

  if (transformParts.length === 0) return {};
  return { transform: transformParts.join(' ') };
}

export function getTransitionStyle(block: Block): React.CSSProperties {
  const { transition } = block.properties;
  if (!transition || !transition.enabled) return {};

  const { duration = '300ms', easing = 'ease', properties = ['all'] } = transition;
  const transitionStr = properties.map(p => `${p} ${duration} ${easing}`).join(', ');

  return { transition: transitionStr };
}

export function getAllAdvancedStyles(block: Block): React.CSSProperties {
  return {
    ...getBorderStyle(block),
    ...getBorderRadiusStyle(block),
    ...getBoxShadowStyle(block),
    ...getGradientStyle(block),
    ...getOpacityStyle(block),
    ...getTextShadowStyle(block),
    ...getFilterStyle(block),
    ...getTransformStyle(block),
    ...getTransitionStyle(block),
  };
}

export function cssPropertiesToLines(properties: React.CSSProperties): string[] {
  return Object.entries(properties).map(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `  ${cssKey}: ${value};`;
  });
}
