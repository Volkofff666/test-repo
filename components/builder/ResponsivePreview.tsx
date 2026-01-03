'use client';

import { useState, useMemo } from 'react';
import { useBlocks } from '@/lib/block-context';
import { BlockRenderer } from '../blocks/BlockRenderer';
import { DropZone } from './DropZone';
import { Fragment } from 'react';
import {
  DeviceType,
  deviceSizes,
  zoomLevels,
  getCurrentDeviceSize,
} from '@/lib/responsive-config';

export function ResponsivePreview() {
  const { blocks, selectBlock } = useBlocks();
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [zoom, setZoom] = useState(100);
  
  const deviceSize = useMemo(() => getCurrentDeviceSize(device), [device]);
  
  const previewStyle = useMemo(() => ({
    width: deviceSize.width,
    height: deviceSize.height,
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top center' as const,
  }), [deviceSize, zoom]);

  const containerStyle = useMemo(() => {
    const scaledWidth = deviceSize.width * (zoom / 100);
    return {
      width: scaledWidth,
      minHeight: deviceSize.height * (zoom / 100),
    };
  }, [deviceSize, zoom]);

  return (
    <div className="flex-1 bg-gray-100 overflow-hidden flex flex-col">
      <ResponsiveToolbar
        device={device}
        onDeviceChange={setDevice}
        zoom={zoom}
        onZoomChange={setZoom}
        deviceSize={deviceSize}
      />
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        <div
          className="bg-white shadow-2xl transition-all duration-300 ease-in-out"
          style={containerStyle}
        >
          <div
            className="bg-white origin-top transition-transform duration-300"
            style={previewStyle}
          >
            <div className="h-full bg-white" onClick={() => selectBlock(null)}>
              <div className="max-w-4xl mx-auto p-8">
                {blocks.length === 0 ? (
                  <div className="flex items-center justify-center h-[600px] border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <p className="text-gray-400 text-lg mb-2">No blocks yet</p>
                      <p className="text-gray-400 text-sm">
                        Add blocks from the palette on the left to get started
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <DropZone parentId={null} index={0} />
                    {blocks.map((block, idx) => (
                      <Fragment key={block.id}>
                        <BlockRenderer block={block} />
                        <DropZone parentId={null} index={idx + 1} />
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResponsiveToolbarProps {
  device: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  deviceSize: { name: string; width: number; height: number; icon: string };
}

function ResponsiveToolbar({
  device,
  onDeviceChange,
  zoom,
  onZoomChange,
  deviceSize,
}: ResponsiveToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {(Object.keys(deviceSizes) as DeviceType[]).map((d) => (
              <button
                key={d}
                onClick={() => onDeviceChange(d)}
                className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                  device === d
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {deviceSizes[d].icon} {deviceSizes[d].name}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{deviceSize.name}</span>
            <span className="mx-2">|</span>
            <span className="font-mono">{deviceSize.width} × {deviceSize.height}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Zoom:</span>
          <select
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {zoomLevels.map((z) => (
              <option key={z.value} value={z.value}>
                {z.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
