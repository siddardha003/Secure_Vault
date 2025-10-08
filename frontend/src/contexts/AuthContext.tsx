'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/utils/api';
import { initializeEncryption, clearEncryptionData } from '@/utils/encryption';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  masterPassword: string | null;
  setMasterPassword: (password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [masterPassword, setMasterPasswordState] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Verify token with server
          await authAPI.verify();
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Token verification failed:', error);
          // Clear invalid session
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response;
      
      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setMasterPasswordState(password);
      
      // Initialize encryption if not already done
      try {
        initializeEncryption(userData.id);
      } catch {
        // Salt might already exist, that's okay
        console.log('Encryption already initialized');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      throw new Error(errorMessage);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await authAPI.register(email, password);
      const { token, user: userData } = response;
      
      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setMasterPasswordState(password);
      
      // Initialize encryption for new user
      initializeEncryption(userData.id);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    // Clear all stored data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Clear encryption data
    if (user) {
      clearEncryptionData(user.id);
    }
    
    setUser(null);
    setMasterPasswordState(null);
  };

  const setMasterPassword = (password: string) => {
    setMasterPasswordState(password);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    masterPassword,
    setMasterPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};