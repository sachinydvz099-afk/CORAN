import { create } from 'zustand';

interface Project {
  project_id: string;
  title: string;
  status: string;
  style: string;
  target_length_minutes: number;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string;
  character_count?: number;
  scene_count?: number;
}

interface ProjectState {
  projects: Project[];
  currentProject: any | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: any) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.project_id === id ? { ...p, ...updates } : p
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.project_id !== id),
    })),
}));
