#!/bin/bash

echo "Updating Nginx configuration..."

# Create Nginx configuration
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
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/formicary-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx

echo "Nginx configuration updated!"
