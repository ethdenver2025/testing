#!/bin/bash

echo "Starting TypeScript fixes..."

# Navigate to server directory
cd /var/www/formicary-app/server

# Install missing type definitions
npm install --save-dev @types/jsonwebtoken @types/express

# Update prisma schema to include missing fields
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id               String     @id @default(uuid())
  username         String     @unique
  email           String?    @unique
  walletAddress   String?    @unique
  googleId        String?    @unique
  bio             String?
  isProfileComplete Boolean  @default(false)
  authMethod      AuthMethod @default(WALLET)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  nonce           String?
  name            String?
  lastLogin       DateTime?
  profileImage    String?
  skills          String[]
  tasks           Task[]
}

model Task {
  id          String   @id @default(uuid())
  type        String
  status      String   @default("pending")
  client      String
  reward      String
  user        User     @relation(fields: [userId], references: [id])
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum AuthMethod {
  WALLET
  GOOGLE
  EMAIL
}
EOF

# Update auth routes to use correct types
cat > src/routes/authRoutes.ts << 'EOF'
import express, { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { SSOAuthService } from '../services/ssoAuthService';
import { prisma } from '../prisma';

const router = express.Router();
const authService = new AuthService();
const ssoAuthService = new SSOAuthService();

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Your existing route handlers with proper types
router.post('/wallet/nonce', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    const nonce = await authService.generateNonce(address);
    res.json({ nonce });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add other route handlers...

export default router;
EOF

# Update auth service with correct types
cat > src/services/authService.ts << 'EOF'
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export class AuthService {
  async generateNonce(address: string) {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { nonce },
      });
    } else {
      await prisma.user.create({
        data: {
          username: address,
          walletAddress: address,
          nonce,
        },
      });
    }

    return nonce;
  }

  // Add other methods...
}
EOF

# Update SSO auth service with correct types
cat > src/services/ssoAuthService.ts << 'EOF'
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export class SSOAuthService {
  async handleGoogleLogin(token: string) {
    // Implementation...
  }

  // Add other methods...
}
EOF

# Update tasks route with correct types
cat > src/routes/tasks.ts << 'EOF'
import express, { Request, Response } from 'express';
import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { type, client, reward } = req.body;
    const userId = req.user?.id;

    const task = await prisma.task.create({
      data: {
        type,
        status: 'pending',
        client,
        reward,
        userId,
      },
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add other route handlers...

export default router;
EOF

# Generate Prisma client with updated schema
npx prisma generate

# Build server
npm run build

echo "TypeScript fixes completed!"
