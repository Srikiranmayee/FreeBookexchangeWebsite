export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'donor' | 'collector';
  password?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  images: string[];
  donorId: string;
  donor: User;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'available' | 'requested' | 'collected';
  createdAt: Date;
}

export interface CollectionRequest {
  id: string;
  bookId: string;
  book: Book;
  collectorId: string;
  collector: User;
  donorId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}