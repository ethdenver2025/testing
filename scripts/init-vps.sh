#!/bin/bash

# Create deployment user
useradd -m -s /bin/bash deploy
echo "deploy:gptGPT123!@#" | chpasswd

# Add to sudo group
usermod -aG sudo deploy

# Set up SSH directory
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

# Set up application directory
mkdir -p /var/www/formicary-app
chown -R deploy:deploy /var/www/formicary-app

# Install required packages
apt update
apt install -y nodejs npm git
