import { User, Book, CollectionRequest } from '../types';

const STORAGE_KEYS = {
  USERS: 'bookshare_users',
  CURRENT_USER: 'bookshare_current_user',
  BOOKS: 'bookshare_books',
  REQUESTS: 'bookshare_requests',
};

class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // User Management
  getAllUsers(): User[] {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  registerUser(username: string, password: string, role: 'donor' | 'collector'): User | null {
    const users = this.getAllUsers();

    if (users.find(u => u.email === username)) {
      return null;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: username,
      email: username,
      role,
      password: btoa(password),
      createdAt: new Date(),
    };

    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  loginUser(username: string, password: string): User | null {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === username && u.password === btoa(password));

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
      return userWithoutPassword as User;
    }

    return null;
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  }

  logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Books Management
  getAllBooks(): Book[] {
    const books = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!books) return [];

    return JSON.parse(books).map((book: any) => ({
      ...book,
      createdAt: new Date(book.createdAt),
      donor: {
        ...book.donor,
        createdAt: new Date(book.donor.createdAt)
      }
    }));
  }

  saveBooks(books: Book[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  }

  addBook(book: Book): void {
    const books = this.getAllBooks();
    books.push(book);
    this.saveBooks(books);
  }

  updateBook(bookId: string, updates: Partial<Book>): void {
    const books = this.getAllBooks();
    const index = books.findIndex(b => b.id === bookId);
    if (index !== -1) {
      books[index] = { ...books[index], ...updates };
      this.saveBooks(books);
    }
  }

  // Requests Management
  getAllRequests(): CollectionRequest[] {
    const requests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (!requests) return [];

    return JSON.parse(requests).map((req: any) => ({
      ...req,
      createdAt: new Date(req.createdAt),
      updatedAt: new Date(req.updatedAt),
      book: {
        ...req.book,
        createdAt: new Date(req.book.createdAt),
        donor: {
          ...req.book.donor,
          createdAt: new Date(req.book.donor.createdAt)
        }
      },
      collector: {
        ...req.collector,
        createdAt: new Date(req.collector.createdAt)
      }
    }));
  }

  saveRequests(requests: CollectionRequest[]): void {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }

  addRequest(request: CollectionRequest): void {
    const requests = this.getAllRequests();
    requests.push(request);
    this.saveRequests(requests);
  }

  updateRequest(requestId: string, updates: Partial<CollectionRequest>): void {
    const requests = this.getAllRequests();
    const index = requests.findIndex(r => r.id === requestId);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates };
      this.saveRequests(requests);
    }
  }

  // Image Management
  saveImage(imageData: string, userId: string, bookId: string): string {
    const imageKey = `bookshare_image_${userId}_${bookId}_${Date.now()}`;
    localStorage.setItem(imageKey, imageData);
    return imageKey;
  }

  getImage(imageKey: string): string | null {
    return localStorage.getItem(imageKey);
  }

  // Initialize with sample data if empty
  initializeSampleData(): void {
    if (this.getAllBooks().length === 0) {
      const sampleBooks: Book[] = [
        {
          id: '1',
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'Classic Literature',
          condition: 'good',
          description: 'A timeless classic about the American Dream',
          images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'],
          donorId: 'sample1',
          donor: {
            id: 'sample1',
            name: 'Sample Donor',
            email: 'donor@example.com',
            role: 'donor',
            createdAt: new Date(),
          },
          location: {
            lat: 40.7128,
            lng: -74.0060,
            address: '123 Main St, New York, NY 10001',
          },
          status: 'available',
          createdAt: new Date(),
        },
        {
          id: '2',
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          genre: 'Fiction',
          condition: 'excellent',
          description: 'A gripping tale of racial injustice and childhood',
          images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'],
          donorId: 'sample1',
          donor: {
            id: 'sample1',
            name: 'Sample Donor',
            email: 'donor@example.com',
            role: 'donor',
            createdAt: new Date(),
          },
          location: {
            lat: 40.7589,
            lng: -73.9851,
            address: '456 Park Ave, New York, NY 10022',
          },
          status: 'available',
          createdAt: new Date(),
        },
      ];
      this.saveBooks(sampleBooks);
    }
  }
}

export const storageService = StorageService.getInstance();
