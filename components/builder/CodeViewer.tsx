'use client';

import { useState } from 'react';
import { useBlocks } from '@/lib/block-context';
import { generateCode } from '@/lib/bem-generator';

export function CodeViewer() {
  const { blocks } = useBlocks();
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [copied, setCopied] = useState(false);

  const { html, css } = generateCode(blocks);
  const code = activeTab === 'html' ? html : css;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h3 className="text-lg font-semibold text-gray-800">Generated Code</h3>
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('html')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'html'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          HTML
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'css'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          CSS
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-gray-900 p-4">
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">
              No code generated yet. Add blocks to see the code.
            </p>
          </div>
        ) : (
          <pre className="text-sm">
            <code className="text-gray-100 font-mono">{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
