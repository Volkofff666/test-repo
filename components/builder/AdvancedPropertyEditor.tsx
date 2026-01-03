'use client';

import React from 'react';
import { Block } from '@/lib/types';
import { BorderEditor } from './styling/BorderEditor';
import { BorderRadiusEditor } from './styling/BorderRadiusEditor';
import { ShadowEditor } from './styling/ShadowEditor';
import { GradientEditor } from './styling/GradientEditor';
import { FilterEditor } from './styling/FilterEditor';
import { TransformEditor } from './styling/TransformEditor';
import { TransitionEditor } from './styling/TransitionEditor';
import { TextShadowEditor } from './styling/TextShadowEditor';

interface AdvancedPropertyEditorProps {
  block: Block;
  updateBlock: (id: string, properties: Partial<Block['properties']>) => void;
}

export function AdvancedPropertyEditor({ block, updateBlock }: AdvancedPropertyEditorProps) {
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isTextType = block.type === 'text' || block.type === 'heading' || block.type === 'button';

  return (
    <div className="space-y-2 mt-4 pt-4 border-t">
      <h3 className="font-bold text-sm mb-2 px-1 uppercase tracking-wider text-gray-500">Advanced Styling</h3>
      
      <div className="space-y-1">
        <CollapsibleSection 
          title="Borders" 
          isOpen={openSection === 'borders'} 
          onClick={() => toggleSection('borders')}
        >
          <BorderEditor block={block} updateBlock={updateBlock} />
        </CollapsibleSection>

        <CollapsibleSection 
          title="Border Radius" 
          isOpen={openSection === 'radius'} 
          onClick={() => toggleSection('radius')}
        >
          <BorderRadiusEditor block={block} updateBlock={updateBlock} />
        </CollapsibleSection>

        <CollapsibleSection 
          title="Box Shadow" 
          isOpen={openSection === 'shadow'} 
          onClick={() => toggleSection('shadow')}
        >
          <ShadowEditor block={block} updateBlock={updateBlock} />
        </CollapsibleSection>

        <CollapsibleSection 
          title="Gradient Background" 
          isOpen={openSection === 'gradient'} 
          onClick={() => toggleSection('gradient')}
        >
          <GradientEditor block={block} updateBlock={updateBlock} />
        </CollapsibleSection>

        <CollapsibleSection 
          title="Opacity" 
          isOpen={openSection === 'opacity'} 
          onClick={() => toggleSection('opacity')}
        >
          <div className="p-4 border rounded-md bg-gray-50 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium uppercase text-gray-500">Opacity: {Math.round((block.properties.opacity ?? 1) * 100)}%</label>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={block.properties.opacity ?? 1}
              onChange={(e) => updateBlock(block.id, { opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        </CollapsibleSection>

        {isTextType && (
          <CollapsibleSection 
            title="Text Shadow" 
            isOpen={openSection === 'textShadow'} 
            onClick={() => toggleSection('textShadow')}
          >
            <TextShadowEditor block={block} updateBlock={updateBlock} />
          </CollapsibleSection>
        )}

        <CollapsibleSection 
          title="Filters" 
          isOpen={openSection === 'filters'} 
          onClick={() => toggleSection('filters')}
        >
          <FilterEditor block={block} updateBlock={updateBlock} />
        </CollapsibleSection>

        <CollapsibleSection 
          title="Transform" 
          isOpen={openSection === 'transform'} 
          onClick={() => toggleSection('transform')}
        >
          <TransformEditor block={block} updateBlock={updateBlock} />
        </CollapsibleSection>

        <CollapsibleSection 
          title="Transition" 
          isOpen={openSection === 'transition'} 
          onClick={() => toggleSection('transition')}
        >
          <TransitionEditor block={block} updateBlock={updateBlock} />
        </CollapsibleSection>
      </div>
    </div>
  );
}

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function CollapsibleSection({ title, isOpen, onClick, children }: CollapsibleSectionProps) {
  return (
    <div className="border border-gray-200 rounded overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-3 py-2 text-left text-xs font-medium bg-white hover:bg-gray-50 flex justify-between items-center"
      >
        {title}
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>
      {isOpen && (
        <div className="p-2 bg-white border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
}
