// Real authentication configuration
export const authConfig = {
  google: {
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY || '',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-mode',
    scopes: ['profile', 'email'],
  },
};

// Environment variables validation
export const validateAuthConfig = () => {
  const errors: string[] = [];
  
  if (!authConfig.google.apiKey || authConfig.google.apiKey === '') {
    errors.push('Google API Key is not configured. Please set VITE_GOOGLE_API_KEY environment variable.');
  }
  
  return errors;
};

// Check if specific provider is configured
export const isGoogleConfigured = (): boolean => {
  return !!(authConfig.google.apiKey && authConfig.google.apiKey !== '');
};