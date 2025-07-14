import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Plus, BookOpen, Clock, CheckCircle, Users } from 'lucide-react';
import BookForm from './BookForm';
import BookCard from './BookCard';

const DonorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { books, requests, updateRequestStatus } = useData();
  const [showBookForm, setShowBookForm] = useState(false);

  const myBooks = books.filter(book => book.donorId === user?.id);
  const myRequests = requests.filter(request => request.donorId === user?.id);

  const stats = {
    totalBooks: myBooks.length,
    availableBooks: myBooks.filter(book => book.status === 'available').length,
    completedCollections: myBooks.filter(book => book.status === 'collected').length,
    pendingRequests: myRequests.filter(request => request.status === 'pending').length,
  };

  const handleRequestAction = (requestId: string, action: 'approved' | 'rejected') => {
    updateRequestStatus(requestId, action);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={() => setShowBookForm(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Share Book
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.availableBooks}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Collected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedCollections}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {myRequests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Collection Requests</h2>
          <div className="space-y-4">
            {myRequests.map(request => (
              <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{request.book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Requested by {request.collector.name} • {request.createdAt.toLocaleDateString()}
                    </p>
                    {request.message && (
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mb-3">
                        "{request.message}"
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                  {request.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleRequestAction(request.id, 'approved')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'rejected')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Books</h2>
        {myBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books shared yet</h3>
            <p className="text-gray-600 mb-4">Start sharing your books with the community!</p>
            <button
              onClick={() => setShowBookForm(true)}
              className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Share Your First Book
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBooks.map(book => (
              <BookCard key={book.id} book={book} showActions={false} />
            ))}
          </div>
        )}
      </div>

      {showBookForm && <BookForm onClose={() => setShowBookForm(false)} />}
    </div>
  );
};

export default DonorDashboard;