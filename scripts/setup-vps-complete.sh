#!/bin/bash

# Exit on error
set -e

echo "Starting VPS setup..."

# Update system
echo "Updating system packages..."
apt update
apt upgrade -y

# Install essential tools
echo "Installing essential tools..."
apt install -y curl wget git build-essential nginx ufw

# Setup firewall
echo "Configuring firewall..."
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

# Install Node.js 18
echo "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Create deploy user if it doesn't exist
echo "Setting up deploy user..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    echo "deploy:gptGPT123!@#" | chpasswd
    usermod -aG sudo deploy
fi

# Set up application directory
echo "Setting up application directory..."
mkdir -p /var/www/formicary-app
chown -R deploy:deploy /var/www/formicary-app

# Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/formicary-app << 'EOF'
server {
    listen 80;
    server_name formicary.app;  # Replace with your domain if you have one

    # Client application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Server
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

# Enable the site
ln -sf /etc/nginx/sites-available/formicary-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Setup PM2 to start on boot
echo "Configuring PM2 startup..."
pm2 startup systemd -u deploy --hp /home/deploy
systemctl enable pm2-deploy

# Switch to deploy user and set up the application
echo "Setting up application as deploy user..."
su - deploy << 'EOF'
# Clone the repository
cd /var/www/formicary-app
if [ ! -d ".git" ]; then
    git clone https://github.com/ethdenver2025/testing.git .
fi

# Install and build client
cd client
npm ci
npm run build

# Install and build server
cd ../server
npm ci
npm run build

# Start applications with PM2
cd /var/www/formicary-app
pm2 start npm --name "formicary-server" -- run start
pm2 start npm --name "formicary-client" -- run serve
pm2 save
EOF

echo "VPS setup completed!"
echo "You can now access the application at http://104.251.216.17"
echo "The API server is running on port 8000"
echo "The client application is running on port 3000"
