import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true, // Should be hashed in production
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { bufferCommands: false }); // Throw error instantly if not connected

// Delete existing model to prevent stale model reuse during HMR
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.User) {
        delete mongoose.models.User;
    }
}

// Prevent OverwriteModelError
export default mongoose.models.User || mongoose.model('User', UserSchema);
