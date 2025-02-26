#!/bin/bash

echo "Setting up minimal application..."

# Navigate to app directory
cd /var/www/formicary-app

# Kill existing processes
fuser -k 3000/tcp
fuser -k 8000/tcp

# Create server directory
mkdir -p server
cd server

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@formicary/server",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}
EOF

# Create server code
cat > index.js << 'EOF'
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.listen(8000, '0.0.0.0', () => {
    console.log('Server running on port 8000');
});
EOF

# Install server dependencies
npm install

# Create client directory
cd ..
mkdir -p client
cd client

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@formicary/client",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@types/node": "^16.18.80",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "typescript": "^4.9.5"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "DISABLE_ESLINT_PLUGIN=true react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOF

# Create minimal React app
mkdir -p src
cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

cat > src/App.tsx << 'EOF'
import React, { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('http://104.251.216.17:8000')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage('Error connecting to server'));
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Formicary App</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
EOF

# Install client dependencies and build
npm install
npm run build

# Install serve globally if not already installed
npm install -g serve

# Start both applications with PM2
cd ..
pm2 delete all
pm2 start server/index.js --name formicary-server
PORT=3000 pm2 start serve --name formicary-client -- -s client/build -l 3000

# Save PM2 configuration
pm2 save

echo "Minimal application setup complete!"
