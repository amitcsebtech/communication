const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sign Up User
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered.' });

        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({ message: 'Login successful.', email });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;
