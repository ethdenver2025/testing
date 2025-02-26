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
  },

  // Update account settings
  updateAccountSettings: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { 
        emailNotifications, 
        twoFactorEnabled, 
        theme, 
        language, 
        timezone, 
        privacy 
      } = req.body;

      const settings = await userService.updateAccountSettings(userId, {
        emailNotifications,
        twoFactorEnabled,
        theme,
        language,
        timezone,
        privacy
      });

      return res.json(settings);
    } catch (error) {
      console.error('Error updating account settings:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to update account settings' 
      });
    }
  },

  // Add restricted username
  addRestrictedUsername: async (req: Request, res: Response) => {
    try {
      const { word, reason } = req.body;
      
      if (!word) {
        return res.status(400).json({ error: 'Word is required' });
      }

      const restrictedWord = await userService.addRestrictedUsername(word, reason);
      return res.json(restrictedWord);
    } catch (error) {
      console.error('Error adding restricted username:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to add restricted username' 
      });
    }
  },

  // Remove restricted username
  removeRestrictedUsername: async (req: Request, res: Response) => {
    try {
      const { word } = req.params;
      
      if (!word) {
        return res.status(400).json({ error: 'Word is required' });
      }

      await userService.removeRestrictedUsername(word);
      return res.json({ success: true, message: 'Restricted username removed' });
    } catch (error) {
      console.error('Error removing restricted username:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to remove restricted username' 
      });
    }
  },

  // Get all restricted usernames
  getRestrictedUsernames: async (req: Request, res: Response) => {
    try {
      const restrictedWords = await userService.getRestrictedUsernames();
      return res.json(restrictedWords);
    } catch (error) {
      console.error('Error getting restricted usernames:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to get restricted usernames' 
      });
    }
  }
};
