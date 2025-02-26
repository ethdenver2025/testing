#!/bin/bash

echo "Setting up minimal server..."

# Navigate to server directory
cd /var/www/formicary-app/server

# Clean up
rm -rf node_modules dist package-lock.json

# Create minimal server
cat > src/index.ts << 'EOF'
import express from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
EOF

# Update package.json
cat > package.json << 'EOF'
{
  "name": "@formicary/server",
  "version": "0.1.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.19",
    "typescript": "^5.3.3"
  }
}
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
EOF

# Install dependencies
npm install

# Build server
npm run build

# Start server with PM2
pm2 delete formicary-server 2>/dev/null || true
pm2 start dist/index.js --name formicary-server

# Save PM2 configuration
pm2 save

echo "Minimal server setup completed!"
