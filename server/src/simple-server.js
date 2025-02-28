const express = require('express');
const cors = require('cors');

// Initialize express app
const app = express();
const PORT = 4000;

// Apply middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ status: 'OK' }));

// Simple mock API routes
app.get('/api/profile', (_, res) => {
  res.json({ message: 'Profile API is working' });
});

app.get('/api/events', (_, res) => {
  res.json({ message: 'Events API is working' });
});

app.get('/api/attestations', (_, res) => {
  res.json({ message: 'Attestations API is working' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
