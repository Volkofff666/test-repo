export const borderPresets = {
  none: { width: '0', style: 'none' as const },
  thin: { width: '1px', style: 'solid' as const, color: '#000000' },
  medium: { width: '2px', style: 'solid' as const, color: '#000000' },
  thick: { width: '4px', style: 'solid' as const, color: '#000000' },
  dashed: { width: '2px', style: 'dashed' as const, color: '#666666' },
};

export const shadowPresets = {
  none: 'none',
  subtle: '0 1px 3px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 6px rgba(0, 0, 0, 0.15)',
  strong: '0 10px 25px rgba(0, 0, 0, 0.2)',
  neon: '0 0 10px rgba(0, 255, 255, 0.5)',
};

export const borderRadiusPresets = {
  none: '0',
  slight: '4px',
  rounded: '8px',
  smooth: '16px',
  circle: '50%',
  pill: '999px',
};

export const filterPresets = {
  normal: { blur: 0, brightness: 100, contrast: 100, saturate: 100, hueRotate: 0, invert: 0, sepia: 0, grayscale: 0 },
  bw: { grayscale: 100 },
  vintage: { sepia: 50, saturate: 50 },
  bright: { brightness: 120, contrast: 110 },
  dark: { brightness: 80, contrast: 120 },
  vivid: { saturate: 150, contrast: 120 },
};

export const gradientPresets = [
  { name: 'Sunset', colors: ['#ff6b6b', '#ffd93d'] },
  { name: 'Ocean', colors: ['#667eea', '#764ba2'] },
  { name: 'Forest', colors: ['#134e5e', '#71b280'] },
  { name: 'Sakura', colors: ['#ff758c', '#ff7eb3'] },
  { name: 'Night', colors: ['#2c3e50', '#3498db'] },
];
