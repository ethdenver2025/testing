import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

// Check if username is available
router.get('/check-username/:username', userController.checkUsername);

// Create/update user profile
router.post('/profile', userController.updateProfile);

// Get user profile
router.get('/profile/:id', userController.getProfile);

// Account settings
router.put('/account-settings/:userId', userController.updateAccountSettings);

// Restricted usernames (admin routes, would typically have authorization middleware)
router.get('/restricted-usernames', userController.getRestrictedUsernames);
router.post('/restricted-usernames', userController.addRestrictedUsername);
router.delete('/restricted-usernames/:word', userController.removeRestrictedUsername);

export default router;
