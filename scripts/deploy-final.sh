#!/bin/bash

set -e  # Exit on error
echo "Starting final deployment..."

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 1. Stop all existing processes
log "Stopping existing processes..."
pm2 delete all 2>/dev/null || true
killall node 2>/dev/null || true

# 2. Clean up directories
log "Cleaning up directories..."
cd /var/www/formicary-app
rm -rf client/node_modules client/build server/node_modules server/dist

# 3. Set up environment files
log "Setting up environment files..."
cat > client/.env << 'ENVFILE'
REACT_APP_API_URL=http://104.251.216.17/api
REACT_APP_WS_URL=ws://104.251.216.17/api
REACT_APP_ENV=production
PORT=3000
ENVFILE

cat > server/.env << 'ENVFILE'
PORT=8000
NODE_ENV=production
DATABASE_URL="file:../data/dev.db"
JWT_SECRET="your-secret-key"
ENVFILE

# 4. Install and build client
log "Setting up client..."
cd client
npm install --legacy-peer-deps
npm run build
npm install -g serve

# 5. Install and build server
log "Setting up server..."
cd ../server
npm install --legacy-peer-deps
npm run build

# 6. Set up database
log "Setting up database..."
mkdir -p ../data
npx prisma generate
npx prisma migrate deploy

# 7. Configure Nginx
log "Configuring Nginx..."
cat > /etc/nginx/sites-available/formicary-app << 'EOF'
server {
    listen 80;
    server_name 104.251.216.17;

    access_log /var/log/nginx/formicary-access.log;
    error_log /var/log/nginx/formicary-error.log;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Add timeouts
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
        proxy_read_timeout 60;
        send_timeout 60;
    }

    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Add timeouts
        proxy_connect_timeout 60;
        proxy_send_timeout 60;
        proxy_read_timeout 60;
        send_timeout 60;
    }
}
EOF

ln -sf /etc/nginx/sites-available/formicary-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 8. Start applications
log "Starting applications..."
cd /var/www/formicary-app

# Start client
cd client
pm2 delete formicary-client 2>/dev/null || true
PORT=3000 pm2 start serve --name "formicary-client" -- -s build -l 3000

# Start server
cd ../server
pm2 delete formicary-server 2>/dev/null || true
pm2 start dist/main.js --name "formicary-server"

# Save PM2 configuration
pm2 save

# 9. Restart Nginx
log "Restarting Nginx..."
nginx -t
systemctl restart nginx

# 10. Final checks
log "Performing final checks..."
echo "PM2 processes:"
pm2 list

echo "Listening ports:"
netstat -tulpn | grep -E ':80|:3000|:8000'

echo "Nginx error log:"
tail -n 20 /var/log/nginx/formicary-error.log

echo "PM2 logs:"
pm2 logs --lines 20

log "Deployment completed!"
echo "You can now access:"
echo "- Web application: http://104.251.216.17"
echo "- API server: http://104.251.216.17/api"
echo "- Nginx logs: /var/log/nginx/formicary-error.log"
echo "- PM2 logs: pm2 logs"
