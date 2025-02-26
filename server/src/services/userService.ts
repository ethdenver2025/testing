import prisma from '../config/database';

export const userService = {
  // Check if username is available
  checkUsername: async (username: string) => {
    // Check if username exists in restricted list
    const isRestricted = await prisma.restrictedUsername.findUnique({
      where: { word: username.toLowerCase() }
    });

    if (isRestricted) {
      return false;
    }

    // Check username length (max 16 characters)
    if (username.length > 16) {
      return false;
    }

    // Check if username is already taken
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
      },
      include: {
        accountSettings: true
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
    // Check if username is too long
    if (username.length > 16) {
      throw new Error('Username must be 16 characters or less');
    }

    // Check if username contains restricted words
    const restrictedWords = await prisma.restrictedUsername.findMany();
    
    for (const restricted of restrictedWords) {
      if (username.toLowerCase().includes(restricted.word.toLowerCase())) {
        throw new Error(`Username contains a restricted word: ${restricted.word}`);
      }
    }

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
    let existingUser;
    if (authMethod === 'WALLET' && walletAddress) {
      existingUser = await prisma.user.findUnique({
        where: { walletAddress: walletAddress.toLowerCase() }
      });
    } else if (authMethod === 'GOOGLE' && googleId) {
      existingUser = await prisma.user.findUnique({
        where: { googleId }
      });
    }

    if (existingUser) {
      // Check if the user is trying to update their profile
      if (id && id !== existingUser.id) {
        throw new Error('Account already exists with this authentication method');
      }

      // Update existing user
      return await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          username,
          bio,
          isProfileComplete: true,
          lastLogin: new Date(),
          ...(authMethod === 'WALLET'
            ? { walletAddress: walletAddress?.toLowerCase() }
            : { googleId, email }
          )
        },
        include: {
          accountSettings: true
        }
      });
    }

    // Check registration limit (once per 14 days)
    // Find any user with same wallet or Google ID
    let existingAccounts;
    if (authMethod === 'WALLET' && walletAddress) {
      existingAccounts = await prisma.user.findMany({
        where: { authMethod: 'WALLET' }
      });
    } else if (authMethod === 'GOOGLE' && googleId) {
      existingAccounts = await prisma.user.findMany({
        where: { authMethod: 'GOOGLE' }
      });
    } else {
      existingAccounts = [];
    }

    // Check if user has registered within the last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const recentRegistration = existingAccounts.some(account => 
      account.lastRegistration > fourteenDaysAgo
    );

    if (recentRegistration) {
      throw new Error('You cannot register a new account more than once every 14 days');
    }

    // Create new user
    const user = await prisma.user.create({
      data: {
        username,
        bio,
        authMethod,
        isProfileComplete: true,
        lastRegistration: new Date(),
        ...(authMethod === 'WALLET'
          ? { walletAddress: walletAddress?.toLowerCase() }
          : { googleId, email }
        ),
        accountSettings: {
          create: {
            emailNotifications: true,
            twoFactorEnabled: false,
            theme: 'light',
            language: 'en',
            timezone: 'UTC',
            privacy: 'PUBLIC'
          }
        }
      },
      include: {
        accountSettings: true
      }
    });

    return user;
  },

  // Update account settings
  updateAccountSettings: async (userId: string, settings: {
    emailNotifications?: boolean;
    twoFactorEnabled?: boolean;
    theme?: string;
    language?: string;
    timezone?: string;
    privacy?: 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';
  }) => {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accountSettings: true }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Create or update settings
    if (user.accountSettings) {
      return await prisma.accountSettings.update({
        where: { userId },
        data: settings
      });
    } else {
      return await prisma.accountSettings.create({
        data: {
          ...settings,
          userId
        }
      });
    }
  },

  // Add a restricted username
  addRestrictedUsername: async (word: string, reason?: string) => {
    return await prisma.restrictedUsername.create({
      data: {
        word: word.toLowerCase(),
        reason
      }
    });
  },

  // Remove a restricted username
  removeRestrictedUsername: async (word: string) => {
    return await prisma.restrictedUsername.delete({
      where: { word: word.toLowerCase() }
    });
  },

  // Get all restricted usernames
  getRestrictedUsernames: async () => {
    return await prisma.restrictedUsername.findMany();
  }
};
