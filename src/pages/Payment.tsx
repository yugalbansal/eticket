// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Calendar, MapPin, Users, Crown, Ticket } from 'lucide-react';
// import { useEventStore } from '../store/eventStore';
// import { useAuthStore } from '../store/authStore';
// import { makePaymentWithTelos } from '../utils/web3';
// import { initializeRazorpay } from '../utils/razorpay';
// import toast from 'react-hot-toast';
// import QRCode from 'qrcode.react';

// const RECEIVER_ADDRESS = '0xF5FeFBf4eE405d61eFa05870357ca86b14196462';

// const Payment = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { events } = useEventStore();
//   const { isAuthenticated, user, addTicket } = useAuthStore();
//   const [selectedTicket, setSelectedTicket] = useState('general');
//   const [quantity, setQuantity] = useState(1);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [ticketData, setTicketData] = useState<any>(null);

//   const event = events.find(e => e.id === id);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       toast.error('Please login to continue');
//       navigate('/login');
//     }
//   }, [isAuthenticated, navigate]);

//   if (!event) {
//     return <div>Event not found</div>;
//   }

//   const handlePaymentSuccess = async (txHash?: string) => {
//     const newTicket = {
//       id: `ticket_${Date.now()}`,
//       eventId: event.id,
//       type: selectedTicket,
//       quantity: quantity,
//       totalPrice: event.price[selectedTicket as keyof typeof event.price] * quantity,
//       purchaseDate: new Date().toISOString(),
//       transactionHash: txHash,
//       event: {
//         title: event.title,
//         date: event.date,
//         time: event.time,
//         venue: event.venue,
//         image: event.image,
//       },
//     };

//     try {
//       await addTicket(newTicket);
//       setTicketData(newTicket);
//       toast.success('Ticket purchased successfully!');
//     } catch (error) {
//       console.error('Failed to save ticket:', error);
//       toast.error('Failed to save ticket details');
//     }
//   };

//   const handlePaymentWithTelos = async () => {
//     if (!isAuthenticated) {
//       toast.error('Please login first');
//       navigate('/login');
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const amount = event.price[selectedTicket as keyof typeof event.price] * quantity;
//       const txHash = await makePaymentWithTelos(amount, RECEIVER_ADDRESS);
//       await handlePaymentSuccess(txHash);
//     } catch (error: any) {
//       console.error('Payment failed:', error);
//       toast.error(error.message || 'Payment failed. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handlePaymentWithRazorpay = async () => {
//     if (!isAuthenticated) {
//       toast.error('Please login first');
//       navigate('/login');
//       return;
//     }

//     setIsProcessing(true);
//     try {
//       const amount = event.price[selectedTicket as keyof typeof event.price] * quantity * 100;
      
//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount,
//         currency: 'INR',
//         name: 'EventTix',
//         description: `Tickets for ${event.title}`,
//         handler: function () {
//           handlePaymentSuccess();
//         },
//         prefill: {
//           email: user?.email,
//           contact: '',
//         },
//         theme: {
//           color: '#4F46E5',
//         },
//       };

//       const rzp = await initializeRazorpay(options);
//       rzp.open();
//     } catch (error) {
//       console.error('Payment failed:', error);
//       toast.error('Payment failed. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (ticketData) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-2xl mx-auto px-4">
//           <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//             <div className="p-8">
//               <h2 className="text-2xl font-bold text-center mb-6">Ticket Confirmation</h2>
              
//               <div className="flex justify-center mb-6">
//                 <QRCode
//                   value={JSON.stringify({
//                     ticketId: ticketData.id,
//                     eventId: ticketData.eventId,
//                     type: ticketData.type,
//                     quantity: ticketData.quantity,
//                     purchaseDate: ticketData.purchaseDate,
//                     transactionHash: ticketData.transactionHash
//                   })}
//                   size={200}
//                   level="H"
//                 />
//               </div>

//               <div className="space-y-4">
//                 <div className="flex justify-between">
//                   <span className="font-semibold">Event:</span>
//                   <span>{ticketData.event.title}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-semibold">Date & Time:</span>
//                   <span>{ticketData.event.date} at {ticketData.event.time}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-semibold">Venue:</span>
//                   <span>{ticketData.event.venue}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-semibold">Ticket Type:</span>
//                   <span className="capitalize">{ticketData.type}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-semibold">Quantity:</span>
//                   <span>{ticketData.quantity}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="font-semibold">Total Amount:</span>
//                   <span>${ticketData.totalPrice}</span>
//                 </div>
//                 {ticketData.transactionHash && (
//                   <div className="flex justify-between">
//                     <span className="font-semibold">Transaction Hash:</span>
//                     <a 
//                       href={`https://testnet.teloscan.io/tx/${ticketData.transactionHash}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-indigo-600 hover:text-indigo-800 text-sm truncate max-w-xs"
//                     >
//                       {ticketData.transactionHash}
//                     </a>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-8 flex justify-center space-x-4">
//                 <button
//                   onClick={() => window.print()}
//                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//                 >
//                   Download PDF
//                 </button>
//                 <button
//                   onClick={() => navigate('/dashboard')}
//                   className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Go to Dashboard
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <div className="md:flex">
//             {/* Event Details */}
//             <div className="md:w-1/2 p-8">
//               <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>
              
