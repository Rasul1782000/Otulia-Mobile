const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && (window as any).__env__?.VITE_BACKEND_URL) {
    return (window as any).__env__.VITE_BACKEND_URL;
  }
  try {
    if (import.meta.env?.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
  } catch {
    // import.meta not available (e.g., server-side rendering)
  }
  return '';
};

const BASE_URL: string = getBaseUrl();

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  return headers;
}

async function get<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  console.log(`[API] GET ${url}`);
  const response = await fetch(url, { headers: getHeaders() });
  
  if (!response.ok) {
    const text = await response.text();
    console.error(`[API] GET ${url} failed with status ${response.status}:`, text.slice(0, 200));
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Request failed with status ${response.status}. See console for details.`);
    }
    throw new Error(data.message || `Request failed: ${response.statusText}`);
  }
  
  return await response.json() as T;
}

async function post<T>(path: string, body: Record<string, any>): Promise<T> {
  const url = `${BASE_URL}${path}`;
  console.log(`[API] POST ${url}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[API] POST ${url} failed with status ${response.status}:`, text.slice(0, 200));
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Request failed with status ${response.status}. See console for details.`);
    }
    throw new Error(data.message || `Request failed: ${response.statusText}`);
  }

  return await response.json() as T;
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

// ─── Upload (Cloudinary) ─────────────────────────────────
export async function uploadImage(body: { image: string; folder?: string }): Promise<any> {
  return post('/api/upload/image', body);
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
  request,
};
