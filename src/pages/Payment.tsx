import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Crown, Ticket } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { makePaymentWithTelos } from '../utils/web3';
import toast from 'react-hot-toast';
import QRCode from 'qrcode.react';

const RECEIVER_ADDRESS = '0xF5FeFBf4eE405d61eFa05870357ca86b14196462';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useEventStore();
  const { isAuthenticated, user, addTicket } = useAuthStore();
  const [selectedTicket, setSelectedTicket] = useState('general');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketData, setTicketData] = useState<any>(null);

  const event = events.find(e => e.id === id);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!event) {
    return <div className="text-center text-red-500 text-xl font-bold mt-10">Event not found!</div>;
  }

  const handlePaymentSuccess = async (txHash?: string) => {
    const newTicket = {
      id: `ticket_${Date.now()}`,
      eventId: event.id,
      type: selectedTicket,
      quantity: quantity,
      totalPrice: event.price[selectedTicket as keyof typeof event.price] * quantity,
      purchaseDate: new Date().toISOString(),
      transactionHash: txHash,
      event: {
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        image: event.image,
      },
    };

    try {
      await addTicket(newTicket);
      setTicketData(newTicket);
      toast.success('Ticket purchased successfully! ✅');

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('❌ Failed to save ticket:', error);
      toast.error('Failed to save ticket details.');
    }
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
      
      toast('Waiting for MetaMask confirmation...', { icon: '⏳' });

      const txHash = await makePaymentWithTelos(amount, RECEIVER_ADDRESS);

      if (!txHash) {
        throw new Error('Transaction failed or rejected');
      }

      toast.success('Transaction confirmed! ✅');
      await handlePaymentSuccess(txHash);

    } catch (error: any) {
      console.error('❌ Payment failed:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-semibold">Event:</span>
                <span>{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Date & Time:</span>
                <span>{event.date} at {event.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Venue:</span>
                <span>{event.venue}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Ticket Type:</span>
                <span className="capitalize">{selectedTicket}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span>${(event.price[selectedTicket as keyof typeof event.price] * quantity).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={handlePaymentWithTelos}
                disabled={isProcessing}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Pay with Telos'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
