const express = require('express');
const bodyParser = require('body-parser'); // For parsing request bodies

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Endpoint Example
app.get('/api/data', (req, res) => {
    res.json({ message: 'This is an API response!' });
});

// Webhook Endpoint Example
app.post('/webhook', (req, res) => {
    console.log('Webhook received:', req.body);
    // Process the webhook payload here
    res.status(200).send('Webhook received successfully!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});