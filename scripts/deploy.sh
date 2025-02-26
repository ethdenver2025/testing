#!/bin/bash

echo "Starting deployment process..."

# Stop any existing processes
pm2 delete all 2>/dev/null || true
fuser -k 3000/tcp 2>/dev/null || true
fuser -k 8000/tcp 2>/dev/null || true

# Navigate to app directory
cd /var/www/formicary-app

# Update from git
git pull origin development

# Setup server
cd server
npm install
cd ..

# Remove old build directory and create new one
rm -rf client/build
mkdir -p client/build

# Set permissions for the build directory
chown -R www-data:www-data client/build
chmod -R 755 client/build

# Configure Nginx
cat > /etc/nginx/sites-available/formicary-app << 'EOF'
server {
    listen 80;
    server_name 104.251.216.17;

    root /var/www/formicary-app/client/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site and restart Nginx
ln -sf /etc/nginx/sites-available/formicary-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Start server with PM2
cd server
pm2 start index.js --name formicary-server

# Save PM2 configuration
pm2 save

echo "Server deployment complete!"
echo "Now run this command locally to deploy the client:"
echo "scp -r client/dist/* root@104.251.216.17:/var/www/formicary-app/client/build/"
