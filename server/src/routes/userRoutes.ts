import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

// Check if username is available
router.get('/check-username/:username', userController.checkUsername);

// Create/update user profile
router.post('/profile', userController.updateProfile);

// Get user profile
router.get('/profile/:id', userController.getProfile);

export default router;
