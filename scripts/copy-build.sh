#!/bin/bash

# Remove old build directory
rm -rf /var/www/formicary-app/client/build

# Set proper permissions
chown -R www-data:www-data /var/www/formicary-app/client/build
chmod -R 755 /var/www/formicary-app/client/build

# Restart Nginx
systemctl restart nginx

echo "Build directory updated and permissions set!"
