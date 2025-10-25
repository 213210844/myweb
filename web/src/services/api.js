import axios from 'axios';

// 动态获取当前主机的API基础URL
const getApiBaseUrl = () => {
  const { hostname, port } = window.location;
  
  // 如果是本地开发
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://127.0.0.1:8000/api';
  }
  
  // 如果是IP地址访问，使用对应的后端地址
  if (hostname === '192.168.118.128') {
    return 'http://192.168.118.128:8000/api';
  }
  
  // 默认情况
  return 'http://127.0.0.1:8000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('API Base URL:', API_BASE_URL); // 调试信息

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const broadcastAPI = {
  getBroadcasts: (params = {}) => api.get('/broadcasts/', { params }),
  getBroadcast: (id) => api.get(`/broadcasts/${id}/`),
  createBroadcast: (data) => api.post('/broadcasts/', data),
  updateBroadcast: (id, data) => api.put(`/broadcasts/${id}/`, data),
  deleteBroadcast: (id) => api.delete(`/broadcasts/${id}/`),
  likeBroadcast: (id) => api.post(`/broadcasts/${id}/like/`),
  addComment: (id, data) => api.post(`/broadcasts/${id}/add_comment/`, data),
  getStats: () => api.get('/broadcasts/stats/'),
};

export const authAPI = {
  login: (credentials) => api.post('/token-auth/', credentials),
  register: (userData) => api.post('/register/', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getProfile: () => api.get('/profiles/'),
};

export default api;