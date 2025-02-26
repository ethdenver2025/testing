#!/bin/bash

echo "Starting VPS debugging..."

# Check nginx status and configuration
echo "Checking Nginx..."
systemctl status nginx
nginx -t

# Check ports in use
echo -e "\nChecking ports..."
netstat -tulpn | grep -E ':80|:3000|:8000'

# Check PM2 processes
echo -e "\nChecking PM2 processes..."
pm2 list
pm2 logs --lines 20

# Restart everything
echo -e "\nRestarting services..."
systemctl restart nginx

cd /var/www/formicary-app

# Update client environment
echo -e "\nUpdating client environment..."
cat > client/.env << 'ENVFILE'
REACT_APP_API_URL=http://104.251.216.17:8000
REACT_APP_WS_URL=ws://104.251.216.17:8000
REACT_APP_ENV=production
PORT=3000
ENVFILE

# Update server environment
echo -e "\nUpdating server environment..."
cat > server/.env << 'ENVFILE'
PORT=8000
NODE_ENV=production
DATABASE_URL="file:../data/dev.db"
JWT_SECRET="your-secret-key"
ENVFILE

# Switch to deploy user and rebuild/restart
echo -e "\nRebuilding and restarting as deploy user..."
su - deploy << 'EOF'
cd /var/www/formicary-app

# Rebuild client
cd client
npm run build

# Start client on specific port
PORT=3000 pm2 delete formicary-client 2>/dev/null || true
PORT=3000 pm2 start npm --name "formicary-client" -- start

# Start server on specific port
cd ../server
pm2 delete formicary-server 2>/dev/null || true
pm2 start npm --name "formicary-server" -- start

pm2 save
EOF

# Update Nginx configuration
echo -e "\nUpdating Nginx configuration..."
cat > /etc/nginx/sites-available/formicary-app << 'EOF'
server {
    listen 80;
    server_name 104.251.216.17;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site and restart Nginx
ln -sf /etc/nginx/sites-available/formicary-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo -e "\nDebugging completed. Check http://104.251.216.17"
echo "To view logs, run: pm2 logs"
