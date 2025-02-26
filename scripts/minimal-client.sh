#!/bin/bash

echo "Setting up minimal client..."

# Navigate to client directory
cd /var/www/formicary-app/client

# Clean up
rm -rf node_modules build package-lock.json

# Create minimal React app
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
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app"
    ]
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

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": [
    "src"
  ]
}
EOF

# Create minimal React app
mkdir -p src
cat > src/index.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
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
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => setMessage('Error connecting to server'));
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

cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Formicary App</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Install dependencies
npm install

# Build client
npm run build

# Install serve globally
npm install -g serve

# Start client with PM2
pm2 delete formicary-client 2>/dev/null || true
PORT=3000 pm2 start serve --name formicary-client -- -s build -l 3000

# Save PM2 configuration
pm2 save

echo "Minimal client setup completed!"
