/**
 * API service for communicating with the backend server.
 * Adjust the `BASE_URL` as needed, preferably via an environment variable.
 */

const BASE_URL: string = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000';

/** Helper to perform GET requests and parse JSON */
async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }
  return (await response.json()) as T;
}

/** Fetch backend health status */
export async function getHealth(): Promise<{ status: string; message: string }> {
  return get<{ status: string; message: string }>('/api/health');
}

/** Simple test endpoint */
export async function getTest(): Promise<{ message: string }> {
  return get<{ message: string }>('/api/test');
}

/** Example endpoint used in the original server */
export async function getJ(): Promise<{ message: string }> {
  return get<{ message: string }>('/api/j');
}

/** Generic request for any endpoint (GET) */
export async function request<T>(path: string): Promise<T> { return get<T>(path); }

/** Export a simple client object for convenience */
export const apiClient = {
  getHealth,
  getTest,
  getJ,
  request,
};
