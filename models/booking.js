#booking.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const BookingModel = {
    async create(bookingData) {
        const db = getDB();
        const booking = {
            userId: new ObjectId(bookingData.userId),
            eventId: new ObjectId(bookingData.eventId),
            tickets: bookingData.tickets,
            totalPaid: bookingData.totalPaid,
            status: 'confirmed',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('bookings').insertOne(booking);
        return { ...booking, _id: result.insertedId };
    },

    async findByUserId(userId) {
        const db = getDB();
        return await db.collection('bookings')
            .find({ userId: new ObjectId(userId) })
            .toArray();
    },

    async findAll() {
        const db = getDB();
        return await db.collection('bookings').find().toArray();
    },

    async deleteByEventId(eventId) {
        const db = getDB();
        const result = await db.collection('bookings').deleteMany({ eventId: new ObjectId(eventId) });
        return result.deletedCount;
    }
};

module.exports = BookingModel;