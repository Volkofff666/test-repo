import { Block } from './types';

export interface ProjectState {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  blocks: Block[];
  metadata?: {
    description?: string;
    version?: string;
    blockCount?: number;
    exportedAt?: string;
  };
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function isValidBlock(block: unknown): block is Block {
  if (!block || typeof block !== 'object') return false;
  const b = block as Block;
  if (typeof b.id !== 'string') return false;
  if (typeof b.type !== 'string') return false;
  if (typeof b.bemName !== 'string') return false;
  if (!b.properties || typeof b.properties !== 'object') return false;

  const children = (b.properties as { children?: unknown }).children;
  if (children === undefined) return true;
  if (!Array.isArray(children)) return false;
  return children.every(isValidBlock);
}

export function saveProjectToJSON(
  blocks: Block[],
  projectName: string,
  options?: { projectId?: string; createdAt?: string; metadata?: ProjectState['metadata'] }
): ProjectState {
  const now = new Date().toISOString();

  return {
    id: options?.projectId ?? generateId(),
    name: projectName || 'Untitled Project',
    createdAt: options?.createdAt ?? now,
    updatedAt: now,
    blocks,
    metadata: {
      version: '1',
      blockCount: countBlocks(blocks),
      ...options?.metadata,
    },
  };
}

export function downloadJSON(project: ProjectState) {
  const element = document.createElement('a');
  element.href = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(project, null, 2)
  )}`;
  element.download = `${sanitizeFilename(project.name)}.json`;
  element.click();
}

export function loadProjectFromJSON(jsonString: string): ProjectState | null {
  try {
    const project = JSON.parse(jsonString) as ProjectState;

    if (!project || typeof project !== 'object') return null;
    if (!Array.isArray(project.blocks)) return null;
    if (!project.blocks.every(isValidBlock)) return null;

    const now = new Date().toISOString();
    return {
      id: project.id || generateId(),
      name: project.name || 'Imported Project',
      createdAt: project.createdAt || now,
      updatedAt: project.updatedAt || now,
      blocks: project.blocks,
      metadata: project.metadata ?? {},
    };
  } catch {
    return null;
  }
}

function keyForProjectId(projectId: string) {
  return `project_${projectId}`;
}

export function saveToLocalStorage(project: ProjectState) {
  localStorage.setItem(keyForProjectId(project.id), JSON.stringify(project));
}

export function loadFromLocalStorage(projectId: string): ProjectState | null {
  const data = localStorage.getItem(keyForProjectId(projectId));
  if (!data) return null;
  return loadProjectFromJSON(data);
}

export function deleteFromLocalStorage(projectId: string) {
  localStorage.removeItem(keyForProjectId(projectId));
}

export function getAllProjects(): ProjectState[] {
  const projects: ProjectState[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('project_')) {
      const data = localStorage.getItem(key);
      if (data) {
        const project = loadProjectFromJSON(data);
        if (project) projects.push(project);
      }
    }
  }

  projects.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return projects;
}

export function countBlocks(blocks: Block[]): number {
  return blocks.reduce((acc, block) => {
    const children = block.properties.children ?? [];
    return acc + 1 + countBlocks(children);
  }, 0);
}

function sanitizeFilename(name: string) {
  return name
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 80) || 'project';
}
