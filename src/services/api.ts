import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signup: async (userData: any) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  loginWithMetaMask: async (address: string) => {
    const response = await api.post('/auth/metamask', { address });
    return response.data;
  },
  addTicket: async (ticketData: any) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  }
};

export const events = {
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  create: async (eventData: any) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  update: async (id: string, eventData: any) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};

export const tickets = {
  getMyTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },
  purchaseTicket: async (ticketData: any) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },
  updateTicketStatus: async (ticketId: string, status: string) => {
    const response = await api.patch(`/tickets/${ticketId}`, { status });
    return response.data;
  }
};

export const admin = {
  getAllTickets: async () => {
    const response = await api.get('/admin/tickets');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  }
};

export default api;