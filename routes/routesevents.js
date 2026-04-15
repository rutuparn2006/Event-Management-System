#routes/events.js
const express = require('express');
const router = express.Router();
const EventModel = require('../models/Event');
const { authenticateToken } = require('../middleware/auth');
const { ObjectId } = require('mongodb');

router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        const events = await EventModel.findAll({ category, search });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organizerId: new ObjectId(req.user.id)
        };
        const event = await EventModel.create(eventData);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        await EventModel.update(req.params.id, req.body);
        res.json({ message: 'Event updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await EventModel.delete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;