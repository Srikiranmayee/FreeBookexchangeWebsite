# BookShare - Book Sharing Platform

A modern book sharing platform with real Google OAuth authentication, allowing users to donate and collect books within their community.

## Features

- **Real OAuth Authentication**: Google sign-in integration
- **Dual User Roles**: Book donors and collectors with specialized dashboards
- **Book Management**: Upload books with images and location details
- **Advanced Search**: Filter books by title, author, genre, and condition
- **Request System**: Collectors can request books with donor approval
- **Location-Based**: Address input with map integration ready
- **Responsive Design**: Optimized for mobile, tablet, and desktop

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Authentication

Before running the application, you need to set up OAuth credentials:

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Set up Google OAuth:**
   - Go to [Google Cloud Console](https://console.developers.google.com/)
   - Create a project and enable Google+ API
   - Create OAuth credentials and add your domain
   - Copy the Client ID to your `.env` file

3. **Update your `.env` file:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

For detailed setup instructions, see [SETUP.md](SETUP.md).

### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

1. **Configure OAuth**: Follow the setup guide to configure Google OAuth
2. **Login**: Click "Continue as Donor" or "Continue as Collector" to sign in with Google
3. **Choose Role**: Select whether you want to be a book donor or collector
4. **Start Sharing**: 
   - **Donors**: Upload books with photos and pickup locations
   - **Collectors**: Search and request books from the community

## Authentication System

This platform uses **real Google OAuth authentication**:

- Google OAuth 2.0 integration
- Secure token management
- Automatic token refresh
- Proper session handling

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginScreen.tsx     # OAuth authentication interface
│   ├── Header.tsx          # Navigation header
│   ├── BookCard.tsx        # Book display component
│   ├── BookForm.tsx        # Book upload form
│   ├── SearchBooks.tsx     # Book search interface
│   ├── DonorDashboard.tsx  # Donor management panel
│   └── CollectorDashboard.tsx # Collector interface
├── context/             # React Context providers
│   ├── AuthContext.tsx     # Authentication state management
│   └── DataContext.tsx     # Application data management
├── services/            # Service layer
│   └── authService.ts      # OAuth authentication service
├── config/              # Configuration
│   └── auth.ts            # OAuth configuration
├── types/               # TypeScript type definitions
│   └── index.ts            # Application types
└── App.tsx              # Main application component
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Authentication**: Google OAuth 2.0
- **State Management**: React Context API
- **Build Tool**: Vite with TypeScript support
- **Security**: Secure cookie handling, token refresh

## Key Features

### Authentication
- Real Google OAuth 2.0 integration
- Secure token storage and management
- Automatic token refresh
- Proper logout handling

### For Book Donors
- Upload books with multiple photos
- Set pickup locations and addresses
- Manage collection requests from users
- Track book sharing statistics
- Approve or reject collection requests

### For Book Collectors
- Search books by title, author, or genre
- Filter by condition and availability
- Request books with personal messages
- Track request status and approvals
- View pickup locations for approved requests

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Required environment variables:

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Security Considerations

### Production Deployment
- Use HTTPS for all OAuth redirects
- Implement proper CORS policies
- Add rate limiting for authentication
- Use secure cookie settings
- Implement proper session management

### Token Management
- Automatic token refresh
- Secure token storage
- Proper logout cleanup
- Session expiration handling

## Deployment

The application can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

**Important**: Update OAuth redirect URIs in both Google and Apple consoles to match your production domain.
**Important**: Update OAuth redirect URIs in Google console to match your production domain.

## Troubleshooting

### Common Issues

1. **OAuth Configuration Errors**: Check that client IDs and redirect URIs are correctly configured
2. **CORS Issues**: Ensure your domain is added to OAuth provider settings
3. **Token Expiration**: The app handles token refresh automatically

For detailed troubleshooting, see [SETUP.md](SETUP.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test authentication thoroughly
5. Submit a pull request

## License

This project is licensed under MIT License - see the LICENSE file for details.

## Support

For setup help or issues:
1. Check [SETUP.md](SETUP.md) for detailed configuration instructions
2. Review the troubleshooting section
3. Check browser console for error messages
4. Ensure OAuth providers are correctly configured