'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginRequest, RegisterRequest, authAPI, authStorage } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing token and user on app load
    const token = authStorage.getToken();
    const storedUser = authStorage.getUser();

    if (token && storedUser) {
      // Verify token is still valid
      authAPI.getCurrentUser(token)
        .then((currentUser) => {
          setUser(currentUser);
          authStorage.setUser(currentUser);
        })
        .catch(() => {
          // Token is invalid, clear storage
          authStorage.clear();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authAPI.login(data);
      authStorage.setToken(response.access_token);
      authStorage.setUser(response.user);
      setUser(response.user);
      router.push('/');
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authAPI.register(data);
      // After successful registration, redirect to login
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 