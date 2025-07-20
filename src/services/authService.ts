import { User } from '../types';
import { authConfig } from '../config/auth';
import Cookies from 'js-cookie';

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
    return new Promise<void>((resolve, reject) => {
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
      // Initialize Google OAuth
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

  signOut(): void {
    const authData = this.getAuthData();
    
    if (authData?.provider === 'google' && this.googleAuth) {
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