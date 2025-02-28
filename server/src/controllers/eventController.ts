import { Request, Response } from 'express';
import { eventService } from '../services/eventService';
import { AuthRequest } from '../middleware/authMiddleware';

export const eventController = {
  /**
   * Create a new event
   * POST /api/events
   */
  createEvent: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      const eventData = req.body;

      // Validate required fields
      if (!eventData.title || !eventData.location || !eventData.startDate || !eventData.endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Parse dates from strings if needed
      if (typeof eventData.startDate === 'string') {
        eventData.startDate = new Date(eventData.startDate);
      }
      if (typeof eventData.endDate === 'string') {
        eventData.endDate = new Date(eventData.endDate);
      }

      // Validate dates
      if (isNaN(eventData.startDate.getTime()) || isNaN(eventData.endDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      if (eventData.endDate < eventData.startDate) {
        return res.status(400).json({ error: 'End date cannot be before start date' });
      }

      const event = await eventService.createEvent(eventData, userId);
      return res.status(201).json(event);
    } catch (error: any) {
      console.error('Error creating event:', error);
      return res.status(error.message.includes('Unauthorized') ? 403 : 500).json({ error: error.message });
    }
  },

  /**
   * Get all events with optional filtering
   * GET /api/events
   */
  getEvents: async (req: Request, res: Response) => {
    try {
      const { status, organizerId, search, upcoming } = req.query;
      
      const events = await eventService.getEvents({
        status: status as string,
        organizerId: organizerId as string,
        search: search as string,
        upcoming: upcoming === 'true'
      });
      
      return res.status(200).json(events);
    } catch (error: any) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get a single event by id
   * GET /api/events/:id
   */
  getEventById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      
      return res.status(200).json(event);
    } catch (error: any) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Update an existing event
   * PUT /api/events/:id
   */
  updateEvent: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;
      
      // Parse dates from strings if needed
      if (updateData.startDate && typeof updateData.startDate === 'string') {
        updateData.startDate = new Date(updateData.startDate);
      }
      if (updateData.endDate && typeof updateData.endDate === 'string') {
        updateData.endDate = new Date(updateData.endDate);
      }

      // Validate dates if both are provided
      if (updateData.startDate && updateData.endDate && updateData.endDate < updateData.startDate) {
        return res.status(400).json({ error: 'End date cannot be before start date' });
      }

      const event = await eventService.updateEvent(id, updateData, userId);
      return res.status(200).json(event);
    } catch (error: any) {
      console.error('Error updating event:', error);
      if (error.message.includes('Unauthorized') || error.message.includes('not authorized')) {
        return res.status(403).json({ error: error.message });
      } else if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  /**
   * Delete an event
   * DELETE /api/events/:id
   */
  deleteEvent: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const userId = req.user.id;
      
      await eventService.deleteEvent(id, userId);
      return res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      if (error.message.includes('Unauthorized') || error.message.includes('not authorized')) {
        return res.status(403).json({ error: error.message });
      } else if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  /**
   * Add a crew position to an event
   * POST /api/events/:id/positions
   */
  addCrewPosition: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;
      const userId = req.user.id;
      const positionData = req.body;
      
      // Validate required fields
      if (!positionData.title || !positionData.skills || !positionData.payRate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const position = await eventService.addCrewPosition(id, positionData, userId);
      return res.status(201).json(position);
    } catch (error: any) {
      console.error('Error adding crew position:', error);
      if (error.message.includes('Unauthorized') || error.message.includes('not authorized')) {
        return res.status(403).json({ error: error.message });
      } else if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  /**
   * Apply for a crew position
   * POST /api/events/positions/:positionId/apply
   */
  applyForPosition: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { positionId } = req.params;
      const userId = req.user.id;
      
      const application = await eventService.applyForPosition(positionId, userId);
      return res.status(201).json(application);
    } catch (error: any) {
      console.error('Error applying for position:', error);
      if (error.message.includes('already applied')) {
        return res.status(409).json({ error: error.message });
      } else if (error.message.includes('not authorized')) {
        return res.status(403).json({ error: error.message });
      } else if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error.message });
      }
    }
  },

  /**
   * Update application status
   * PUT /api/events/applications/:applicationId
   */
  updateApplicationStatus: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { applicationId } = req.params;
      const { status } = req.body;
      const userId = req.user.id;
      
      if (!status || !['APPLIED', 'SHORTLISTED', 'HIRED', 'REJECTED', 'COMPLETED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      const application = await eventService.updateApplicationStatus(applicationId, status, userId);
      return res.status(200).json(application);
    } catch (error: any) {
      console.error('Error updating application status:', error);
      if (error.message.includes('Unauthorized') || error.message.includes('not authorized')) {
        return res.status(403).json({ error: error.message });
      } else if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: error.message });
      }
    }
  }
};
