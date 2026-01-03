'use client';

import { useMemo, useState } from 'react';
import { loadProjectFromJSON, ProjectState, countBlocks } from '@/lib/project-storage';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (project: ProjectState) => void;
}

export function ImportModal({ open, onClose, onImport }: ImportModalProps) {
  const [project, setProject] = useState<ProjectState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const blockCount = useMemo(() => (project ? countBlocks(project.blocks) : 0), [project]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Import project</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select a JSON file</label>
            <input
              type="file"
              accept="application/json,.json"
              onChange={e => {
                const file = e.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                  const text = String(reader.result ?? '');
                  const parsed = loadProjectFromJSON(text);
                  if (!parsed) {
                    setProject(null);
                    setError('Invalid JSON file.');
                    return;
                  }

                  setError(null);
                  setProject(parsed);
                };
                reader.onerror = () => {
                  setProject(null);
                  setError('Failed to read file.');
                };
                reader.readAsText(file);
              }}
              className="block w-full text-sm"
            />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          {project && (
            <div className="rounded border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="font-medium text-gray-800">{project.name}</div>
              <div className="text-gray-500">{blockCount} block{blockCount === 1 ? '' : 's'}</div>
              <div className="text-gray-400 text-xs mt-1">This will replace your current canvas.</div>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-end gap-2 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!project}
            onClick={() => {
              if (!project) return;
              onImport(project);
              onClose();
            }}
            className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            Import & Replace
          </button>
        </div>
      </div>
    </div>
  );
}
