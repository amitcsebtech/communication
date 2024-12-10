const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017/chatapp';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
