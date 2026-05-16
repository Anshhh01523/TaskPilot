import { create } from 'zustand';
import api from '../lib/axios';

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (projectId = null) => {
    set({ loading: true, error: null });
    try {
      const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
      const res = await api.get(url);
      set({ tasks: res.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch tasks', loading: false });
    }
  },

  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/tasks', data);
      set((state) => ({ tasks: [...state.tasks, res.data], loading: false }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create task', loading: false });
      return false;
    }
  },

  updateTaskStatus: async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? res.data : t)),
      }));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  addComment: async (taskId, text) => {
    try {
      const res = await api.post(`/tasks/${taskId}/comments`, { text });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? res.data : t)),
      }));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
}));
