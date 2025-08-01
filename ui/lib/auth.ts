export interface User {
  id: string;
  name: string;
  email: string;
  role: 'project_manager' | 'developer' | 'qa';
  githubUsername?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: 'project_manager' | 'developer' | 'qa';
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'project_manager' | 'developer' | 'qa';
  hasGithubAccount: boolean;
  githubUsername?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// API Functions
export const authAPI = {
  async register(data: RegisterRequest): Promise<{ id: string; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  },
};

// Local Storage Keys
const TOKEN_KEY = 'autodevgenie_token';
const USER_KEY = 'autodevgenie_user';

// Cookie functions
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Local Storage Functions
export const authStorage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Try cookie first, then localStorage
    return getCookie(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    // Set both cookie and localStorage
    setCookie(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    if (typeof window === 'undefined') return;
    deleteCookie(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  clear(): void {
    this.removeToken();
    this.removeUser();
  },
}; 