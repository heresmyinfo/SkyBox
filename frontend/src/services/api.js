import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const designAPI = {
  // Get all designs
  getAllDesigns: () => api.get('/designs'),
  
  // Get design by ID
  getDesignById: (id) => api.get(`/designs/${id}`),
  
  // Search designs
  searchDesigns: (query) => api.get(`/designs/search/${encodeURIComponent(query)}`),
  
  // Get statistics
  getStats: () => api.get('/stats'),
  
  // Get INTERACT-like output for a design id
  getInteract: (id) => api.get(`/interact/${encodeURIComponent(id)}`),

  // List available INTERACT IDs
  getInteractList: () => api.get('/interact'),

  // Health check
  healthCheck: () => api.get('/health'),
};

export default api;
