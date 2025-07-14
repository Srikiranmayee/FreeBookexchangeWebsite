import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, MapPin } from 'lucide-react';
import BookCard from './BookCard';

const SearchBooks: React.FC = () => {
  const { user } = useAuth();
  const { books, searchBooks, createRequest } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBooks = React.useMemo(() => {
    let result = searchBooks(searchQuery);
    
    if (selectedGenre) {
      result = result.filter(book => book.genre.toLowerCase().includes(selectedGenre.toLowerCase()));
    }
    
    if (selectedCondition) {
      result = result.filter(book => book.condition === selectedCondition);
    }

    return result.filter(book => book.status === 'available');
  }, [searchQuery, selectedGenre, selectedCondition, searchBooks]);

  const handleRequestCollection = (bookId: string) => {
    if (user) {
      createRequest(bookId, user.id, 'Hi, I would like to collect this book. Please let me know when it\'s convenient for pickup.');
    }
  };

  const genres = Array.from(new Set(books.map(book => book.genre)));
  const conditions = ['excellent', 'good', 'fair', 'poor'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">All Conditions</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition} className="capitalize">{condition}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Books {filteredBooks.length > 0 && `(${filteredBooks.length})`}
        </h2>
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
          <MapPin className="w-5 h-5" />
          View on Map
        </button>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onRequestCollection={handleRequestCollection}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBooks;