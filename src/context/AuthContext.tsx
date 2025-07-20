import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (role: 'donor' | 'collector') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  refreshAuth: () => Promise<void>;
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
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setIsLoading(false);

    // Set up token refresh interval
    const refreshInterval = setInterval(async () => {
      if (authService.isAuthenticated()) {
        try {
          await authService.refreshToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          logout();
        }
      }
    }, 30 * 60 * 1000); // Refresh every 30 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (role: 'donor' | 'collector') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authenticatedUser = await authService.signInWithGoogle(role);
      
      setUser(authenticatedUser);
    } catch (error) {
      let errorMessage = 'Authentication failed';
      if (error instanceof Error) {
        if (error.message.includes('idpiframe_initialization_failed') || error.message.includes('Not a valid origin')) {
          errorMessage = error.message;
        } else {
          errorMessage = error.message;
        }
      }
      setError(errorMessage);
      console.error('Google authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.signOut();
    setUser(null);
    setError(null);
  };

  const refreshAuth = async () => {
    try {
      await authService.refreshToken();
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth refresh failed:', error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      error, 
      refreshAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
};