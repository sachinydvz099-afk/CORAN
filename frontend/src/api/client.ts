import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (guest mode - no actual token needed)
api.interceptors.request.use(
  (config) => {
    // In guest mode, we don't send auth token
    // Backend should be modified to allow guest access or we can send a dummy token
    config.headers.Authorization = `Bearer guest-token`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // In guest mode, don't redirect on 401 errors
    // Just return the error for handling in components
    return Promise.reject(error);
  }
);

export default api;

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/login', data),
};

// Project APIs
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Character APIs
export const characterAPI = {
  getAll: (projectId: string) => api.get(`/projects/${projectId}/characters`),
  create: (projectId: string, data: any) => 
    api.post(`/projects/${projectId}/characters`, data),
  update: (projectId: string, characterId: string, data: any) =>
    api.put(`/projects/${projectId}/characters/${characterId}`, data),
  delete: (projectId: string, characterId: string) =>
    api.delete(`/projects/${projectId}/characters/${characterId}`),
};

// Scene APIs
export const sceneAPI = {
  getAll: (projectId: string) => api.get(`/projects/${projectId}/scenes`),
  update: (projectId: string, sceneId: string, data: any) =>
    api.put(`/projects/${projectId}/scenes/${sceneId}`, data),
  delete: (projectId: string, sceneId: string) =>
    api.delete(`/projects/${projectId}/scenes/${sceneId}`),
};

// Render APIs
export const renderAPI = {
  createJob: (projectId: string, data: any) =>
    api.post(`/projects/${projectId}/render`, data),
  getJobStatus: (jobId: string) =>
    api.get(`/render_jobs/${jobId}/status`),
};

// Voice APIs
export const voiceAPI = {
  getAll: () => api.get('/voice_styles'),
};

// Billing APIs
export const billingAPI = {
  getCredits: () => api.get('/billing/credits'),
};

// Notification APIs
export const notificationAPI = {
  getAll: (params?: { limit?: number; offset?: number; unread_only?: boolean }) =>
    api.get('/notifications', { params }),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
};
