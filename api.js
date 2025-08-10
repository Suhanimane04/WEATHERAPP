import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE });

export const fetchWeather = (q) => api.get(`/weather?q=${encodeURIComponent(q)}`);
export const createRecord = (payload) => api.post('/records', payload);
export const fetchRecords = (q) => api.get(`/records${q ? '?q=' + encodeURIComponent(q) : ''}`);
export const deleteRecord = (id) => api.delete(`/records/${id}`);
