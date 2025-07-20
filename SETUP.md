# Google Authentication Setup Guide

This application uses real Google OAuth authentication. Follow these steps to configure authentication:

## Google OAuth Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity API

### Step 2: Configure OAuth Consent Screen
1. Go to "OAuth consent screen" in the sidebar
2. Choose "External" user type
3. Fill in the required information:
   - App name: "BookShare"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`
5. Save and continue

### Step 3: Create OAuth Credentials
1. Go to "Credentials" in the sidebar
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain (for production)
5. Copy the Client ID

## Environment Configuration

### Step 1: Create Environment File
1. Copy `.env.example` to `.env`
2. Fill in your Google OAuth credentials:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Step 2: Update for Production
For production deployment, update the redirect URIs in Google OAuth console and your environment variables.

## Testing Authentication

1. Start the development server: `npm run dev`
2. Try signing in with Google
3. Check browser console for any errors
4. Verify user data is correctly stored

## Security Considerations

### For Production:
- Use HTTPS for all OAuth redirects
- Implement proper CORS policies
- Add rate limiting for authentication endpoints
- Store sensitive data securely
- Implement proper session management
- Add logout functionality that clears all tokens

### Token Management:
- Implement token refresh logic
- Handle expired tokens gracefully
- Clear tokens on logout
- Use secure cookie settings

## Troubleshooting

### Common Issues:

**Google OAuth Errors:**
- Check that JavaScript origins match exactly
- Ensure Google+ API is enabled
- Verify client ID is correct

**General Issues:**
- Check browser console for detailed error messages
- Ensure environment variables are loaded correctly
- Verify Google OAuth configuration

### Debug Mode:
Add this to your `.env` for debugging:
```env
VITE_DEBUG_AUTH=true
```

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)