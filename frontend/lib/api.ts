const getBaseUrl = (): string => {
  const DEFAULT = 'http://10.0.2.2:5001';

  // 1. Vite dev server (process.env injected by vite.config.ts)
  try {
    if (typeof process !== 'undefined' && process.env?.VITE_BACKEND_URL) {
      return process.env.VITE_BACKEND_URL;
    }
  } catch {}

  // 2. Expo (process.env.EXPO_PUBLIC_* exposed by Metro)
  try {
    if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_BACKEND_URL) {
      return process.env.EXPO_PUBLIC_BACKEND_URL;
    }
  } catch {}

  // 3. import.meta.env (Vite only)
  try {
    if ((import.meta as any)?.env?.VITE_BACKEND_URL) {
      return (import.meta as any).env.VITE_BACKEND_URL;
    }
  } catch {}

  // 4. window.__env__ (custom injection)
  try {
    if (typeof window !== 'undefined' && (window as any).__env__?.VITE_BACKEND_URL) {
      return (window as any).__env__.VITE_BACKEND_URL;
    }
  } catch {}

  return DEFAULT;
};

const BASE_URL: string = getBaseUrl();

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
  console.log(`[API] Auth token ${token ? 'set' : 'cleared'}`);
}

export function getAuthToken(): string | null {
  return authToken;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

async function handleResponse<T>(response: Response, url: string): Promise<T> {
  console.log(`[API] Response: ${response.status} ${response.statusText} | URL: ${url}`);
  console.log(`[API] Headers:`, Object.fromEntries(response.headers.entries()));

  const text = await response.text();
  console.log(`[API] Body (first 500 chars):`, text.slice(0, 500));

  if (!response.ok) {
    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    const errorMsg = parsed?.message || `HTTP ${response.status}: ${response.statusText}`;
    console.log(`[API] Request failed:`, { url, status: response.status, message: errorMsg, body: parsed });
    throw new Error(errorMsg);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    console.warn(`[API] Response is not JSON, returning raw text`);
    return text as unknown as T;
  }
}

async function get<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  console.log(`[API] GET ${url}`);
  console.log(`[API] Headers:`, getHeaders());

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse<T>(response, url);
  } catch (err: any) {
    if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message?.includes('CORS')) {
      console.log(`[API] Network/CORS error on GET ${url}:`, err.message);
      console.log(`[API] Full error object:`, err);
      throw new Error(`Network error: Cannot reach server at ${BASE_URL}. Is the backend running?`);
    }
    console.log(`[API] GET ${url} threw:`, err);
    throw err;
  }
}

async function post<T>(path: string, body: Record<string, any>): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const safeBody = { ...body };
  if (safeBody.password) safeBody.password = '***';
  if (safeBody.confirmPassword) safeBody.confirmPassword = '***';

  console.log(`[API] POST ${url}`);
  console.log(`[API] Request body (redacted):`, safeBody);
  console.log(`[API] Headers:`, getHeaders());

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(response, url);
  } catch (err: any) {
    if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message?.includes('CORS')) {
      console.log(`[API] Network/CORS error on POST ${url}:`, err.message);
      console.log(`[API] Full error object:`, err);
      throw new Error(`Network error: Cannot reach server at ${BASE_URL}. Is the backend running?`);
    }
    console.log(`[API] POST ${url} threw:`, err);
    throw err;
  }
}

// ─── Health ─────────────────────────────────────────────
export async function getHealth(): Promise<{ status: string; message: string }> {
  return get('/api/health');
}

export async function getTest(): Promise<{ message: string }> {
  return get('/api/test');
}

// ─── Auth ────────────────────────────────────────────────
export async function register(body: Record<string, any>): Promise<any> {
  return post('/api/auth/register', body);
}

export async function login(body: Record<string, any>): Promise<any> {
  return post('/api/auth/login', body);
}

export async function googleLogin(body: Record<string, any>): Promise<any> {
  return post('/api/auth/google', body);
}

