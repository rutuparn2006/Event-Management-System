#user.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const UserModel = {
    async create(userData) {
        const db = getDB();
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            role: userData.role || 'user',
            bio: userData.bio || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('users').insertOne(user);
        const { password, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, _id: result.insertedId };
    },

    async findByEmail(email) {
        const db = getDB();
        return await db.collection('users').findOne({ email });
    },

    async findById(id) {
        const db = getDB();
        return await db.collection('users').findOne(
            { _id: new ObjectId(id) },
            { projection: { password: 0 } }
        );
    },

    async update(id, updateData) {
        const db = getDB();
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );
        return result.modifiedCount > 0;
    },

    async findAll() {
        const db = getDB();
        return await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
    }
};

module.exports = UserModel;