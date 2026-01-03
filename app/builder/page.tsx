'use client';

import { BlockProvider } from '@/lib/block-context';
import { Palette } from '@/components/builder/Palette';
import { Canvas } from '@/components/builder/Canvas';
import { RightPanel } from '@/components/builder/RightPanel';

export default function BuilderPage() {
  return (
    <BlockProvider>
      <div className="flex h-screen overflow-hidden">
        <Palette />
        <Canvas />
        <RightPanel />
      </div>
    </BlockProvider>
  );
}
