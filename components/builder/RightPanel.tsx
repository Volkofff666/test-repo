'use client';

import { useState } from 'react';
import { useBlocks } from '@/lib/block-context';
import { PropertyEditor } from './PropertyEditor';
import { CodeViewer } from './CodeViewer';
import { LayersPanel } from './LayersPanel';
import { ResponsivePropertyEditor } from './ResponsivePropertyEditor';

export function RightPanel() {
  const [topTab, setTopTab] = useState<'layers' | 'properties'>('properties');
  const [bottomTab, setBottomTab] = useState<'code' | 'responsive'>('code');
  const { getSelectedBlock } = useBlocks();
  const selectedBlock = getSelectedBlock();

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
        {topTab === 'layers' ? (
          <LayersPanel />
        ) : (
          <div className="overflow-auto h-full">
            {selectedBlock ? (
              <>
                <PropertyEditor />
                <div className="border-t border-gray-200 mt-4 p-4">
                  <button
                    type="button"
                    onClick={() => setBottomTab(bottomTab === 'code' ? 'responsive' : 'code')}
                    className="w-full px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {bottomTab === 'code' ? (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="5" y="2" width="14" height="20" rx="2" />
                          <line x1="12" y1="18" x2="12" y2="18" />
                        </svg>
                        Switch to Responsive Editor
                      </>
                    ) : (
                      <>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="16 18 22 12 16 6" />
                          <polyline points="8 6 2 12 8 18" />
                        </svg>
                        Switch to Code Viewer
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4">
                <p className="text-gray-400 text-sm text-center">
                  Select a block to edit its properties
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="border-b border-gray-200 bg-white">
          <div className="flex">
            <button
              type="button"
              onClick={() => {
                setBottomTab('code');
                setTopTab('properties');
              }}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                bottomTab === 'code' && topTab === 'properties'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Code
            </button>
            {selectedBlock && (
              <button
                type="button"
                onClick={() => {
                  setBottomTab('responsive');
                  setTopTab('properties');
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                  bottomTab === 'responsive'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Responsive
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {bottomTab === 'code' ? (
            <CodeViewer />
          ) : (
            selectedBlock && <ResponsivePropertyEditor block={selectedBlock} />
          )}
        </div>
      </div>
    </div>
  );
}
