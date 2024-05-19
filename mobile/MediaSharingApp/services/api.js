import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_APP_API_URL } from '@env';

const API_URL = REACT_APP_API_URL || 'http://localhost:5000/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const signupUser = async (userData) => {
    const response = await axiosInstance.post('/user/signup', userData);
    setToken(response.data.token);
    return response;
  };
  
  export const loginUser = async (userData) => {
    const response = await axiosInstance.post('/user/login', userData);
    setToken(response.data.token);
    return response;
  };
  
  export const fetchUser = async () => {
    const token = getToken();
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axiosInstance.get('/user/me');
      return response;
    } else {
      throw new Error('No token found');
    }
  };
  
  export const logoutUser = async () => {
    const response = await axiosInstance.post('/user/logout');
    localStorage.removeItem('token');
    return response;
  };
  
  export const fetchMedia = async () => {
    const response = await axiosInstance.get('/media');
    return response;
  };
  
  export const likeMedia = async (id) => {
    const response = await axiosInstance.post(`/media/like/${id}`);
    return response;
  };
  
  export const unlikeMedia = async (id) => {
    const response = await axiosInstance.delete(`/media/like/${id}`);
    return response;
  };
  
  export const uploadMedia = async (formData) => {
    const response = await axiosInstance.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  };