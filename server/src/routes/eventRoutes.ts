import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authenticateJwt } from '../middleware/authMiddleware';

const router = Router();

// Public routes - anyone can view events
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Protected routes - require authentication
router.post('/', authenticateJwt, eventController.createEvent);
router.put('/:id', authenticateJwt, eventController.updateEvent);
router.delete('/:id', authenticateJwt, eventController.deleteEvent);

// Crew position routes
router.post('/:id/positions', authenticateJwt, eventController.addCrewPosition);
router.post('/positions/:positionId/apply', authenticateJwt, eventController.applyForPosition);
router.put('/applications/:applicationId', authenticateJwt, eventController.updateApplicationStatus);

export default router;
