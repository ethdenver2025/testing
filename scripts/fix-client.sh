#!/bin/bash

echo "Starting client fix..."

# Switch to deploy user
cd /var/www/formicary-app

# Stop all PM2 processes
pm2 delete all

# Clear client build and modules
cd client
rm -rf node_modules build package-lock.json

# Install dependencies
npm install --legacy-peer-deps

# Create production environment file
cat > .env << 'ENVFILE'
REACT_APP_API_URL=http://104.251.216.17:8000
REACT_APP_WS_URL=ws://104.251.216.17:8000
REACT_APP_ENV=production
PORT=3000
ENVFILE

# Build client
npm run build

# Install serve globally
npm install -g serve

# Start client with PM2
pm2 delete formicary-client 2>/dev/null || true
pm2 start serve --name "formicary-client" -- -s build -l 3000

# Start server with PM2
cd ../server
pm2 delete formicary-server 2>/dev/null || true
pm2 start dist/main.js --name "formicary-server"

# Save PM2 configuration
pm2 save

echo "Client fix completed!"
echo "Checking processes..."
pm2 list

echo "Checking ports..."
netstat -tulpn | grep -E ':80|:3000|:8000'
