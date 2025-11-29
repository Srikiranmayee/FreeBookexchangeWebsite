import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CollectionRequest } from '../types';
import { storageService } from '../services/storageService';

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
  const [books, setBooks] = useState<Book[]>([]);
  const [requests, setRequests] = useState<CollectionRequest[]>([]);

  useEffect(() => {
    setBooks(storageService.getAllBooks());
    setRequests(storageService.getAllRequests());
  }, []);

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt'>) => {
    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    storageService.addBook(newBook);
    setBooks(storageService.getAllBooks());
  };

  const updateBookStatus = (bookId: string, status: Book['status']) => {
    storageService.updateBook(bookId, { status });
    setBooks(storageService.getAllBooks());
  };

  const createRequest = (bookId: string, collectorId: string, message?: string) => {
    const allBooks = storageService.getAllBooks();
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;

    const currentUser = storageService.getCurrentUser();
    if (!currentUser) return;

    const newRequest: CollectionRequest = {
      id: Date.now().toString(),
      bookId,
      book,
      collectorId,
      collector: currentUser,
      donorId: book.donorId,
      status: 'pending',
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    storageService.addRequest(newRequest);
    updateBookStatus(bookId, 'requested');
    setRequests(storageService.getAllRequests());
  };

  const updateRequestStatus = (requestId: string, status: CollectionRequest['status']) => {
    storageService.updateRequest(requestId, { status, updatedAt: new Date() });
    setRequests(storageService.getAllRequests());

    if (status === 'approved') {
      const allRequests = storageService.getAllRequests();
      const request = allRequests.find(r => r.id === requestId);
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
