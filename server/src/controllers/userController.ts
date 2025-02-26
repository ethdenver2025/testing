import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const userController = {
  // Check if username is available
  checkUsername: async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const isAvailable = await userService.checkUsername(username);
      
      return res.json({
        available: isAvailable,
        message: isAvailable ? 'Username is available' : 'Username is taken'
      });
    } catch (error) {
      console.error('Error checking username:', error);
      return res.status(500).json({ error: 'Failed to check username' });
    }
  },

  // Create or update user profile
  updateProfile: async (req: Request, res: Response) => {
    try {
      const { id, username, bio, authMethod, walletAddress, googleId, email } = req.body;

      const user = await userService.updateProfile({
        id,
        username,
        bio,
        authMethod,
        walletAddress,
        googleId,
        email
      });

      return res.json(user);
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      });
    }
  },

  // Get user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await userService.getProfile(id);

      if (!user) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      return res.json(user);
    } catch (error) {
      console.error('Error getting profile:', error);
      return res.status(500).json({ error: 'Failed to get profile' });
    }
  }
};
