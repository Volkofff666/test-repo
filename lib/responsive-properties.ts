import type { ResponsiveProperty } from './types';

export type { ResponsiveProperty } from './types';

export function isResponsiveProperty(value: unknown): value is ResponsiveProperty {
  if (value === null || value === undefined) return false;
  if (typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    'mobile' in obj ||
    'tablet' in obj ||
    'desktop' in obj ||
    'default' in obj
  );
}

export function getResponsiveValue(
  prop: ResponsiveProperty | string | undefined,
  device: 'mobile' | 'tablet' | 'desktop'
): string {
  if (prop === undefined || prop === null) return '';
  
  if (typeof prop === 'string') {
    return prop;
  }
  
  if (device === 'desktop' && prop.desktop !== undefined) {
    return prop.desktop;
  }
  if (device === 'tablet' && prop.tablet !== undefined) {
    return prop.tablet;
  }
  if (device === 'mobile' && prop.mobile !== undefined) {
    return prop.mobile;
  }
  
  if (prop.default !== undefined) {
    return prop.default;
  }
  
  return '';
}

export function setResponsiveValue(
  prop: ResponsiveProperty | undefined,
  device: 'mobile' | 'tablet' | 'desktop',
  value: string
): ResponsiveProperty {
  const newProp: ResponsiveProperty = {
    mobile: prop?.mobile ?? '',
    tablet: prop?.tablet ?? '',
    desktop: prop?.desktop ?? '',
    default: prop?.default ?? '',
  };
  
  newProp[device] = value;
  
  return newProp;
}

export function getResponsiveProperties(): Array<{
  key: 'padding' | 'fontSize' | 'marginBottom' | 'gap';
  label: string;
}> {
  return [
    { key: 'padding', label: 'Padding' },
    { key: 'fontSize', label: 'Font Size' },
    { key: 'marginBottom', label: 'Margin Bottom' },
    { key: 'gap', label: 'Gap' },
  ];
}

export function createResponsiveProperty(value: string): ResponsiveProperty {
  return {
    default: value,
    mobile: '',
    tablet: '',
    desktop: '',
  };
}

export function hasDeviceOverrides(prop: ResponsiveProperty | undefined): {
  hasAny: boolean;
  devices: Set<string>;
} {
  if (!prop) return { hasAny: false, devices: new Set() };
  
  const devices = new Set<string>();
  if (prop.mobile) devices.add('mobile');
  if (prop.tablet) devices.add('tablet');
  if (prop.desktop) devices.add('desktop');
  
  return {
    hasAny: devices.size > 0,
    devices,
  };
}

export function copyToAllDevices(
  prop: ResponsiveProperty | undefined,
  fromDevice: 'mobile' | 'tablet' | 'desktop'
): ResponsiveProperty {
  const sourceValue = prop?.[fromDevice] || prop?.default || '';
  
  return {
    mobile: sourceValue,
    tablet: sourceValue,
    desktop: sourceValue,
    default: '',
  };
}
