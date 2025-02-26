#!/bin/bash

# Exit on error
set -e

echo "Starting improved VPS setup..."

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

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
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

# Update npm to latest version
echo "Updating npm..."
npm install -g npm@latest

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

# Configure Nginx with better settings
echo "Configuring Nginx..."
cat > /etc/nginx/sites-available/formicary-app << 'EOF'
server {
    listen 80;
    server_name formicary.app;  # Replace with your domain

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    # Client application
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

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # API Server
    location /api {
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

# Enable the site
ln -sf /etc/nginx/sites-available/formicary-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t && systemctl restart nginx

# Setup PM2 to start on boot
echo "Configuring PM2 startup..."
pm2 startup systemd -u deploy --hp /home/deploy
systemctl enable pm2-deploy

# Switch to deploy user and set up the application
echo "Setting up application as deploy user..."
su - deploy << 'EOF'
cd /var/www/formicary-app

# Clone/update repository
if [ ! -d ".git" ]; then
    git clone https://github.com/ethdenver2025/testing.git .
else
    git fetch --all
    git reset --hard origin/development
fi

# Create client environment file
cat > client/.env << 'ENVFILE'
REACT_APP_API_URL=http://104.251.216.17/api
REACT_APP_WS_URL=ws://104.251.216.17/api
REACT_APP_ENV=production
ENVFILE

# Create server environment file
cat > server/.env << 'ENVFILE'
PORT=8000
NODE_ENV=production
DATABASE_URL="file:../data/dev.db"
JWT_SECRET="your-secret-key"
ENVFILE

# Install and build client with forced resolution of vulnerabilities
cd client
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm audit fix --force
npm run build

# Install and build server with forced resolution of vulnerabilities
cd ../server
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm audit fix --force
npm run build

# Ensure data directory exists
mkdir -p ../data

# Initialize database if needed
npx prisma generate
npx prisma migrate deploy

# Start/restart applications with PM2
cd /var/www/formicary-app
pm2 delete formicary-server formicary-client 2>/dev/null || true
pm2 start npm --name "formicary-server" -- run start
pm2 start npm --name "formicary-client" -- run serve
pm2 save
EOF

echo "VPS setup completed!"
echo "You can now access the application at http://104.251.216.17"
echo "The API server is running on port 8000"
echo "The client application is running on port 3000"
echo "Check the logs with: pm2 logs"
