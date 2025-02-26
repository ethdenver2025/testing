#!/bin/bash

# Create deployment user
useradd -m -s /bin/bash deploy
echo "deploy:gptGPT123!@#" | chpasswd

# Add to sudo group
usermod -aG sudo deploy

# Set up SSH directory
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

# Add our deployment key
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILUkXOin6arIxZb/v1CzsFETCqIb1zyqWgqUASd2ZBXJ deploy@formicary" > /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

# Set up application directory
mkdir -p /var/www/formicary-app
chown -R deploy:deploy /var/www/formicary-app

# Install Node.js and other dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs git

# Install PM2 globally
npm install -g pm2

# Configure SSH to allow password authentication temporarily
sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
systemctl restart sshd
