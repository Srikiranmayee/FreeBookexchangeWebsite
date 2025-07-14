# BookShare - Book Sharing Platform

A modern book sharing platform with simulated social authentication, allowing users to donate and collect books within their community.

## Features

- **Demo Authentication**: Simulated Google and Apple sign-in for demonstration
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

### 2. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

1. **Login**: Click either "Continue with Google" or "Continue with Apple" (both are simulated for demo purposes)
2. **Choose Role**: Select whether you want to be a book donor or collector
3. **Start Sharing**: 
   - **Donors**: Upload books with photos and pickup locations
   - **Collectors**: Search and request books from the community

## Authentication System

This platform uses **simulated authentication** for demonstration purposes:

- No real OAuth setup required
- Works out of the box for anyone
- Simulates Google and Apple login flows
- Creates demo user accounts automatically
- Perfect for testing and demonstration

## Project Structure

```
src/
├── components/          # React components
│   ├── LoginScreen.tsx     # Authentication interface
│   ├── Header.tsx          # Navigation header
│   ├── RoleSelector.tsx    # User role selection
│   ├── BookCard.tsx        # Book display component
│   ├── BookForm.tsx        # Book upload form
│   ├── SearchBooks.tsx     # Book search interface
│   ├── DonorDashboard.tsx  # Donor management panel
│   └── CollectorDashboard.tsx # Collector interface
├── context/             # React Context providers
│   ├── AuthContext.tsx     # Authentication state
│   └── DataContext.tsx     # Application data
├── services/            # Service layer
│   └── authService.ts      # Authentication service
├── types/               # TypeScript type definitions
│   └── index.ts            # Application types
└── App.tsx              # Main application component
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Authentication**: Simulated OAuth flows
- **State Management**: React Context API
- **Build Tool**: Vite with TypeScript support
- **Code Quality**: ESLint, TypeScript strict mode

## Key Features

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

### General Features
- Responsive design for all devices
- Real-time search and filtering
- Intuitive user interface
- Role-based dashboards
- Session persistence
- Error handling and loading states

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding Real Authentication

To integrate real OAuth providers:

1. Replace the simulated auth service with real OAuth SDKs
2. Set up Google Cloud Console and Apple Developer accounts
3. Configure OAuth credentials and redirect URIs
4. Update the authentication service implementation

## Deployment

The application is ready for deployment to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under None Free education project.

## Demo Notice

This is a demonstration platform with simulated authentication. In a production environment, you would integrate real OAuth providers and a backend database system.
