#!/bin/bash

echo "Starting application deployment..."

# Stop existing processes
pm2 delete all

# Clear node_modules and builds
cd /var/www/formicary-app
rm -rf client/node_modules client/build server/node_modules server/dist

# Setup client
echo "Setting up client..."
cd client
cat > .env << 'ENVFILE'
REACT_APP_API_URL=http://104.251.216.17:8000
REACT_APP_WS_URL=ws://104.251.216.17:8000
REACT_APP_ENV=production
PORT=3000
ENVFILE

npm install --legacy-peer-deps
npm run build
npm install -g serve

# Start client using serve
pm2 delete formicary-client 2>/dev/null || true
pm2 start serve --name "formicary-client" -- -s build -l 3000

# Setup server
echo "Setting up server..."
cd ../server
cat > .env << 'ENVFILE'
PORT=8000
NODE_ENV=production
DATABASE_URL="file:../data/dev.db"
JWT_SECRET="your-secret-key"
ENVFILE

npm install --legacy-peer-deps
npm run build

# Ensure database directory exists and is writable
mkdir -p ../data
chown -R deploy:deploy ../data

# Initialize database
npx prisma generate
npx prisma migrate deploy

# Start server
pm2 delete formicary-server 2>/dev/null || true
pm2 start dist/main.js --name "formicary-server"

# Save PM2 configuration
pm2 save

echo "Deployment completed!"
echo "Client should be running on port 3000"
echo "Server should be running on port 8000"
pm2 list
