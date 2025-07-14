// Generic authentication configuration for demo purposes
export const authConfig = {
  demo: {
    enabled: true,
    simulateDelay: 1500, // Simulate network delay in milliseconds
  },
  google: {
    // In a real implementation, these would be actual OAuth settings
    demo: true,
    name: 'Google',
  },
  apple: {
    // In a real implementation, these would be actual OAuth settings
    demo: true,
    name: 'Apple',
  },
};