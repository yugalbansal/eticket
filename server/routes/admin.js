import express from 'express';
import Ticket from '../models/Ticket.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// Get all tickets (admin only)
router.get('/tickets', [auth, admin], async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('userId', 'name email');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get ticket statistics (admin only)
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const activeTickets = await Ticket.countDocuments({ status: 'active' });
    const totalRevenue = await Ticket.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    res.json({
      totalTickets,
      activeTickets,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;