// Maximum user limit
const MAX_USERS = 5;

// Redirect to Sign-Up Page
document.getElementById('signupRedirect')?.addEventListener('click', () => {
    window.location.href = 'page1.html';
});

// Sign-Up Functionality
document.getElementById('signupForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.length >= MAX_USERS) {
        alert('User storage full. Cannot create more accounts.');
        return;
    }

    if (password === confirmPassword) {
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            alert('Email already registered. Please use a different email.');
            return;
        }

        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Sign-Up Successful! Redirecting to Login...');
        window.location.href = 'index.html';
    } else {
        alert('Passwords do not match! Please try again.');
    }
});

// Login Functionality
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert('Login Successful! Redirecting to Chat...');
        localStorage.setItem('currentUser', email);
        window.location.href = 'page2.html';
    } else {
        alert('Invalid Email or Password. Please try again.');
    }
});

// Chat Functionality
let currentPartner = null;

// Handle user selection and start chat
document.getElementById('startChat')?.addEventListener('click', () => {
    const partnerEmail = document.getElementById('partnerEmail').value.trim();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = localStorage.getItem('currentUser');

    if (partnerEmail === currentUser) {
        alert('You cannot chat with yourself.');
        return;
    }

    if (users.some(user => user.email === partnerEmail)) {
        currentPartner = partnerEmail;
        document.getElementById('userSelection').style.display = 'none';
        document.getElementById('chatBox').style.display = 'block';
        document.getElementById('messages').innerHTML = `<p>Chatting with: ${currentPartner}</p>`;
        loadChatMessages(currentUser, currentPartner);
    } else {
        alert('The email is not registered. Please try again.');
    }
});

// Handle sending messages
document.getElementById('chatForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    const currentUser = localStorage.getItem('currentUser');

    if (messageText && currentPartner) {
        addMessage(currentUser, currentPartner, messageText);
        messageInput.value = '';
    } else {
        alert('Message cannot be empty.');
    }
});

// Add message to chat and save to localStorage
function addMessage(sender, receiver, text) {
    const chatKey = `${sender}-${receiver}`;
    const reverseChatKey = `${receiver}-${sender}`;
    const chats = JSON.parse(localStorage.getItem('chats')) || {};

    // Save the message to the appropriate chat
    if (!chats[chatKey] && !chats[reverseChatKey]) {
        chats[chatKey] = [];
    }
    const chatArray = chats[chatKey] || chats[reverseChatKey];
    chatArray.push({ sender, text });

    localStorage.setItem('chats', JSON.stringify(chats));

    // Add message to the chat window
    displayMessage(sender, text);
}

// Display a message in the chat window
function displayMessage(sender, text) {
    const messageElement = document.createElement('div');
    const currentUser = localStorage.getItem('currentUser');
    const type = sender === currentUser ? 'sender' : 'receiver';

    messageElement.className = type;
    messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;

    const messagesContainer = document.getElementById('messages');
    messagesContainer.appendChild(messageElement);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Load existing messages between two users
function loadChatMessages(user1, user2) {
    const chatKey = `${user1}-${user2}`;
    const reverseChatKey = `${user2}-${user1}`;
    const chats = JSON.parse(localStorage.getItem('chats')) || {};

    const messages = chats[chatKey] || chats[reverseChatKey] || [];

    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = `<p>Chatting with: ${user2}</p>`;

    messages.forEach(message => {
        displayMessage(message.sender, message.text);
    });
}
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('currentUser', email);
            alert(data.message);
            window.location.href = 'chat.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Failed to connect to server.');
    }
});
