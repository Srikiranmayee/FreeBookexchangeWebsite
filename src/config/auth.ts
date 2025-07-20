// Real authentication configuration
export const authConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    scopes: ['profile', 'email'],
  },
  apple: {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID || '',
    redirectURI: import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin,
    scope: 'name email',
  },
};

// Environment variables validation
export const validateAuthConfig = () => {
  const errors: string[] = [];
  
  if (!authConfig.google.clientId || authConfig.google.clientId === '') {
    errors.push('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
  }
  
  if (!authConfig.apple.clientId || authConfig.apple.clientId === '') {
    errors.push('Apple Client ID is not configured. Please set VITE_APPLE_CLIENT_ID environment variable.');
  }
  
  return errors;
};

// Check if specific provider is configured
export const isProviderConfigured = (provider: 'google' | 'apple'): boolean => {
  if (provider === 'google') {
    return !!(authConfig.google.clientId && authConfig.google.clientId !== '');
  }
  if (provider === 'apple') {
    return !!(authConfig.apple.clientId && authConfig.apple.clientId !== '');
  }
  return false;
};