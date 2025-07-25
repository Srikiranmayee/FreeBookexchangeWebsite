// Real authentication configuration
export const authConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-mode',
    scopes: ['profile', 'email'],
  },
};

// Environment variables validation
export const validateAuthConfig = () => {
  const errors: string[] = [];
  
  if (!authConfig.google.clientId || authConfig.google.clientId === '') {
    errors.push('Google OAuth Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
  }
  
  return errors;
};

// Check if specific provider is configured
export const isGoogleConfigured = (): boolean => {
  return !!(authConfig.google.clientId && authConfig.google.clientId !== '' && authConfig.google.clientId !== 'your-oauth-client-id.apps.googleusercontent.com');
};