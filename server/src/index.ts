import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from './routes/profile';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Apply middleware
    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3001',
      credentials: true
    }));
    app.use(express.json());

    // Routes
    app.use('/api/profile', profileRoutes);
    
    // Health check
    app.get('/health', (_, res) => res.json({ status: 'OK' }));
    
    // Simple mock API routes for now
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
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
