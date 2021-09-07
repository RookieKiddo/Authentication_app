require('dotenv').config({path: "./config.env"});

const express = require('express');
const connectDB = require('./config/db.js');
const errorHandler = require('./middleware/error.js');

// Connect DB
connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/private', require('./routes/private.js'));

// Error Handler (Should always be last piece of middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server Running on Port : ${PORT}`));

process.on('unhandledRejection', (err, promise) => {
    console.log(`Logged Error: ${err.message}`);
    server.close(() => process.exit(1));
})