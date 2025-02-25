import React from 'react';
import { Users, Ticket, TrendingUp, DollarSign, BarChart } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data - replace with actual data from your backend
  const stats = {
    totalUsers: 1234,
    activeUsers: 890,
    soldTickets: 5678,
    revenue: 123456,
    topEvents: [
      { name: 'Summer Music Festival', tickets: 1200 },
      { name: 'Comedy Night', tickets: 800 },
      { name: 'Sports Event', tickets: 600 },
    ],
    frequentBuyers: [
      { name: 'John Doe', purchases: 15 },
      { name: 'Jane Smith', purchases: 12 },
      { name: 'Bob Johnson', purchases: 10 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Users className="w-12 h-12 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Ticket className="w-12 h-12 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Tickets Sold</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.soldTickets}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <TrendingUp className="w-12 h-12 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <DollarSign className="w-12 h-12 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">${stats.revenue}</h3>
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Events */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Events</h2>
            <div className="space-y-4">
              {stats.topEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{event.name}</span>
                  <span className="text-indigo-600 font-semibold">{event.tickets} tickets</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Frequent Buyers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Frequent Buyers</h2>
            <div className="space-y-4">
              {stats.frequentBuyers.map((buyer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{buyer.name}</span>
                  <span className="text-indigo-600 font-semibold">{buyer.purchases} purchases</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;