import { create } from 'zustand';
import api from '../lib/axios';

export const useProjectStore = create((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/projects');
      set({ projects: res.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch projects', loading: false });
    }
  },

  createProject: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/projects', data);
      set((state) => ({ projects: [...state.projects, res.data], loading: false }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create project', loading: false });
      return false;
    }
  },

  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      set((state) => ({ projects: state.projects.filter(p => p._id !== id) }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete project' });
      return false;
    }
  },
}));
