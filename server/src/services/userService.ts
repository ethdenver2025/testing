import prisma from '../config/database';

export const userService = {
  // Check if username is available
  checkUsername: async (username: string) => {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    return !user;
  },

  // Get user profile by various IDs
  getProfile: async (identifier: string) => {
    return await prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier },
          { walletAddress: identifier.toLowerCase() },
          { googleId: identifier }
        ]
      }
    });
  },

  // Create or update user profile
  updateProfile: async ({
    id,
    username,
    bio,
    authMethod,
    walletAddress,
    googleId,
    email
  }: {
    id?: string;
    username: string;
    bio?: string;
    authMethod: 'WALLET' | 'GOOGLE';
    walletAddress?: string;
    googleId?: string;
    email?: string;
  }) => {
    // Check if username is taken by another user
    const existingUsername = await prisma.user.findFirst({
      where: {
        username,
        NOT: { id }
      }
    });

    if (existingUsername) {
      throw new Error('Username is already taken');
    }

    // Find existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { walletAddress: walletAddress?.toLowerCase() },
          { googleId }
        ]
      }
    });

    if (existingUser) {
      // Update existing user
      return await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          username,
          bio,
          isProfileComplete: true,
          ...(authMethod === 'WALLET'
            ? { walletAddress: walletAddress?.toLowerCase() }
            : { googleId, email }
          )
        }
      });
    }

    // Create new user
    return await prisma.user.create({
      data: {
        username,
        bio,
        authMethod,
        isProfileComplete: true,
        ...(authMethod === 'WALLET'
          ? { walletAddress: walletAddress?.toLowerCase() }
          : { googleId, email }
        )
      }
    });
  }
};