//               <div className="flex items-center text-gray-600 mb-4">
//                 <Calendar className="w-5 h-5 mr-2" />
//                 <span>{event.date} at {event.time}</span>
//               </div>
              
//               <div className="flex items-center text-gray-600 mb-6">
//                 <MapPin className="w-5 h-5 mr-2" />
//                 <span>{event.venue}</span>
//               </div>

//               <div className="space-y-4 mb-8">
//                 <h3 className="text-lg font-semibold text-gray-900">Select Ticket Type</h3>
//                 {Object.entries(event.price).map(([type, price]) => (
//                   <button
//                     key={type}
//                     onClick={() => setSelectedTicket(type)}
//                     className={`w-full flex items-center justify-between p-4 rounded-lg border ${
//                       selectedTicket === type
//                         ? 'border-indigo-600 bg-indigo-50'
//                         : 'border-gray-200 hover:border-indigo-600'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       {type === 'vip' ? (
//                         <Crown className="w-5 h-5 mr-2 text-indigo-600" />
//                       ) : type === 'group' ? (
//                         <Users className="w-5 h-5 mr-2 text-indigo-600" />
//                       ) : (
//                         <Ticket className="w-5 h-5 mr-2 text-indigo-600" />
//                       )}
//                       <span className="capitalize">{type} Ticket</span>
//                     </div>
//                     <span className="font-semibold">${price.toFixed(2)}</span>
//                   </button>
//                 ))}
//               </div>

//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
//                 <div className="flex items-center space-x-4">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="p-2 rounded-md border border-gray-200 hover:border-indigo-600"
//                   >
//                     -
//                   </button>
//                   <span className="text-xl font-semibold">{quantity}</span>
//                   <button
//                     onClick={() => setQuantity(quantity + 1)}
//                     className="p-2 rounded-md border border-gray-200 hover:border-indigo-600"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Section */}
//             <div className="md:w-1/2 bg-gray-50 p-8">
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Ticket Price</span>
//                     <span>${event.price[selectedTicket as keyof typeof event.price].toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Quantity</span>
//                     <span>{quantity}</span>
//                   </div>
//                   <div className="border-t border-gray-200 pt-2 mt-2">
//                     <div className="flex justify-between text-lg font-semibold">
//                       <span>Total Amount</span>
//                       <span>
//                         ${(event.price[selectedTicket as keyof typeof event.price] * quantity).toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <button
//                   onClick={handlePaymentWithTelos}
//                   disabled={isProcessing}
//                   className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isProcessing ? 'Processing...' : 'Pay with Telos'}
//                 </button>
//                 <button
//                   onClick={handlePaymentWithRazorpay}
//                   disabled={isProcessing}
//                   className="w-full py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Crown, Ticket } from 'lucide-react';
import { useEventStore } from '../store/eventStore';
import { useAuthStore } from '../store/authStore';
import { makePaymentWithTelos } from '../utils/web3';
import { initializeRazorpay } from '../utils/razorpay';
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
      toast.success('Ticket purchased successfully!');
    } catch (error) {
      console.error('❌ Failed to save ticket:', error);
      toast.error('Failed to save ticket details');
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
      const txHash = await makePaymentWithTelos(amount, RECEIVER_ADDRESS);
      await handlePaymentSuccess(txHash);
    } catch (error: any) {
      console.error('❌ Payment failed:', error);
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
        description: `Tickets for ${event.title}`,
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
      console.error('❌ Payment failed:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (ticketData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">🎟️ Ticket Confirmation</h2>

              <div className="flex justify-center mb-6">
                <QRCode
                  value={JSON.stringify({
                    ticketId: ticketData.id,
                    eventId: ticketData.eventId,
                    type: ticketData.type,
                    quantity: ticketData.quantity,
                    purchaseDate: ticketData.purchaseDate,
                    transactionHash: ticketData.transactionHash
                  })}
                  size={200}
                  level="H"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Event:</span>
                  <span>{ticketData.event.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Date & Time:</span>
                  <span>{ticketData.event.date} at {ticketData.event.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Venue:</span>
                  <span>{ticketData.event.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Ticket Type:</span>
                  <span className="capitalize">{ticketData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Quantity:</span>
                  <span>{ticketData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount:</span>
                  <span>${ticketData.totalPrice}</span>
                </div>
                {ticketData.transactionHash && (
                  <div className="flex justify-between">
                    <span className="font-semibold">Transaction Hash:</span>
                    <a 
                      href={`https://testnet.teloscan.io/tx/${ticketData.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm truncate max-w-xs"
                    >
                      {ticketData.transactionHash}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-center space-x-4">
                <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Download PDF
                </button>
                <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            </div>

            {/* Payment Section */}
            <div className="md:w-1/2 bg-gray-50 p-8">
              <button onClick={handlePaymentWithTelos} disabled={isProcessing} className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
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
