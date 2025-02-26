import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { prisma } from '../lib/prisma';

export class SSOAuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = '24h';

  constructor(private readonly prisma: PrismaClient = prisma) {}

  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    await this.prisma.user.upsert({
      where: { walletAddress },
      update: { nonce },
      create: {
        walletAddress,
        nonce,
        role: 'USER'
      }
    });
    return nonce;
  }

  async verifySignature(walletAddress: string, signature: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user || !user.nonce) {
      throw new Error('Invalid user or nonce');
    }

    const message = `Sign this message to verify your identity. Nonce: ${user.nonce}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Invalid signature');
    }

    // Generate a new nonce for next time
    await this.generateNonce(walletAddress);

    // Generate JWT token
    const token = this.generateToken(user.id);
    return token;
  }

  async verifyZkSyncSession(sessionData: any): Promise<string> {
    // TODO: Implement zkSync SSO session verification
    // This is a placeholder for zkSync SSO implementation
    // We'll implement this when the SDK is production-ready
    throw new Error('zkSync SSO not implemented yet');
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }
}
