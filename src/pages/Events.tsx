import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import EventCard from '../components/EventCard';
import { useEventStore } from '../store/eventStore';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Concert', 'Comedy', 'Sports', 'Theater', 'Festival'];

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { events, loading, error } = useEventStore();

  const filteredEvents = events.filter(event => {
    // Category filtering
    const matchesCategory = selectedCategory === 'All' || 
      event.category.toLowerCase() === selectedCategory.toLowerCase();
    
    // Search filtering
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      event.title.toLowerCase().includes(searchLower) ||
      event.venue.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center bg-gray-50 rounded-lg p-2">
              <Search className="w-5 h-5 text-gray-400 ml-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, venues, or artists..."
                className="w-full px-4 py-2 bg-transparent text-gray-900 focus:outline-none"
              />
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-1 bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories and Events */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center space-x-4 mb-12 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;