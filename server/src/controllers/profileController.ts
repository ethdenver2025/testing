import { Request, Response } from 'express';

// In-memory store for development
const profiles = new Map<string, any>();

export const checkUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    // Check if username exists in profiles
    for (const profile of profiles.values()) {
      if (profile.username === username) {
        return res.json({ available: false });
      }
    }
    return res.json({ available: true });
  } catch (error) {
    console.error('Error checking username:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const profile = profiles.get(id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    return res.json(profile);
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const { id, username, bio, authMethod } = req.body;

  try {
    // Check if username is taken by another user
    for (const [profileId, profile] of profiles.entries()) {
      if (profile.username === username && profileId !== id) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }

    const existingProfile = profiles.get(id);
    const updatedProfile = {
      ...(existingProfile || {}),
      id,
      username,
      bio,
      authMethod,
      isProfileComplete: true,
    };

    profiles.set(id, updatedProfile);
    return res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
