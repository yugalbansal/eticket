import express from 'express';
import Ticket from '../models/Ticket.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user's tickets
router.get('/', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.userId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Purchase ticket
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, type, quantity, totalPrice } = req.body;

    const ticket = new Ticket({
      eventId,
      userId: req.user.userId,
      type,
      quantity,
      totalPrice
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update ticket status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;