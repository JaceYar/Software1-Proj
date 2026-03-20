import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const logout = () => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');

// Rooms
export const getRooms = () => api.get('/rooms');
export const getAvailableRooms = (checkIn, checkOut) =>
  api.get('/rooms/available', { params: { checkIn, checkOut } });
export const createRoom = (data) => api.post('/rooms', data);
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);

// Reservations
export const getReservations = () => api.get('/reservations');
export const createReservation = (data) => api.post('/reservations', data);
export const cancelReservation = (id) => api.delete(`/reservations/${id}`);
export const checkIn = (id) => api.post(`/reservations/${id}/checkin`);
export const checkOut = (id) => api.post(`/reservations/${id}/checkout`);

// Store
export const getProducts = () => api.get('/store/products');
export const getCart = () => api.get('/store/cart');
export const addToCart = (data) => api.post('/store/cart', data);
export const checkout = () => api.post('/store/checkout');

// Admin
export const getUsers = () => api.get('/admin/users');
export const createClerk = (data) => api.post('/admin/clerks', data);
export const resetPassword = (data) => api.post('/admin/reset-password', data);

export default api;
