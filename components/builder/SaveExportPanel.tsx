'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useBlocks } from '@/lib/block-context';
import {
  countBlocks,
  deleteFromLocalStorage,
  downloadJSON,
  getAllProjects,
  loadFromLocalStorage,
  ProjectState,
  saveProjectToJSON,
  saveToLocalStorage,
} from '@/lib/project-storage';
import { ImportModal } from './ImportModal';

export function SaveExportPanel() {
  const {
    blocks,
    projectId,
    projectName,
    projectCreatedAt,
    setProjectName,
    loadProject,
    undo,
    canUndo,
  } = useBlocks();

  const [toast, setToast] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [recent, setRecent] = useState<ProjectState[]>(() => {
    try {
      return getAllProjects();
    } catch {
      return [];
    }
  });
  const [selectedRecentId, setSelectedRecentId] = useState<string>(() => {
    try {
      return getAllProjects()[0]?.id || '';
    } catch {
      return '';
    }
  });
  const [hasPersisted, setHasPersisted] = useState(false);

  const totalBlocks = useMemo(() => countBlocks(blocks), [blocks]);

  const refreshRecent = useCallback(() => {
    try {
      const projects = getAllProjects();
      setRecent(projects);
      setSelectedRecentId(prev => {
        if (prev && projects.some(p => p.id === prev)) return prev;
        return projects[0]?.id || '';
      });
    } catch {
      setRecent([]);
    }
  }, []);


  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const buildCurrentProject = useCallback(
    (metadata?: ProjectState['metadata']) =>
      saveProjectToJSON(blocks, projectName, {
        projectId,
        createdAt: projectCreatedAt,
        metadata,
      }),
    [blocks, projectCreatedAt, projectId, projectName]
  );

  const save = useCallback(() => {
    try {
      const project = buildCurrentProject();
      saveToLocalStorage(project);
      setHasPersisted(true);
      setToast('Saved');
      refreshRecent();
    } catch (e) {
      console.error(e);
      setToast('Save failed (LocalStorage quota?)');
    }
  }, [buildCurrentProject, refreshRecent]);

  const exportJSON = useCallback(() => {
    const project = buildCurrentProject({ exportedAt: new Date().toISOString() });
    downloadJSON(project);
    setToast('Downloaded JSON');
  }, [buildCurrentProject]);

  const loadRecent = useCallback(
    (id: string) => {
      if (!id) return;
      const project = loadFromLocalStorage(id);
      if (!project) {
        setToast('Failed to load project');
        return;
      }

      if (blocks.length > 0) {
        const ok = window.confirm('Replace current canvas with the selected project?');
        if (!ok) return;
      }

      loadProject(project);
      setHasPersisted(true);
      setToast('Project loaded');
    },
    [blocks.length, loadProject]
  );

  useEffect(() => {
    if (!hasPersisted) return;

    const t = setTimeout(() => {
      try {
        saveToLocalStorage(buildCurrentProject());
      } catch (e) {
        console.error('Auto-save failed', e);
      }
    }, 800);

    return () => clearTimeout(t);
  }, [hasPersisted, buildCurrentProject]);

  useEffect(() => {
    if (!hasPersisted) return;

    const interval = setInterval(() => {
      if (blocks.length === 0) return;
      try {
        saveToLocalStorage(buildCurrentProject());
      } catch (e) {
        console.error('Auto-save failed', e);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [hasPersisted, blocks.length, buildCurrentProject]);

  return (
    <div className="w-full border-b border-gray-200 bg-white">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <div className="text-xs text-gray-500">Project name</div>
            <input
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded text-sm min-w-[240px] max-w-[420px]"
              placeholder="Untitled Project"
            />
          </div>
          <div className="text-xs text-gray-500 whitespace-nowrap">{totalBlocks} blocks</div>
          {toast && <div className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">{toast}</div>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            Undo
          </button>

          <button
            type="button"
            onClick={save}
            className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>

          <button
            type="button"
            onClick={exportJSON}
            className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
          >
            Export JSON
          </button>

          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
          >
            Import
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <select
              value={selectedRecentId}
              onChange={e => setSelectedRecentId(e.target.value)}
              className="px-2 py-2 text-sm border border-gray-300 rounded max-w-[260px]"
              aria-label="Recent projects"
            >
              {recent.length === 0 ? (
                <option value="">No saved projects</option>
              ) : (
                recent.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>

            <button
              type="button"
              onClick={() => loadRecent(selectedRecentId)}
              disabled={!selectedRecentId}
              className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Load
            </button>

            <button
              type="button"
              onClick={() => {
                if (!selectedRecentId) return;
                const ok = window.confirm('Delete selected project from LocalStorage?');
                if (!ok) return;
                deleteFromLocalStorage(selectedRecentId);
                setToast('Deleted');
                refreshRecent();
              }}
              disabled={!selectedRecentId}
              className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {importOpen && (
        <ImportModal
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onImport={project => {
            if (blocks.length > 0) {
              const ok = window.confirm('Replace current canvas with imported project?');
              if (!ok) return;
            }
            loadProject(project);
            setHasPersisted(true);
            setToast('Imported');
            refreshRecent();
          }}
        />
      )}
    </div>
  );
}
