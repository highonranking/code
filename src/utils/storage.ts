// Local storage utilities for managing code files

export interface CodeFile {
  id: string;
  name: string;
  code: string;
  language: 'javascript' | 'html' | 'css';
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  files: CodeFile[];
  sharedUrl?: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'js-compiler-projects';
const CURRENT_PROJECT_KEY = 'js-compiler-current-project';

export const storage = {
  // Projects management
  getAllProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get projects:', error);
      return [];
    }
  },

  saveProject: (project: Project): void => {
    try {
      const projects = storage.getAllProjects();
      const existingIndex = projects.findIndex((p) => p.id === project.id);

      if (existingIndex >= 0) {
        projects[existingIndex] = { ...project, updatedAt: Date.now() };
      } else {
        projects.push({ ...project, createdAt: Date.now(), updatedAt: Date.now() });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  },

  deleteProject: (projectId: string): void => {
    try {
      const projects = storage.getAllProjects();
      const filtered = projects.filter((p) => p.id !== projectId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      const currentProject = storage.getCurrentProject();
      if (currentProject?.id === projectId) {
        storage.setCurrentProject(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  },

  getProjectById: (projectId: string): Project | null => {
    try {
      const projects = storage.getAllProjects();
      return projects.find((p) => p.id === projectId) || null;
    } catch (error) {
      console.error('Failed to get project:', error);
      return null;
    }
  },

  // Current project management
  getCurrentProject: (): Project | null => {
    try {
      const data = localStorage.getItem(CURRENT_PROJECT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get current project:', error);
      return null;
    }
  },

  setCurrentProject: (project: Project | null): void => {
    try {
      if (project) {
        localStorage.setItem(CURRENT_PROJECT_KEY, JSON.stringify(project));
      } else {
        localStorage.removeItem(CURRENT_PROJECT_KEY);
      }
    } catch (error) {
      console.error('Failed to set current project:', error);
    }
  },

  // File operations
  addFile: (projectId: string, file: Omit<CodeFile, 'id' | 'createdAt' | 'updatedAt'>): CodeFile => {
    const project = storage.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const newFile: CodeFile = {
      ...file,
      id: `file-${Date.now()}-${Math.random()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    project.files.push(newFile);
    storage.saveProject(project);

    return newFile;
  },

  updateFile: (projectId: string, fileId: string, updates: Partial<Omit<CodeFile, 'id' | 'createdAt'>>): void => {
    const project = storage.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    const fileIndex = project.files.findIndex((f) => f.id === fileId);
    if (fileIndex < 0) throw new Error('File not found');

    project.files[fileIndex] = {
      ...project.files[fileIndex],
      ...updates,
      updatedAt: Date.now(),
    };

    storage.saveProject(project);
  },

  deleteFile: (projectId: string, fileId: string): void => {
    const project = storage.getProjectById(projectId);
    if (!project) throw new Error('Project not found');

    project.files = project.files.filter((f) => f.id !== fileId);
    storage.saveProject(project);
  },

  getFile: (projectId: string, fileId: string): CodeFile | null => {
    const project = storage.getProjectById(projectId);
    if (!project) return null;

    return project.files.find((f) => f.id === fileId) || null;
  },
};
