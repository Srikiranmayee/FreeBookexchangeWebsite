# Authentication Setup Guide

This application uses real OAuth authentication with Google and Apple. Follow these steps to configure authentication:

## 1. Google OAuth Setup

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

## 2. Apple OAuth Setup

### Step 1: Apple Developer Account
1. You need an Apple Developer account ($99/year)
2. Go to [Apple Developer Portal](https://developer.apple.com/account/)

### Step 2: Create App ID
1. Go to "Certificates, Identifiers & Profiles"
2. Click "Identifiers" → "+"
3. Choose "App IDs"
4. Configure:
   - Description: "BookShare Web App"
   - Bundle ID: `com.yourcompany.bookshare`
   - Enable "Sign In with Apple"

### Step 3: Create Service ID
1. Go to "Identifiers" → "+"
2. Choose "Services IDs"
3. Configure:
   - Description: "BookShare Web Service"
   - Identifier: `com.yourcompany.bookshare.web`
   - Enable "Sign In with Apple"
4. Configure domains and subdomains:
   - Primary App ID: Select the App ID created above
   - Domains: `localhost` (for development), your domain (for production)
   - Return URLs: `http://localhost:5173` (for development)

### Step 4: Create Private Key
1. Go to "Keys" → "+"
2. Key Name: "BookShare Sign In Key"
3. Enable "Sign In with Apple"
4. Configure and download the key file
5. Note the Key ID

## 3. Environment Configuration

### Step 1: Create Environment File
1. Copy `.env.example` to `.env`
2. Fill in your OAuth credentials:

```env
# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Apple OAuth
VITE_APPLE_CLIENT_ID=com.yourcompany.bookshare.web
VITE_APPLE_REDIRECT_URI=http://localhost:5173
```

### Step 2: Update for Production
For production deployment, update the redirect URIs in both OAuth providers and your environment variables.

## 4. Testing Authentication

1. Start the development server: `npm run dev`
2. Try signing in with both Google and Apple
3. Check browser console for any errors
4. Verify user data is correctly stored

## 5. Security Considerations

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

## 6. Troubleshooting

### Common Issues:

**Google OAuth Errors:**
- Check that JavaScript origins match exactly
- Ensure Google+ API is enabled
- Verify client ID is correct

**Apple OAuth Errors:**
- Ensure Service ID is properly configured
- Check that return URLs match exactly
- Verify Apple Developer account is active

**General Issues:**
- Check browser console for detailed error messages
- Ensure environment variables are loaded correctly
- Verify OAuth provider configurations

### Debug Mode:
Add this to your `.env` for debugging:
```env
VITE_DEBUG_AUTH=true
```

## 7. Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Apple Sign In Documentation](https://developer.apple.com/documentation/sign_in_with_apple)
- [OAuth 2.0 Security Best Practices](https://tools.ietf.org/html/draft-ietf-oauth-security-topics)