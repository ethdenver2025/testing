#!/bin/bash

echo "Starting build fix..."

# Navigate to project root
cd /var/www/formicary-app

# Install root dependencies
npm install --legacy-peer-deps

# Fix client dependencies and build
cd client
rm -rf node_modules package-lock.json

# Install specific versions of problematic dependencies
npm install --legacy-peer-deps
npm install --save \
    @chakra-ui/react@^2.8.2 \
    @emotion/react@^11.11.3 \
    @emotion/styled@^11.11.0 \
    @react-oauth/google@^0.12.1 \
    @tanstack/react-query@^5.17.19 \
    framer-motion@^11.0.3 \
    react-router-dom@^6.22.0 \
    wagmi@^2.5.7 \
    viem@^2.7.9

# Create production environment file
cat > .env << 'ENVFILE'
REACT_APP_API_URL=http://104.251.216.17:8000
REACT_APP_WS_URL=ws://104.251.216.17:8000
REACT_APP_ENV=production
PORT=3000
ENVFILE

# Build client
npm run build

# Fix server dependencies and build
cd ../server
rm -rf node_modules package-lock.json

# Install dependencies
npm install --legacy-peer-deps

# Create production environment file
cat > .env << 'ENVFILE'
PORT=8000
NODE_ENV=production
DATABASE_URL="file:../data/dev.db"
JWT_SECRET="your-secret-key"
ENVFILE

# Build server
npm run build

# Initialize database
npx prisma generate
npx prisma migrate deploy

# Start applications with PM2
cd /var/www/formicary-app

# Install serve globally for client
npm install -g serve

# Start client
pm2 delete formicary-client 2>/dev/null || true
cd client
pm2 start serve --name "formicary-client" -- -s build -l 3000

# Start server
cd ../server
pm2 delete formicary-server 2>/dev/null || true
pm2 start dist/main.js --name "formicary-server"

# Save PM2 configuration
pm2 save

echo "Build fix completed!"
echo "Client should be running on port 3000"
echo "Server should be running on port 8000"
pm2 list
