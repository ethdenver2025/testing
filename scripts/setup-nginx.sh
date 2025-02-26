#!/bin/bash

echo "Setting up Nginx..."

# Configure Nginx
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
    }

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/formicary-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

echo "Nginx setup completed!"

# Run minimal server setup
cd /var/www/formicary-app
curl -O https://raw.githubusercontent.com/ethdenver2025/testing/development/scripts/minimal-server.sh
chmod +x minimal-server.sh
./minimal-server.sh

# Run minimal client setup
curl -O https://raw.githubusercontent.com/ethdenver2025/testing/development/scripts/minimal-client.sh
chmod +x minimal-client.sh
./minimal-client.sh

# Show status
echo "Final status:"
pm2 list
netstat -tulpn | grep -E ':80|:3000|:8000'
