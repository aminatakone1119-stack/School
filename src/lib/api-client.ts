/**
 * REST API Client for NestJS Backend (/api/v1)
 * Handles JWT injection from Supabase and standard error formatting
 */

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    statusCode: number;
    code: string;
    message: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
      '/api/v1';
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const stored = localStorage.getItem('edumanage_auth_token');
      return stored || null;
    } catch {
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || `Erreur serveur (${response.status})`);
      }

      return data as T;
    } catch (err: any) {
      // In dev fallback mode if backend is not yet attached
      console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
