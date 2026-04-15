const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://<db_username>:<db_password>@rbcluster.ckjovil.mongodb.net/ ";

async function testConnection() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB!");
        
        const db = client.db('eventdb');
        
        // Create a test collection
        const result = await db.collection('test').insertOne({
            message: "Hello MongoDB!",
            timestamp: new Date()
        });
        console.log("✅ Test document inserted:", result.insertedId);
        
        // Read it back
        const doc = await db.collection('test').findOne({ _id: result.insertedId });
        console.log("✅ Retrieved:", doc);
        
    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await client.close();
    }
}

testConnection();