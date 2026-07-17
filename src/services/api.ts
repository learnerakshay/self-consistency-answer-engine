import axios from 'axios';
import { OrchestrationResponse } from '../types';

const client = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generic response interceptor for unexpected server/network or timeout errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.message = 'The server request timed out after 30 seconds. Please try again.';
    } else if (!error.response) {
      error.message = 'Network error: Unable to connect to the orchestration server. Please verify your connection.';
    }
    return Promise.reject(error);
  }
);

/**
 * Triggers the Self Consistency AI Orchestration process on the backend.
 */
export async function orchestrate(prompt: string): Promise<OrchestrationResponse> {
  const response = await client.post<OrchestrationResponse>('/orchestrate', { prompt });
  return response.data;
}
