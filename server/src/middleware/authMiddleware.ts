import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request type to include user object
export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    roles: string[];
  };
}

// Middleware to authenticate JWT token
export const authenticateJwt = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    // Special case for development mode - accept dev tokens
    if (process.env.NODE_ENV === 'development' && token.startsWith('dev-token-')) {
      const username = token.substring('dev-token-'.length);
      
      // Find or create user in dev mode
      let user = await prisma.user.findFirst({
        where: { username },
        select: {
          id: true,
          username: true,
          roles: true
        }
      });
      
      // Create a dev user if not found
      if (!user) {
        user = await prisma.user.create({
          data: {
            username,
            roles: ['EVENT_ORGANIZER']
          },
          select: {
            id: true,
            username: true,
            roles: true
          }
        });
      }
      
      req.user = user;
      return next();
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        roles: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating token:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Middleware to check if user has a specific role
export const checkRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!req.user.roles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden - required role not found' });
    }

    next();
  };
};
