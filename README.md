# BookShare - Book Sharing Platform

A modern book sharing platform with simple username/password authentication, allowing users to donate and collect books within their community. All data is stored locally in the browser's localStorage, making it perfect for deployment as a static website.

## Features

- **Simple Authentication**: Username and password-based registration and login
- **Dual User Roles**: Book donors and collectors with specialized dashboards
- **Book Management**: Upload books with images and location details
- **Advanced Search**: Filter books by title, author, genre, and condition
- **Request System**: Collectors can request books with donor approval
- **Location-Based**: Address input for book pickup locations
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Static Site Ready**: Perfect for S3, Netlify, Vercel, or GitHub Pages

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

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

## How to Use

1. **Create Account**: Click "Create Account" and choose your username, password, and role
2. **Choose Role**: Select whether you want to be a book donor or collector
3. **Start Sharing**:
   - **Donors**: Upload books with photos and pickup locations
   - **Collectors**: Search and request books from the community

## Data Storage

All data is stored in the browser's localStorage:
- User accounts and authentication
- Books and their details
- Collection requests
- Book images (stored as base64-encoded strings)

The app initializes with sample books to help you get started.

## Deployment

This is a static website that can be deployed to:

### AWS S3
1. Build the project: `npm run build`
2. Upload the `dist` folder contents to your S3 bucket
3. Enable static website hosting on your bucket
4. Set index.html as the index document

### Netlify
1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel
1. Connect your repository
2. Build command: `npm run build`
3. Output directory: `dist`

### GitHub Pages
1. Build the project: `npm run build`
2. Push the `dist` folder to your gh-pages branch

## Project Structure

```
src/
├── components/             # React components
│   ├── LoginScreen.tsx        # Authentication interface
│   ├── Header.tsx             # Navigation header
│   ├── BookCard.tsx           # Book display component
│   ├── BookForm.tsx           # Book upload form
│   ├── SearchBooks.tsx        # Book search interface
│   ├── DonorDashboard.tsx     # Donor management panel
│   └── CollectorDashboard.tsx # Collector interface
├── context/                # React Context providers
│   ├── AuthContext.tsx        # Authentication state management
│   └── DataContext.tsx        # Application data management
├── services/               # Service layer
│   └── storageService.ts      # localStorage management
├── types/                  # TypeScript type definitions
│   └── index.ts               # Application types
└── App.tsx                 # Main application component
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Authentication**: Simple username/password with localStorage
- **State Management**: React Context API
- **Storage**: Browser localStorage
- **Build Tool**: Vite with TypeScript support

## Key Features

### Authentication
- Simple username/password registration
- Secure password encoding (base64)
- Persistent sessions via localStorage
- Proper logout handling

### For Book Donors
- Upload books with multiple photos (base64 encoded)
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

## Browser Compatibility

Works on all modern browsers that support:
- ES2020
- localStorage API
- FileReader API (for image uploads)

## Notes

- All data is stored locally in the browser
- Clearing browser data will reset the application
- Images are stored as base64 strings in localStorage
- Storage limits depend on the browser (typically 5-10MB)

## License

This project is licensed under MIT License - see the LICENSE file for details.
