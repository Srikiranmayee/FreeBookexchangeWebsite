import { User } from '../types';
import { authConfig } from '../config/auth';
import Cookies from 'js-cookie';

// Demo users for API key mode
const demoUsers = {
  donor: {
    id: 'demo-donor-1',
    name: 'Demo Donor',
    email: 'donor@demo.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'donor' as const,
    createdAt: new Date(),
  },
  collector: {
    id: 'demo-collector-1',
    name: 'Demo Collector',
    email: 'collector@demo.com',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    role: 'collector' as const,
    createdAt: new Date(),
  }
};

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export class AuthService {
  private static instance: AuthService;
  private googleAuth: any = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async initializeGoogle(): Promise<void> {
    if (authConfig.google.clientId === 'demo-mode') {
      return; // Skip Google initialization in demo mode
    }

    return new Promise((resolve, reject) => {
      if (window.gapi) {
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init({
            client_id: authConfig.google.clientId,
            scope: authConfig.google.scopes.join(' ')
          }).then(() => {
            this.googleAuth = window.gapi.auth2.getAuthInstance();
            resolve();
          }).catch(reject);
        });
      } else {
        // Load Google API script
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('auth2', () => {
            window.gapi.auth2.init({
              client_id: authConfig.google.clientId,
              scope: authConfig.google.scopes.join(' ')
            }).then(() => {
              this.googleAuth = window.gapi.auth2.getAuthInstance();
              resolve();
            }).catch(reject);
          });
        };
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  async signInWithGoogle(role: 'donor' | 'collector'): Promise<User> {
    try {
      if (!authConfig.google.apiKey) {
        throw new Error('Google API Key is not configured. Please set VITE_GOOGLE_API_KEY environment variable.');
      }

      // Use demo authentication with API key
      if (authConfig.google.clientId === 'demo-mode') {
        return this.signInDemo(role);
      }

      // Original OAuth flow (if proper client ID is provided)
      await this.initializeGoogle();
      
      const authResult = await this.googleAuth.signIn();
      const profile = authResult.getBasicProfile();
      const authResponse = authResult.getAuthResponse();

      const user: User = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        avatar: profile.getImageUrl(),
        role: role,
        createdAt: new Date(),
      };

      // Store authentication data
      const authData = {
        user,
        token: authResponse.access_token,
        provider: 'google',
        expiresAt: new Date(Date.now() + authResponse.expires_in * 1000)
      };

      localStorage.setItem('authData', JSON.stringify(authData));
      Cookies.set('authToken', authResponse.access_token, { 
        expires: new Date(Date.now() + authResponse.expires_in * 1000),
        secure: true,
        sameSite: 'strict'
      });

      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  private async signInDemo(role: 'donor' | 'collector'): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = demoUsers[role];

    // Store demo authentication data
    const authData = {
      user,
      token: `demo-token-${Date.now()}`,
      provider: 'demo',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    localStorage.setItem('authData', JSON.stringify(authData));
    Cookies.set('authToken', authData.token, { 
      expires: 1, // 1 day
      secure: false, // Allow for localhost
      sameSite: 'lax'
    });

    return user;
  }

  signOut(): void {
    const authData = this.getAuthData();
    
    if (authData?.provider === 'google' && this.googleAuth && authConfig.google.clientId !== 'demo-mode') {
      this.googleAuth.signOut();
    }
    
    // Clear all stored data
    localStorage.removeItem('authData');
    Cookies.remove('authToken');
  }

  getCurrentUser(): User | null {
    const authData = this.getAuthData();
    return authData?.user || null;
  }

  isAuthenticated(): boolean {
    const authData = this.getAuthData();
    if (!authData) return false;
    
    // Check if token is expired
    if (authData.expiresAt && new Date() > new Date(authData.expiresAt)) {
      this.signOut();
      return false;
    }
    
    return !!authData.token;
  }

  private getAuthData(): any {
    try {
      const data = localStorage.getItem('authData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error parsing auth data:', error);
      return null;
    }
  }

  async refreshToken(): Promise<void> {
    const authData = this.getAuthData();
    if (!authData) throw new Error('No authentication data found');

    // Handle demo mode token refresh
    if (authData.provider === 'demo') {
      authData.token = `demo-token-${Date.now()}`;
      authData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      localStorage.setItem('authData', JSON.stringify(authData));
      Cookies.set('authToken', authData.token, { 
        expires: 1,
        secure: false,
        sameSite: 'lax'
      });
      return;
    }

    if (authData.provider === 'google' && this.googleAuth) {
      try {
        const authResponse = await this.googleAuth.currentUser.get().reloadAuthResponse();
        authData.token = authResponse.access_token;
        authData.expiresAt = new Date(Date.now() + authResponse.expires_in * 1000);
        
        localStorage.setItem('authData', JSON.stringify(authData));
        Cookies.set('authToken', authResponse.access_token, { 
          expires: new Date(Date.now() + authResponse.expires_in * 1000),
          secure: true,
          sameSite: 'strict'
        });
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.signOut();
        throw new Error('Session expired. Please sign in again.');
      }
    }
  }
}

export const authService = AuthService.getInstance();