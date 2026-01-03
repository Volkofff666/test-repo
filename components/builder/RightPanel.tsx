'use client';

import { useState } from 'react';
import { PropertyEditor } from './PropertyEditor';
import { CodeViewer } from './CodeViewer';
import { LayersPanel } from './LayersPanel';

export function RightPanel() {
  const [topTab, setTopTab] = useState<'layers' | 'properties'>('layers');

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          <button
            type="button"
            onClick={() => setTopTab('layers')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              topTab === 'layers'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Layers
          </button>
          <button
            type="button"
            onClick={() => setTopTab('properties')}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              topTab === 'properties'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Properties
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 overflow-hidden" style={{ maxHeight: '50%' }}>
        {topTab === 'layers' ? <LayersPanel /> : <div className="overflow-auto h-full"><PropertyEditor /></div>}
      </div>

      <div className="flex-1 overflow-hidden">
        <CodeViewer />
      </div>
    </div>
  );
}
