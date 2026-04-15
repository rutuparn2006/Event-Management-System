const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, getDB } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MongoDB
connectDB();

// API Routes
app.get('/api/events', async (req, res) => {
    try {
        const db = getDB();
        const events = await db.collection('events').find().toArray();
        res.json(events);
    } catch (error) {
        // Return sample data if collection is empty
        res.json([
            { id: 1, title: 'Jazz Night', category: 'music', price: 45, emoji: '🎷' },
            { id: 2, title: 'Tech Summit', category: 'tech', price: 199, emoji: '⚡' }
        ]);
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const db = getDB();
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Create new user
        const user = {
            name,
            email,
            password, // In production, hash this!
            role: 'user',
            createdAt: new Date()
        };
        
        const result = await db.collection('users').insertOne(user);
        res.json({ message: 'User created!', userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const db = getDB();
        const users = await db.collection('users').find({}, { projection: { password: 0 } }).toArray();
        res.json(users);
    } catch (error) {
        res.json([]);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});