'use client';

import { useState, useMemo } from 'react';
import { useBlocks } from '@/lib/block-context';
import { generateCode } from '@/lib/bem-generator';

export function CodeViewer() {
  const { blocks } = useBlocks();
  const [activeTab, setActiveTab] = useState<'html' | 'css'>('html');
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(13);

  const { html, css } = useMemo(() => generateCode(blocks), [blocks]);
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

  const handleFontSizeChange = (delta: number) => {
    setFontSize(prev => Math.max(10, Math.min(20, prev + delta)));
  };

  const highlightHTML = (codeStr: string) => {
    if (!codeStr) return '';
    return codeStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(".*?")/g, '<span class="token-attr">$1</span>')
      .replace(/(=)/g, '<span class="token-eq">$1</span>')
      .replace(/\n/g, '<br />');
  };

  const highlightCSS = (codeStr: string) => {
    if (!codeStr) return '';
    return codeStr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/(\.[\w-]+)/g, '<span class="token-selector">$1</span>')
      .replace(/([\w-]+)(?=\s*\{)/g, '<span class="token-property">$1</span>')
      .replace(/:\s*([^;]+)/g, ': <span class="token-value">$1</span>')
      .replace(/;/g, '<span class="token-delim">;</span>')
      .replace(/\n/g, '<br />');
  };

  const highlightedCode = useMemo(() => {
    if (activeTab === 'html') {
      return highlightHTML(code);
    }
    return highlightCSS(code);
  }, [code, activeTab]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-gray-700 px-4 py-2 bg-[#252526]">
        <h3 className="text-sm font-medium text-gray-200">Generated Code</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFontSizeChange(-1)}
            className="p-1 text-gray-400 hover:text-gray-200 rounded hover:bg-gray-700"
            title="Decrease font size"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="12" r="3" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
          <span className="text-xs text-gray-400 font-mono">{fontSize}px</span>
          <button
            onClick={() => handleFontSizeChange(1)}
            className="p-1 text-gray-400 hover:text-gray-200 rounded hover:bg-gray-700"
            title="Increase font size"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="12" r="3" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="12" y1="6" x2="12" y2="18" />
            </svg>
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 transition-colors ml-2"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-700 bg-[#2d2d2d]">
        <button
          onClick={() => setActiveTab('html')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'html'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-[#1e1e1e]'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3a]'
          }`}
        >
          HTML
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'css'
              ? 'text-blue-400 border-b-2 border-blue-400 bg-[#1e1e1e]'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#3a3a3a]'
          }`}
        >
          CSS
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4">
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">
              No code generated yet. Add blocks to see the code.
            </p>
          </div>
        ) : (
          <pre
            className="text-sm font-mono leading-relaxed"
            style={{
              fontSize: `${fontSize}px`,
              color: '#e0e0e0',
              lineHeight: '1.6',
            }}
          >
            <code
              className="code-highlighted"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        )}
      </div>

      <style jsx>{`
        :global(.token-attr) {
          color: #9cdcfe;
        }
        :global(.token-eq) {
          color: #d4d4d4;
        }
        :global(.token-selector) {
          color: #d7ba7d;
        }
        :global(.token-property) {
          color: #9cdcfe;
        }
        :global(.token-value) {
          color: #ce9178;
        }
        :global(.token-delim) {
          color: #d4d4d4;
        }
      `}</style>
    </div>
  );
}
