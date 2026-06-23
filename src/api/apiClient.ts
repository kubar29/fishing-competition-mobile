import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://192.168.43.240:3000/api',
  timeout: 10000,
});