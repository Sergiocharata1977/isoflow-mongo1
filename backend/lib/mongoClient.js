// backend/lib/mongoClient.js
import { MongoClient } from 'mongodb';

// Retrieve the MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI environment variable is not defined.');
  process.exit(1); // Exit the process if the URI is not set
}

// Create a new MongoClient instance with specific options
const client = new MongoClient(uri, {
  serverApi: { // Recommended to ensure API version compatibility
    version: '1', // Specify API version 1
    strict: true,
    deprecationErrors: true,
  }
});

let db;

/**
 * Connects to the MongoDB database.
 * Call this function once when your application starts.
 */
async function connectDB() {
  if (db) return db; // Return existing connection if already connected
  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas!');
    // You can specify the database name here if it's part of your MONGODB_URI or define it separately
    // For example, if your URI is "mongodb+srv://user:pass@cluster.mongodb.net/myDatabase?retryWrites=true&w=majority"
    // The client will connect to 'myDatabase'.
    // If the database name is not in the URI, you can specify it:
    // db = client.db('yourDatabaseName');
    // For now, let's assume the database name is part of the URI or you'll select it later.
    // If your connection string doesn't include the database name, you'll need to specify it like:
    // db = client.db("isoflow3"); // Or whatever your database name is
    // For now, we'll get the default database from the connection string.
    // If no database is specified in the connection string, client.db() will use the 'test' database by default.
    // It's better to explicitly set the database.
    // Let's assume your database is named 'isoflow3' as per your Atlas screenshot.
    db = client.db("isoflow3"); // Using the existing lowercase db name
    console.log(`[mongoClient] Attempting to use database: ${db.databaseName}`);
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit if connection fails
  }
}

/**
 * Returns the database instance.
 * Ensure connectDB() has been called and resolved before calling this.
 * @returns {Db} The MongoDB database instance.
 */
function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

/**
 * Closes the MongoDB connection.
 * Call this when your application is shutting down.
 */
async function closeDB() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

export { connectDB, getDB, closeDB, client as mongoClientInstance }; // Export client instance if direct access is needed
