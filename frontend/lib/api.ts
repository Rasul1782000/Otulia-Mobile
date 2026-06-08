import { Platform } from 'react-native';

/**
 * API service for communicating with the backend server.
 * Adjust the `BASE_URL` as needed, preferably via an environment variable.
 */
const getBaseUrl = (): string => {
  // Try to read environment variable
  const envUrl = (typeof process !== 'undefined' && process.env && process.env.VITE_BACKEND_URL) || 
                 (typeof window !== 'undefined' && (window as any).__env__?.VITE_BACKEND_URL);
  
  if (envUrl) {
    return envUrl;
  }

  // Fallback based on running platform (useful for development)
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

const BASE_URL: string = getBaseUrl();

/** Helper to perform GET requests and parse JSON */
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Network response was not ok: ${response.statusText}`);
  }
  return data as T;
}

/** Helper to perform POST requests and parse JSON */
async function post<T>(path: string, body: Record<string, any>): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.statusText}`);
  }
  return data as T;
}

/** Fetch backend health status */
export async function getHealth(): Promise<{ status: string; message: string }> {
  return get<{ status: string; message: string }>('/api/health');
}

/** Simple test endpoint */
export async function getTest(): Promise<{ message: string }> {
  return get<{ message: string }>('/api/test');
}

/** User registration */
export async function register(body: Record<string, any>): Promise<any> {
  return post<any>('/api/auth/register', body);
}

/** User login */
export async function login(body: Record<string, any>): Promise<any> {
  return post<any>('/api/auth/login', body);
}

/** Retrieve all users in DB */
export async function getUsers(): Promise<any> {
  return get<any>('/api/auth/users');
}

/** Generic request for any endpoint (GET) */
export async function request<T>(path: string): Promise<T> { 
  return get<T>(path); 
}

/** Export a simple client object for convenience */
export const apiClient = {
  getHealth,
  getTest,
  register,
  login,
  getUsers,
  request,
};

