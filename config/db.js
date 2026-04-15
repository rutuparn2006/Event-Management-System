#db.js
const { MongoClient, ServerApiVersion } = require('mongodb');

let db = null;
let client = null;

async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        
        await client.connect();
        db = client.db('eventdb');
        console.log('✅ Connected to MongoDB!');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) throw new Error('Database not connected!');
    return db;
}

module.exports = { connectDB, getDB };