import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

  // Generate a new nonce for wallet signature
  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = crypto.randomUUID();
    await prisma.user.upsert({
      where: { walletAddress },
      update: { nonce },
      create: {
        walletAddress,
        nonce,
      },
    });
    return nonce;
  }

  // Verify wallet signature and authenticate user
  async verifyWalletSignature(message: string, signature: string, walletAddress: string): Promise<{ user: any; token: string }> {
    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new Error('Invalid signature');
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: { lastLogin: new Date() },
      create: {
        walletAddress,
        nonce: crypto.randomUUID(),
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, walletAddress },
      this.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  // Verify Google token and authenticate user
  async verifyGoogleToken(token: string): Promise<{ user: any; token: string }> {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new Error('Invalid token payload');

      const { email, name, picture } = payload;

      // Find or create user
      const user = await prisma.user.upsert({
        where: { email: email! },
        update: {
          lastLogin: new Date(),
          name: name || undefined,
          profileImage: picture || undefined,
        },
        create: {
          email: email!,
          name: name || email!.split('@')[0],
          profileImage: picture,
        },
      });

      // Generate JWT token
      const authToken = jwt.sign(
        { userId: user.id, email },
        this.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return { user, token: authToken };
    } catch (error) {
      throw new Error('Failed to verify Google token');
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Get user profile
  async getUserProfile(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
  }

  // Update user profile
  async updateProfile(userId: string, data: {
    name?: string;
    email?: string;
    profileImage?: string;
    bio?: string;
    skills?: string[];
  }) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
        profile: {
          upsert: {
            create: {
              bio: data.bio,
              skills: data.skills || [],
            },
            update: {
              bio: data.bio,
              skills: data.skills || [],
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }
}
