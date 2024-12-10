const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');

// Send Message
router.post('/', async (req, res) => {
    const { sender, receiver, message } = req.body;
    try {
        const chat = new Chat({ sender, receiver, message });
        await chat.save();
        res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

// Get Messages Between Two Users
router.get('/:user1/:user2', async (req, res) => {
    const { user1, user2 } = req.params;
    try {
        const chats = await Chat.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        }).sort('timestamp');
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error.' });
    }
});

module.exports = router;
