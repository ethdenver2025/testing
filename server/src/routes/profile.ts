import express from 'express';
import { checkUsername, getProfile, updateProfile } from '../controllers/profileController';

const router = express.Router();

// Check if username is available
router.get('/check-username/:username', checkUsername);

// Get user profile
router.get('/:id', getProfile);

// Update user profile
router.post('/update', updateProfile);

export default router;
