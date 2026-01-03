'use client';

import { BlockProvider } from '@/lib/block-context';
import { Palette } from '@/components/builder/Palette';
import { ResponsivePreview } from '@/components/builder/ResponsivePreview';
import { RightPanel } from '@/components/builder/RightPanel';
import { SaveExportPanel } from '@/components/builder/SaveExportPanel';

export default function BuilderPage() {
  return (
    <BlockProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <SaveExportPanel />
        <div className="flex flex-1 overflow-hidden">
          <Palette />
          <ResponsivePreview />
          <RightPanel />
        </div>
      </div>
    </BlockProvider>
  );
}
