const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();


app.use((req, res, next) => {
    const origin = req.headers.origin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'EBI service API is running',
        database: global.__dbConnected ? 'connected' : 'degraded',
    });
});

app.use('/api', routes);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
    global.__dbConnected = await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Database status: ${global.__dbConnected ? 'connected' : 'degraded mode'}`);
    });
};

startServer();
