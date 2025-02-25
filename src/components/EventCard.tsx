import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { Event } from '../types';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/payment/${event.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-[1.02]">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white">
          <Heart className="w-5 h-5 text-red-500" />
        </button>
      </div>
      
      <div className="p-5">
        <div className="flex items-center space-x-1 text-sm text-indigo-600 mb-2">
          <Calendar className="w-4 h-4" />
          <span>{event.date}</span>
          <span>•</span>
          <span>{event.time}</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{event.venue}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Starting from</p>
            <p className="text-lg font-bold text-gray-900">
              ${event.price.general}
            </p>
          </div>
          
          <button
            onClick={handleBookNow}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;