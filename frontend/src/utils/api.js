import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const getExpenses = (month, year) => API.get(`/expenses?month=${month}&year=${year}`);
export const addExpense = (data) => API.post('/expenses', data);
export const updateExpense = (id, data) => API.put(`/expenses/${id}`, data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getExpenseSummary = (month, year) => API.get(`/expenses/summary?month=${month}&year=${year}`);

export const getBudget = (month, year) => API.get(`/budget?month=${month}&year=${year}`);
export const setBudget = (data) => API.post('/budget', data);
export const getAllBudgets = () => API.get('/budget/all');
export const categorizeExpense = (text) => API.post('/ai/categorize', { text });