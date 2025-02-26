import { PrismaClient } from '@prisma/client';

// Set default database URL if not provided in environment
const dbUrl = 'postgresql://postgres:' + encodeURIComponent('gptGPT123!@#') + '@localhost:5432/formicary';
process.env.DATABASE_URL = process.env.DATABASE_URL || dbUrl;

// Create Prisma client instance
const prisma = new PrismaClient();

export default prisma;
