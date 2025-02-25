import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, User, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('tickets');

  const renderTickets = () => (
    <div className="space-y-6">
      {user?.tickets && user.tickets.length > 0 ? (
        user.tickets.map((ticket) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="md:flex">
              <div className="md:w-1/3">
                <img
                  src={ticket.event.image}
                  alt={ticket.event.title}
                  className="h-48 w-full object-cover md:h-full"
                />
              </div>
              <div className="p-6 md:w-2/3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {ticket.event.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{ticket.event.date} at {ticket.event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Ticket className="w-4 h-4 mr-2" />
                      <span className="capitalize">{ticket.type} Ticket × {ticket.quantity}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>Transaction Hash: {ticket.transactionHash || 'N/A'}</p>
                      <p>Purchase Date: {new Date(ticket.purchaseDate).toLocaleDateString()}</p>
                      <p>Total Amount: ${ticket.totalPrice}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <QRCodeSVG
                      value={JSON.stringify({
                        ticketId: ticket.id,
                        eventId: ticket.eventId,
                        type: ticket.type,
                        quantity: ticket.quantity,
                        purchaseDate: ticket.purchaseDate
                      })}
                      size={120}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="space-x-4">
                    <button 
                      onClick={() => window.print()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Download PDF
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-12">
          <Ticket className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by browsing available events.</p>
          <div className="mt-6">
            <Link
              to="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Events
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            defaultValue={user?.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            defaultValue={user?.email}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        {user?.address && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
            <input
              type="text"
              defaultValue={user.address}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
            />
          </div>
        )}
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'tickets'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Ticket className="w-5 h-5 mr-3" />
                  My Tickets
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'tickets' && renderTickets()}
              {activeTab === 'profile' && renderProfile()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;