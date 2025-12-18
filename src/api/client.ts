import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8080';

let apiClient: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    apiClient = createApiClient();
  }
  return apiClient;
}

export function createApiClient(): AxiosInstance {
  const apiKey = localStorage.getItem('rt_api_key');
  
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('rt_api_key');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export function resetApiClient(): void {
  apiClient = null;
}

export function setApiKey(key: string): void {
  localStorage.setItem('rt_api_key', key);
  resetApiClient();
}

export function clearApiKey(): void {
  localStorage.removeItem('rt_api_key');
  resetApiClient();
}

export function getApiKey(): string | null {
  return localStorage.getItem('rt_api_key');
}

