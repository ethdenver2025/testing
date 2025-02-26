import { PrismaClient } from '@prisma/client';

// Use an in-memory store for development
const profiles = new Map();

export const db = {
  profile: {
    findUnique: async ({ where }: { where: { username?: string; id?: string } }) => {
      if (where.username) {
        // Find by username
        for (const profile of profiles.values()) {
          if (profile.username === where.username) {
            return profile;
          }
        }
      } else if (where.id) {
        // Find by id
        return profiles.get(where.id);
      }
      return null;
    },
    upsert: async ({ where, update, create }: { where: { id: string }, update: any, create: any }) => {
      const existingProfile = profiles.get(where.id);
      
      // Check if username is taken by another user
      if (create.username || update.username) {
        const username = create.username || update.username;
        for (const [id, profile] of profiles.entries()) {
          if (profile.username === username && id !== where.id) {
            throw new Error('Username is already taken');
          }
        }
      }

      if (existingProfile) {
        const updatedProfile = { ...existingProfile, ...update };
        profiles.set(where.id, updatedProfile);
        return updatedProfile;
      } else {
        profiles.set(where.id, create);
        return create;
      }
    },
    findFirst: async ({ where }: { where: any }) => {
      // Find first profile matching the criteria
      for (const profile of profiles.values()) {
        let match = true;
        for (const [key, value] of Object.entries(where)) {
          if (profile[key] !== value) {
            match = false;
            break;
          }
        }
        if (match) return profile;
      }
      return null;
    }
  }
};
