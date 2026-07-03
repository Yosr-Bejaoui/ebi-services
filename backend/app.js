const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
