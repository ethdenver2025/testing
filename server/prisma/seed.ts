import { PrismaClient } from '@prisma/client';
import { restrictedUsernames } from './seed-data/restricted-usernames';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Seed restricted usernames
  console.log('Seeding restricted usernames...');
  
  // First clear any existing restricted usernames
  await prisma.restrictedUsername.deleteMany({});
  
  // Insert restricted usernames
  for (const word of restrictedUsernames) {
    await prisma.restrictedUsername.create({
      data: {
        word: word.toLowerCase(),
        reason: 'Restricted by system',
      },
    });
  }

  console.log(`Added ${restrictedUsernames.length} restricted usernames`);
  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
