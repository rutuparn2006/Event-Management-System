#models.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');

const EventModel = {
    async create(eventData) {
        const db = getDB();
        const event = {
            ...eventData,
            booked: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const result = await db.collection('events').insertOne(event);
        return { ...event, _id: result.insertedId };
    },

    async findAll(filters = {}) {
        const db = getDB();
        const query = {};
        
        if (filters.category && filters.category !== 'all') {
            query.category = filters.category;
        }
        if (filters.search) {
            query.$or = [
                { title: { $regex: filters.search, $options: 'i' } },
                { city: { $regex: filters.search, $options: 'i' } }
            ];
        }
        
        return await db.collection('events').find(query).toArray();
    },

    async findById(id) {
        const db = getDB();
        return await db.collection('events').findOne({ _id: new ObjectId(id) });
    },

    async update(id, updateData) {
        const db = getDB();
        const result = await db.collection('events').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );
        return result.modifiedCount > 0;
    },

    async delete(id) {
        const db = getDB();
        const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    },

    async updateBookedCount(id, increment) {
        const db = getDB();
        const result = await db.collection('events').updateOne(
            { _id: new ObjectId(id) },
            { $inc: { booked: increment } }
        );
        return result.modifiedCount > 0;
    }
};

module.exports = EventModel;