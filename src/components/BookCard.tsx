import React from 'react';
import { Book, User } from '../types';
import { MapPin, Clock, User as UserIcon } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onRequestCollection?: (bookId: string) => void;
  showActions?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onRequestCollection, showActions = true }) => {
  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'requested':
        return 'bg-yellow-100 text-yellow-800';
      case 'collected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: Book['condition']) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <div className="relative">
        <img
          src={book.images[0]}
          alt={book.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
            {book.status}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(book.condition)}`}>
            {book.condition}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-1">by {book.author}</p>
        <p className="text-sm text-gray-500 mb-4">{book.genre}</p>
        
        <p className="text-gray-700 mb-4 line-clamp-3">{book.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <UserIcon className="w-4 h-4 mr-2" />
            <span>{book.donor.name}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{book.location.address}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{book.createdAt.toLocaleDateString()}</span>
          </div>
        </div>

        {showActions && book.status === 'available' && (
          <button
            onClick={() => onRequestCollection?.(book.id)}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Request Collection
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;