#!/bin/bash

echo "Rebuilding client and fixing permissions..."

cd /var/www/formicary-app/client

# Install dependencies
npm install

# Build client
npm run build

# Fix permissions
chown -R www-data:www-data build/
chmod -R 755 build/

# Create index.html if it doesn't exist
if [ ! -f build/index.html ]; then
    cat > build/index.html << 'EOF'
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
fi

# Restart Nginx
systemctl restart nginx

echo "Client rebuild complete!"
