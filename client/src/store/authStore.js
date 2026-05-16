import { create } from 'zustand';
import api from '../lib/axios';

const safeJSONParse = (item) => {
  try {
    return JSON.parse(item);
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: safeJSONParse(localStorage.getItem('user')),
  token: localStorage.getItem('token') || null,
  users: [],
  loading: false,
  error: null,

  fetchAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/auth/users');
      set({ users: res.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch users', loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      set({ user: res.data, token: res.data.token, loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },

  signup: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/signup', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      set({ user: res.data, token: res.data.token, loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Signup failed', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },

  updateUser: (userData) => {
    const currentUser = safeJSONParse(localStorage.getItem('user'));
    const updated = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updated));
    set({ user: updated });
  },
}));
