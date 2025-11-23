import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get user ID (stored in localStorage)
const getUserId = (): string => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': getUserId(),
  },
});

// Update user ID in headers when making requests
apiClient.interceptors.request.use((config) => {
  config.headers['x-user-id'] = getUserId();
  return config;
});

export default apiClient;

