import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Share2, Heart, Users, Crown, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import { makePaymentWithTelos } from '../utils/web3';
import { initializeRazorpay } from '../utils/razorpay';
import { useAuthStore } from '../store/authStore';

const MOCK_EVENT = {
  id: '1',
  title: 'Summer Music Festival 2024',
  description: 'Experience the biggest music festival of the year featuring top artists from around the world. Get ready for an unforgettable day of music, food, and fun!',
  date: '2024-07-15',
  time: '14:00',
  venue: 'Central Park, NY',
  category: 'festival',
  price: {
    general: 0.99,
    vip: 2.99,
    earlyBird: 0.79,
    group: 0.89
  },
  image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
  organizer: {
    name: 'Festival Productions Inc.',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' // Example Telos testnet address
  },
  status: 'upcoming',
  availableTickets: {
    general: 1000,
    vip: 100,
    earlyBird: 50,
    group: 200
  }
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, addTicket } = useAuthStore();
  const [selectedTicket, setSelectedTicket] = useState('general');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: MOCK_EVENT.title,
        text: MOCK_EVENT.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handlePaymentSuccess = () => {
    const newTicket = {
      id: `ticket_${Date.now()}`,
      eventId: MOCK_EVENT.id,
      type: selectedTicket,
      quantity: quantity,
      totalPrice: MOCK_EVENT.price[selectedTicket as keyof typeof MOCK_EVENT.price] * quantity,
      purchaseDate: new Date().toISOString(),
      event: {
        title: MOCK_EVENT.title,
        date: MOCK_EVENT.date,
        time: MOCK_EVENT.time,
        venue: MOCK_EVENT.venue,
        image: MOCK_EVENT.image,
      },
    };

    addTicket(newTicket);
    toast.success('Ticket purchased successfully!');
    navigate('/dashboard');
  };

  const handlePaymentWithTelos = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (quantity <= 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    setIsProcessing(true);
    try {
      const amount = MOCK_EVENT.price[selectedTicket as keyof typeof MOCK_EVENT.price] * quantity;
      const txHash = await makePaymentWithTelos(amount, MOCK_EVENT.organizer.address);
      console.log('Transaction hash:', txHash);
      handlePaymentSuccess();
    } catch (error: any) {
      console.error('Payment failed:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentWithRazorpay = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    if (quantity <= 0) {
      toast.error('Please select at least one ticket');
      return;
    }

    setIsProcessing(true);
    try {
      const amount = MOCK_EVENT.price[selectedTicket as keyof typeof MOCK_EVENT.price] * quantity * 100;
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'EventTix',
        description: `Tickets for ${MOCK_EVENT.title}`,
        handler: function () {
          handlePaymentSuccess();
        },
        prefill: {
          email: user?.email,
          contact: '',
        },
        theme: {
          color: '#4F46E5',
        },
      };

      const rzp = await initializeRazorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={MOCK_EVENT.image}
              alt={MOCK_EVENT.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 space-x-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white">
                <Heart className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center space-x-2 text-sm text-indigo-600 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{MOCK_EVENT.date}</span>
              <span>•</span>
              <span>{MOCK_EVENT.time}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{MOCK_EVENT.title}</h1>

            <div className="flex items-center text-gray-600 mb-6">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{MOCK_EVENT.venue}</span>
            </div>

            <p className="text-gray-600 mb-8">{MOCK_EVENT.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Ticket Type</h3>
                <div className="space-y-2">
                  {Object.entries(MOCK_EVENT.price).map(([type, price]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedTicket(type)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border ${
                        selectedTicket === type
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-600'
                      }`}
                    >
                      <div className="flex items-center">
                        {type === 'vip' ? (
                          <Crown className="w-5 h-5 mr-2 text-indigo-600" />
                        ) : type === 'group' ? (
                          <Users className="w-5 h-5 mr-2 text-indigo-600" />
                        ) : (
                          <Ticket className="w-5 h-5 mr-2 text-indigo-600" />
                        )}
                        <span className="capitalize">{type} Ticket</span>
                      </div>
                      <span className="font-semibold">${price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-md border border-gray-200 hover:border-indigo-600"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-md border border-gray-200 hover:border-indigo-600"
                  >
                    +
                  </button>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between text-lg font-semibold mb-4">
                    <span>Total Amount:</span>
                    <span>${(MOCK_EVENT.price[selectedTicket as keyof typeof MOCK_EVENT.price] * quantity).toFixed(2)}</span>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handlePaymentWithTelos}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing...' : 'Pay with Telos'}
                    </button>
                    <button
                      onClick={handlePaymentWithRazorpay}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;