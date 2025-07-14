import React, { createContext, useContext, useState } from 'react';
import { Book, CollectionRequest } from '../types';

interface DataContextType {
  books: Book[];
  requests: CollectionRequest[];
  addBook: (book: Omit<Book, 'id' | 'createdAt'>) => void;
  updateBookStatus: (bookId: string, status: Book['status']) => void;
  createRequest: (bookId: string, collectorId: string, message?: string) => void;
  updateRequestStatus: (requestId: string, status: CollectionRequest['status']) => void;
  searchBooks: (query: string) => Book[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic Literature',
      condition: 'good',
      description: 'A timeless classic about the American Dream',
      images: ['https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=400'],
      donorId: '1',
      donor: {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
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
      donorId: '2',
      donor: {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@example.com',
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
  ]);

  const [requests, setRequests] = useState<CollectionRequest[]>([]);

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
    };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBookStatus = (bookId: string, status: Book['status']) => {
    setBooks(prev =>
      prev.map(book =>
        book.id === bookId ? { ...book, status } : book
      )
    );
  };

  const createRequest = (bookId: string, collectorId: string, message?: string) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const newRequest: CollectionRequest = {
      id: Math.random().toString(36).substring(7),
      bookId,
      book,
      collectorId,
      collector: {
        id: collectorId,
        name: 'Current User',
        email: 'user@example.com',
        role: 'collector',
        createdAt: new Date(),
      },
      donorId: book.donorId,
      status: 'pending',
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRequests(prev => [...prev, newRequest]);
    updateBookStatus(bookId, 'requested');
  };

  const updateRequestStatus = (requestId: string, status: CollectionRequest['status']) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? { ...request, status, updatedAt: new Date() }
          : request
      )
    );

    if (status === 'approved') {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        updateBookStatus(request.bookId, 'collected');
      }
    }
  };

  const searchBooks = (query: string): Book[] => {
    if (!query.trim()) return books;
    
    return books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.genre.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <DataContext.Provider
      value={{
        books,
        requests,
        addBook,
        updateBookStatus,
        createRequest,
        updateRequestStatus,
        searchBooks,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};