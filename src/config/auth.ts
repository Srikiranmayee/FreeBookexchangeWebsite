// Real authentication configuration
export const authConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  },
  apple: {
    clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'your.apple.service.id',
    redirectURI: import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin,
    scope: 'name email',
  },
};

// Environment variables validation
export const validateAuthConfig = () => {
  const errors: string[] = [];
  
  if (!authConfig.google.clientId || authConfig.google.clientId.includes('your-google-client-id')) {
    errors.push('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
  }
  
  if (!authConfig.apple.clientId || authConfig.apple.clientId.includes('your.apple.service.id')) {
    errors.push('Apple Client ID is not configured. Please set VITE_APPLE_CLIENT_ID environment variable.');
  }
  
  return errors;
};