import { User } from '../types';

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signInWithGoogle(role: 'donor' | 'collector'): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomId = Math.random().toString(36).substring(7);
        const mockGoogleUser: User = {
          id: `google_${role}_${randomId}`,
          name: `${role === 'donor' ? 'Book Donor' : 'Book Collector'} ${randomId.toUpperCase()}`,
          email: `${role}${randomId}@gmail.com`,
          avatar: `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face`,
          role: role,
          createdAt: new Date(),
        };
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(mockGoogleUser));
        localStorage.setItem('authToken', `google_${role}_token_${Date.now()}`);
        
        resolve(mockGoogleUser);
      }, 1500); // Simulate network delay
    });
  }

  async signInWithApple(role: 'donor' | 'collector'): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomId = Math.random().toString(36).substring(7);
        const mockAppleUser: User = {
          id: `apple_${role}_${randomId}`,
          name: `${role === 'donor' ? 'Book Donor' : 'Book Collector'} ${randomId.toUpperCase()}`,
          email: `${role}${randomId}@icloud.com`,
          avatar: `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face`,
          role: role,
          createdAt: new Date(),
        };
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(mockAppleUser));
        localStorage.setItem('authToken', `apple_${role}_token_${Date.now()}`);
        
        resolve(mockAppleUser);
      }, 1500); // Simulate network delay
    });
  }

  signOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
}

export const authService = AuthService.getInstance();