import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['general', 'vip', 'earlyBird', 'group'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'used', 'refunded', 'cancelled'],
    default: 'active'
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Ticket', ticketSchema);