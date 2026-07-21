const mongoose = require('mongoose');

const mongoDB = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ebi-service';

    try {
        if (!process.env.MONGO_URI) {
            console.warn('MONGO_URI not set; using local fallback. The API will continue in degraded mode if MongoDB is unavailable.');
        }

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 30000,
        });

        console.log(`connected successfully to ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.warn(`MongoDB unavailable: ${error.message}`);
        return false;
    }
};

module.exports = mongoDB;
