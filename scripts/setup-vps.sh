#!/bin/bash

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /var/www/formicary-app
sudo chown -R $USER:$USER /var/www/formicary-app

# Clone repository (you'll need to set up deploy keys)
git clone https://github.com/ethdenver2025/testing.git /var/www/formicary-app

# Setup client
cd /var/www/formicary-app/client
npm install
npm run build

# Setup server
cd /var/www/formicary-app/server
npm install
npm run build

# Setup PM2 processes
pm2 start npm --name "formicary-server" -- run start
pm2 start npm --name "formicary-client" -- run serve
pm2 save

# Setup PM2 to start on boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER
