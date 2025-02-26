#!/bin/bash

# Create a minimal index.html
mkdir -p /var/www/formicary-app/client/build
cat > /var/www/formicary-app/client/build/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Formicary App</title>
</head>
<body>
    <div style="padding: 20px; text-align: center;">
        <h1>Formicary App</h1>
        <p id="message">Loading...</p>
    </div>
    <script>
        fetch('http://104.251.216.17:8000')
            .then(response => response.json())
            .then(data => {
                document.getElementById('message').textContent = data.message;
            })
            .catch(error => {
                document.getElementById('message').textContent = 'Error connecting to server';
            });
    </script>
</body>
</html>
EOF

# Set permissions
chown -R www-data:www-data /var/www/formicary-app/client/build
chmod -R 755 /var/www/formicary-app/client/build

# Configure Nginx with a simpler setup
cat > /etc/nginx/sites-available/formicary-app << 'EOF'
server {
    listen 80;
    server_name 104.251.216.17;

    location / {
        root /var/www/formicary-app/client/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

# Enable site and restart Nginx
ln -sf /etc/nginx/sites-available/formicary-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

echo "Nginx configuration updated!"
