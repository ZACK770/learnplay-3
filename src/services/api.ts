import axios from 'axios';
import { auth } from '../lib/firebase';
import { GameEngine, Dataset, GameSession, UserProfile } from '../types';

const API_BASE = '/api';

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
};

export const api = {
  // Users
  getMe: async (): Promise<UserProfile> => {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE}/users/me`, { headers });
    return res.data;
  },

  // Engines
  getEngines: async (): Promise<GameEngine[]> => {
    const res = await axios.get(`${API_BASE}/engines`);
    return res.data;
  },

  // Datasets
  getDatasets: async (): Promise<Dataset[]> => {
    const res = await axios.get(`${API_BASE}/datasets`);
    return res.data;
  },

  createDataset: async (data: Partial<Dataset>): Promise<Dataset> => {
    const headers = await getAuthHeaders();
    const res = await axios.post(`${API_BASE}/datasets`, data, { headers });
    return res.data;
  },

  // Sessions
  getRecentSessions: async (): Promise<GameSession[]> => {
    const headers = await getAuthHeaders();
    const res = await axios.get(`${API_BASE}/sessions/recent`, { headers });
    return res.data;
  },

  saveSession: async (data: Partial<GameSession>): Promise<GameSession> => {
    const headers = await getAuthHeaders();
    const res = await axios.post(`${API_BASE}/sessions`, data, { headers });
    return res.data;
  },

  // Payments
  processDirectPayment: async (data: any): Promise<any> => {
    const headers = await getAuthHeaders();
    const res = await axios.post(`${API_BASE}/payments/nedarim/direct`, data, { headers });
    return res.data;
  }
};
