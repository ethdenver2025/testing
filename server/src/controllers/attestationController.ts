import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { easService } from '../services/easService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const attestationController = {
  /**
   * Create a skill attestation
   * POST /api/attestations/skill
   */
  createSkillAttestation: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const attesterId = req.user.id;
      const { 
        recipientId, 
        skill, 
        rating, 
        comments, 
        eventId 
      } = req.body;

      // Validate required fields
      if (!recipientId || !skill || !rating) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Ensure rating is between 1-5
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      }

      // Get recipient's address
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId },
        select: { address: true }
      });

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      // Use a development private key for testing
      // In production, this would come from a secure source
      const privateKey = process.env.EAS_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

      const attestation = await easService.createSkillAttestation(
        privateKey,
        attesterId,
        recipientId,
        recipient.address || '0x0000000000000000000000000000000000000000',
        skill,
        rating,
        comments || '',
        eventId
      );

      return res.status(201).json(attestation);
    } catch (error: any) {
      console.error('Error creating skill attestation:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Create a work ethic attestation
   * POST /api/attestations/work-ethic
   */
  createWorkEthicAttestation: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const attesterId = req.user.id;
      const { 
        recipientId, 
        reliability, 
        teamwork, 
        professionalism, 
        comments, 
        eventId 
      } = req.body;

      // Validate required fields
      if (!recipientId || 
          reliability === undefined || 
          teamwork === undefined || 
          professionalism === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Ensure ratings are between 1-5
      if (reliability < 1 || reliability > 5 || 
          teamwork < 1 || teamwork > 5 || 
          professionalism < 1 || professionalism > 5) {
        return res.status(400).json({ error: 'Ratings must be between 1 and 5' });
      }

      // Get recipient's address
      const recipient = await prisma.user.findUnique({
        where: { id: recipientId },
        select: { address: true }
      });

      if (!recipient) {
        return res.status(404).json({ error: 'Recipient not found' });
      }

      // Use a development private key for testing
      const privateKey = process.env.EAS_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

      const attestation = await easService.createWorkEthicAttestation(
        privateKey,
        attesterId,
        recipientId,
        recipient.address || '0x0000000000000000000000000000000000000000',
        reliability,
        teamwork,
        professionalism,
        comments || '',
        eventId
      );

      return res.status(201).json(attestation);
    } catch (error: any) {
      console.error('Error creating work ethic attestation:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get user attestations and trust score
   * GET /api/attestations/user/:id
   */
  getUserTrustProfile: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const profile = await easService.getUserTrustProfile(id);
      return res.status(200).json(profile);
    } catch (error: any) {
      console.error('Error getting user trust profile:', error);
      return res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
    }
  },

  /**
   * Find crew members for a position based on skills and trust scores
   * POST /api/attestations/match-crew
   */
  findCrewForPosition: async (req: Request, res: Response) => {
    try {
      const { skills, minTrustScore } = req.body;

      if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return res.status(400).json({ error: 'Skills must be a non-empty array' });
      }

      const matches = await easService.findCrewForPosition(
        skills, 
        minTrustScore || 70
      );

      return res.status(200).json(matches);
    } catch (error: any) {
      console.error('Error finding crew matches:', error);
      return res.status(500).json({ error: error.message });
    }
  },
};

export default attestationController;
