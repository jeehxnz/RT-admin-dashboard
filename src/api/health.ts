import axios from 'axios';
import type { ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:8080';

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await axios.get<ApiResponse<null>>(`${API_BASE_URL}/healthz`);
    return response.data.ok;
  } catch {
    return false;
  }
}

