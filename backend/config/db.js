const mongoose = require('mongoose');

const mongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected successfully to ${conn.connection.host}`);
    } catch (error) {
        console.log(`connection failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = mongoDB;
