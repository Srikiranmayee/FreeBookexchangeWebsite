import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storageService } from '../services/storageService';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  register: (username: string, password: string, role: 'donor' | 'collector') => void;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storageService.initializeSampleData();
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    setError(null);
    const authenticatedUser = storageService.loginUser(username, password);

    if (authenticatedUser) {
      setUser(authenticatedUser);
    } else {
      setError('Invalid username or password');
    }
  };

  const register = (username: string, password: string, role: 'donor' | 'collector') => {
    setError(null);
    const newUser = storageService.registerUser(username, password, role);

    if (newUser) {
      setUser(newUser);
    } else {
      setError('Username already exists');
    }
  };

  const logout = () => {
    storageService.logoutUser();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};
