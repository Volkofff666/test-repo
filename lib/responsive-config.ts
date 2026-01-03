export const deviceSizes = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: '📱',
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: '📑',
  },
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    icon: '🖥️',
  },
};

export const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1920,
};

export type DeviceType = keyof typeof deviceSizes;

export const zoomLevels = [
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 100, label: '100%' },
  { value: 125, label: '125%' },
  { value: 150, label: '150%' },
];

export function getCurrentDeviceSize(device: DeviceType) {
  return deviceSizes[device];
}
