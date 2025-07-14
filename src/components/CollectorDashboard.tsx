import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Search, BookOpen, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import SearchBooks from './SearchBooks';

const CollectorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { requests } = useData();

  const myRequests = requests.filter(request => request.collectorId === user?.id);

  const stats = {
    totalRequests: myRequests.length,
    pendingRequests: myRequests.filter(request => request.status === 'pending').length,
    approvedRequests: myRequests.filter(request => request.status === 'approved').length,
    completedCollections: myRequests.filter(request => request.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collector Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
            <MessageCircle className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingRequests}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedRequests}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Collected</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completedCollections}</p>
            </div>
            <BookOpen className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {myRequests.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Requests</h2>
          <div className="space-y-4">
            {myRequests.map(request => (
              <div key={request.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{request.book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {request.book.author} • Requested {request.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Donor: {request.book.donor.name}
                    </p>
                    {request.message && (
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mb-3">
                        Your message: "{request.message}"
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {request.status}
                      </span>
                      {request.status === 'approved' && (
                        <p className="text-sm text-green-600 font-medium">
                          Ready for pickup at: {request.book.location.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SearchBooks />
    </div>
  );
};

export default CollectorDashboard;