import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Enable Query Logging
mongoose.set('debug', true);

async function connectToDatabase() {
    // 1. If already connected, use it.
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // 2. If connecting, wait for it.
    if (mongoose.connection.readyState === 2) {
        console.log('⏳ MongoDB connecting...');
        await new Promise(resolve => mongoose.connection.once('connected', resolve));
        return mongoose.connection;
    }

    // 3. Connect (Mongoose handles pool internally)
    try {
        console.log('🔌 Connecting to MongoDB (Simple Mode)...');
        await mongoose.connect(MONGODB_URI!, {
            bufferCommands: true,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ MongoDB Connected');
        return mongoose.connection;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        throw error;
    }
}

export default connectToDatabase;
