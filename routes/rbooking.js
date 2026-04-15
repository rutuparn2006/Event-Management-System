#rbooking.js
const express = require('express');
const router = express.Router();
const BookingModel = require('../models/Booking');
const EventModel = require('../models/Event');
const { authenticateToken } = require('../middleware/auth');

router.get('/my-bookings', authenticateToken, async (req, res) => {
    try {
        const bookings = await BookingModel.findByUserId(req.user.id);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { eventId, tickets, totalPaid } = req.body;
        const event = await EventModel.findById(eventId);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        const seatsLeft = event.capacity - event.booked;
        if (seatsLeft < tickets) {
            return res.status(400).json({ error: 'Not enough seats available' });
        }
        
        const booking = await BookingModel.create({
            userId: req.user.id,
            eventId,
            tickets,
            totalPaid
        });
        
        await EventModel.updateBookedCount(eventId, tickets);
        
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;