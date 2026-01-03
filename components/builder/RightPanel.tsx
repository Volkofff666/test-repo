'use client';

import { PropertyEditor } from './PropertyEditor';
import { CodeViewer } from './CodeViewer';

export function RightPanel() {
  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
      <div className="border-b border-gray-200 overflow-y-auto" style={{ maxHeight: '40%' }}>
        <PropertyEditor />
      </div>
      <div className="flex-1 overflow-hidden">
        <CodeViewer />
      </div>
    </div>
  );
}
