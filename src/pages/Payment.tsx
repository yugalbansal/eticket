import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Crown, Ticket } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { makePaymentWithTelos } from '../utils/web3';
import { initializeRazorpay } from '../utils/razorpay';
import toast from 'react-hot-toast';

const DEFAULT_RECEIVER_ADDRESS = '0xF5FeFBf4eE405d61eFa05870357ca86b14196462';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useEventStore();
  const { isAuthenticated, user, addTicket } = useAuthStore();
  const [selectedTicket, setSelectedTicket] = useState('general');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const event = events.find(e => e.id === id);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!event) {
    return <div className="text-center text-red-600 font-bold text-xl mt-10">Event not found!</div>;
  }

  const handlePaymentSuccess = () => {
    const newTicket = {
      id: `ticket_${Date.now()}`, // ✅ FIXED SYNTAX ERROR
      eventId: event.id,
      type: selectedTicket,
      quantity,
      totalPrice: event.price[selectedTicket as keyof typeof event.price] * quantity,
      purchaseDate: new Date().toISOString(),
      event: {
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        image: event.image,
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

    setIsProcessing(true);
    try {
      const amount = event.price[selectedTicket as keyof typeof event.price] * quantity;
      const receiverAddress = event.organizerWallet || DEFAULT_RECEIVER_ADDRESS; // ✅ Ensure receiver address
      const txHash = await makePaymentWithTelos(amount, receiverAddress);
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

    setIsProcessing(true);
    try {
      const amount = event.price[selectedTicket as keyof typeof event.price] * quantity * 100;
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'EventTix',
        description: `Tickets for ${event.title}`, // ✅ FIXED STRING INTERPOLATION
        handler: function () {
          handlePaymentSuccess();
        },
        prefill: {
          email: user?.email || '',
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
          <div className="md:flex">
            {/* Event Details */}
            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>
              
              <div className="flex items-center text-gray-600 mb-4">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{event.date} at {event.time}</span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{event.venue}</span>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">Select Ticket Type</h3>
                {Object.entries(event.price).map(([type, price]) => (
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
              </div>
            </div>

            {/* Payment Section */}
            <div className="md:w-1/2 bg-gray-50 p-8">
              <button
                onClick={handlePaymentWithTelos}
                disabled={isProcessing}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay with Telos'}
              </button>
              <button
                onClick={handlePaymentWithRazorpay}
                disabled={isProcessing}
                className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
