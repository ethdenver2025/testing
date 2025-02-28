import express from 'express';
import { attestationController } from '../controllers/attestationController';
import { authenticateJwt } from '../middleware/authMiddleware';

const router = express.Router();

// Create a skill attestation
router.post('/skill', authenticateJwt, attestationController.createSkillAttestation);

// Create a work ethic attestation
router.post('/work-ethic', authenticateJwt, attestationController.createWorkEthicAttestation);

// Get a user's trust profile
router.get('/user/:id', attestationController.getUserTrustProfile);

// Find crew members that match required skills and have good trust scores
router.post('/match-crew', attestationController.findCrewForPosition);

export default router;
