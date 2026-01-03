'use client';

import { useState, useMemo } from 'react';
import { useBlocks } from '@/lib/block-context';
import { Block, ResponsiveProperty } from '@/lib/types';
import {
  DeviceType,
  deviceSizes,
  breakpoints,
  zoomLevels,
  getCurrentDeviceSize,
} from '@/lib/responsive-config';
import {
  getResponsiveValue,
  setResponsiveValue,
  hasDeviceOverrides,
  isResponsiveProperty,
  createResponsiveProperty,
  copyToAllDevices,
} from '@/lib/responsive-properties';

interface ResponsivePropertyEditorProps {
  block: Block;
}

const responsivePropKeys = [
  { key: 'padding' as const, label: 'Padding' },
  { key: 'fontSize' as const, label: 'Font Size' },
  { key: 'marginBottom' as const, label: 'Margin Bottom' },
  { key: 'gap' as const, label: 'Gap' },
];

export function ResponsivePropertyEditor({ block }: ResponsivePropertyEditorProps) {
  const { updateBlock } = useBlocks();
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');
  const [zoom, setZoom] = useState(100);
  const [showPreview, setShowPreview] = useState(true);

  const deviceSize = useMemo(() => getCurrentDeviceSize(activeDevice), [activeDevice]);

  const handlePropertyChange = (property: string, value: string) => {
    const currentProp = block.properties[property as keyof Block['properties']];
    let newProp: ResponsiveProperty | string;

    if (isResponsiveProperty(currentProp)) {
      newProp = setResponsiveValue(currentProp, activeDevice, value);
    } else if (typeof currentProp === 'string') {
      newProp = createResponsiveProperty(currentProp);
      newProp = setResponsiveValue(newProp, activeDevice, value);
    } else {
      newProp = value;
    }

    updateBlock(block.id, { [property]: newProp });
  };

  const handleCopyToAll = (property: string) => {
    const currentProp = block.properties[property as keyof Block['properties']];
    if (isResponsiveProperty(currentProp)) {
      const newProp = copyToAllDevices(currentProp, activeDevice);
      updateBlock(block.id, { [property]: newProp });
    }
  };

  const getValueForDevice = (property: string): string => {
    const prop = block.properties[property as keyof Block['properties']];
    if (typeof prop === 'string' || isResponsiveProperty(prop) || prop === undefined) {
      return getResponsiveValue(prop, activeDevice);
    }
    return '';
  };

  const getDefaultValue = (property: string): string => {
    const prop = block.properties[property as keyof Block['properties']];
    if (typeof prop === 'string') {
      return prop;
    }
    if (isResponsiveProperty(prop) && prop) {
      const responsiveProp = prop as ResponsiveProperty;
      return responsiveProp.default || '';
    }
    return '';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(Object.keys(deviceSizes) as DeviceType[]).map((d) => {
              const propOverrides = responsivePropKeys.some((p) => {
                const prop = block.properties[p.key];
                return isResponsiveProperty(prop) && hasDeviceOverrides(prop).devices.has(d);
              });

              return (
                <button
                  key={d}
                  onClick={() => setActiveDevice(d)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center gap-1 ${
                    activeDevice === d
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{deviceSizes[d].icon}</span>
                  <span>{deviceSizes[d].name}</span>
                  {propOverrides && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`p-1.5 rounded transition-colors ${
                showPreview
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Toggle preview"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <select
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {zoomLevels.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-4 pb-2">
          <div className="text-xs text-gray-500">
            {deviceSize.name}: {deviceSize.width} × {deviceSize.height}px
            {activeDevice !== 'desktop' && (
              <span className="ml-2">
                (@media max-width: {breakpoints[activeDevice]}px)
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {showPreview && (
          <div
            className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-200 transition-all duration-300"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top left',
              width: deviceSize.width * (zoom / 100),
            }}
          >
            <div className="bg-white rounded p-4 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Preview</p>
              <div className="space-y-2">
                {responsivePropKeys.slice(0, 2).map((p) => {
                  const value = getValueForDevice(p.key);
                  return (
                    <div key={p.key} className="text-xs">
                      <span className="text-gray-500">{p.label}:</span>{' '}
                      <span className="font-mono text-blue-600">
                        {value || '(default)'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {responsivePropKeys.map((prop) => {
            const currentProp = block.properties[prop.key];
            const currentValue = getValueForDevice(prop.key);
            const hasOverrides = isResponsiveProperty(currentProp)
              ? hasDeviceOverrides(currentProp).hasAny
              : false;
            const defaultValue = getDefaultValue(prop.key);

            return (
              <div key={prop.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    {prop.label}
                    {hasOverrides && (
                      <span className="ml-2 text-xs text-blue-600 font-normal">
                        (customized)
                      </span>
                    )}
                  </label>
                  {hasOverrides && (
                    <button
                      onClick={() => handleCopyToAll(prop.key)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Copy to all
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={currentValue}
                  onChange={(e) =>
                    handlePropertyChange(prop.key, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={defaultValue || '(default)'}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
