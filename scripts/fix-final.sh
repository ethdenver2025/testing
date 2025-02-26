#!/bin/bash

echo "Starting final fixes..."

# Navigate to server directory
cd /var/www/formicary-app/server

# Clean up
rm -rf node_modules dist
rm -rf prisma/migrations

# Install dependencies
npm install
npm install --save-dev @types/jsonwebtoken @types/express
npm install --save @prisma/client

# Update prisma schema with all required fields
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
  skills          String[]   @default([])
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

# Create SQLite database directory
mkdir -p ../data

# Generate Prisma client
npx prisma generate

# Create initial migration
DATABASE_URL="file:../data/dev.db" npx prisma migrate dev --name init

# Build server
npm run build

echo "Server fixes completed!"

# Now run the deployment script
cd ..
curl -O https://raw.githubusercontent.com/ethdenver2025/testing/development/scripts/deploy-final.sh
chmod +x deploy-final.sh
./deploy-final.sh