export async function getUsers(): Promise<any> {
  return get('/api/auth/users');
}

// ─── Email ───────────────────────────────────────────────
export async function sendEmail(body: { to: string; subject: string; html: string }): Promise<any> {
  return post('/api/email/send', body);
}

// ─── Payment (PayPal) ────────────────────────────────────
export async function createPayPalOrder(body: { amount: number; currency?: string; description?: string }): Promise<any> {
  return post('/api/payment/create', body);
}

export async function capturePayPalOrder(body: { orderId: string }): Promise<any> {
  return post('/api/payment/capture', body);
}

// ─── Upload ─────────────────────────────────
export async function uploadImage(body: { image: string; folder?: string }): Promise<any> {
  return post('/api/upload/image', body);
}

export async function uploadAssetImage(imageUri: string): Promise<{ success: boolean; url: string; publicId: string }> {
  const formData = new FormData();
  
  // Extract file name from device URI path
  const filename = imageUri.split('/').pop() || 'upload.jpg';
  
  // Deduce mimetype from file extension
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : `image/jpeg`;
  
  // Append file under the form name "image", casting to any to bypass standard browser FormData types in React Native
  formData.append('image', {
    uri: imageUri,
    name: filename,
    type,
  } as any);

  const url = `${BASE_URL}/api/upload/asset`;

  console.log(`[API] POST ${url} (FormData)`);
  console.log(`[API] Uploading image: ${imageUri} as ${filename} (${type})`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        // IMPORTANT: In React Native, DO NOT specify the 'Content-Type': 'multipart/form-data' header.
        // Doing so overrides the fetch client's ability to append the proper boundary key required for multipart parsing.
        ...(getAuthToken() ? { 'Authorization': `Bearer ${getAuthToken()}` } : {}),
      },
    });

    return await handleResponse<{ success: boolean; url: string; publicId: string }>(response, url);
  } catch (err: any) {
    if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError') || err.message?.includes('CORS')) {
      console.log(`[API] Network error on POST ${url}:`, err.message);
      throw new Error(`Network error: Cannot reach server at ${BASE_URL}. Is the backend running?`);
    }
    console.log(`[API] POST ${url} threw:`, err);
    throw err;
  }
}

// ─── Listings ────────────────────────────────────────────
export async function getListings(limit: number = 5): Promise<{ success: boolean; listings: any[] }> {
  const params = `?limit=${limit}`;
  return get(`/api/listings${params}`);
}

export async function getFeaturedListings(limit: number = 5): Promise<{ success: boolean; listings: any[] }> {
  const params = `?limit=${limit}`;
  return get(`/api/listings/featured${params}`);
}

export async function getListingsByType(type: string, limit: number = 5, page: number = 1): Promise<{ success: boolean; listings: any[] }> {
  const qs: string[] = [];
  if (limit) qs.push(`limit=${limit}`);
  if (page) qs.push(`page=${page}`);
  const params = qs.length ? `?${qs.join('&')}` : '';
  return get(`/api/listings/type/${type}${params}`);
}

export async function getBrandsByType(type: string): Promise<{ success: boolean; brands: string[] }> {
  return get(`/api/listings/brands/${type}`);
}

export async function getListingById(id: string): Promise<{ success: boolean; listing: any }> {
  return get(`/api/listings/${id}`);
}

export async function createListing(body: Record<string, any>): Promise<any> {
  return post('/api/listings', body);
}

export async function request<T>(path: string): Promise<T> {
  return get<T>(path);
}

export const apiClient = {
  setAuthToken,
  getAuthToken,
  getHealth,
  getTest,
  register,
  login,
  googleLogin,
  getUsers,
  sendEmail,
  createPayPalOrder,
  capturePayPalOrder,
  uploadImage,
  uploadAssetImage,
  getListings,
  getFeaturedListings,
  getListingsByType,
  getBrandsByType,
  getListingById,
  createListing,
  request,
};
