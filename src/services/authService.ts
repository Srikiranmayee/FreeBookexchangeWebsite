import { User } from '../types';
import { authConfig } from '../config/auth';
import Cookies from 'js-cookie';

declare global {
  interface Window {
    google: any;
    gapi: any;
    AppleID: any;
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

  async initializeApple(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: authConfig.apple.clientId,
          scope: authConfig.apple.scope,
          redirectURI: authConfig.apple.redirectURI,
          usePopup: true
        });
        resolve();
      } else {
        // Load Apple ID script
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.onload = () => {
          window.AppleID.auth.init({
            clientId: authConfig.apple.clientId,
            scope: authConfig.apple.scope,
            redirectURI: authConfig.apple.redirectURI,
            usePopup: true
          });
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  async signInWithGoogle(role: 'donor' | 'collector'): Promise<User> {
    try {
      await this.initializeGoogle();
      
      if (!this.googleAuth) {
        throw new Error('Google Auth not initialized');
      }

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
      throw new Error('Google authentication failed. Please try again.');
    }
  }

  async signInWithApple(role: 'donor' | 'collector'): Promise<User> {
    try {
      await this.initializeApple();

      const response = await window.AppleID.auth.signIn();
      
      if (!response.authorization) {
        throw new Error('Apple authorization failed');
      }

      // Parse the identity token to get user info
      const identityToken = response.authorization.id_token;
      const userInfo = this.parseJWT(identityToken);

      const user: User = {
        id: response.authorization.user || userInfo.sub,
        name: response.user?.name ? 
          `${response.user.name.firstName} ${response.user.name.lastName}` : 
          userInfo.email?.split('@')[0] || 'Apple User',
        email: response.user?.email || userInfo.email,
        avatar: undefined, // Apple doesn't provide avatar
        role: role,
        createdAt: new Date(),
      };

      // Store authentication data
      const authData = {
        user,
        token: response.authorization.code,
        provider: 'apple',
        expiresAt: new Date(Date.now() + 3600000) // 1 hour
      };

      localStorage.setItem('authData', JSON.stringify(authData));
      Cookies.set('authToken', response.authorization.code, { 
        expires: 1, // 1 day
        secure: true,
        sameSite: 'strict'
      });

      return user;
    } catch (error) {
      console.error('Apple sign-in error:', error);
      throw new Error('Apple authentication failed. Please try again.');
    }
  }

  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT parsing error:', error);
      return {};
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