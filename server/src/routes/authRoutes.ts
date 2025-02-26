import { Router } from 'express';
import { AuthService } from '../services/authService';

const router = Router();
const authService = new AuthService();

// Get nonce for wallet signature
router.post('/nonce', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    const nonce = await authService.generateNonce(walletAddress);
    res.json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify signature and authenticate
router.post('/verify', async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;
    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature are required' });
    }

    const userId = await authService.verifySignature(walletAddress, signature);
    const user = await authService.getUserProfile(userId);
    
    res.json({ user });
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user?.id; // You'll need to add auth middleware to set req.user
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await authService.getUserProfile(userId);
    res.json({ user });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user?.id; // You'll need to add auth middleware to set req.user
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { username, avatar, bio, skills } = req.body;
    const user = await authService.updateProfile(userId, {
      username,
      avatar,
      bio,
      skills,
    });

    res.json({ user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
