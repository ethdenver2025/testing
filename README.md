# Formicary App

[![Build Status](https://img.shields.io/github/actions/workflow/status/ethdenver2025/testing/build.yml?branch=main)](https://github.com/ethdenver2025/testing/actions)
[![License](https://img.shields.io/github/license/ethdenver2025/testing)](https://github.com/ethdenver2025/testing/blob/main/LICENSE)
[![Version](https://img.shields.io/github/package-json/v/ethdenver2025/testing)](https://github.com/ethdenver2025/testing)
[![Last Commit](https://img.shields.io/github/last-commit/ethdenver2025/testing)](https://github.com/ethdenver2025/testing/commits/main)
[![Issues](https://img.shields.io/github/issues/ethdenver2025/testing)](https://github.com/ethdenver2025/testing/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ethdenver2025/testing/pulls)

## Overview

Formicary is a decentralized labor coordination platform revolutionizing on-demand workforce management across corporate events, film production, construction, and disaster response industries. Built on a robust web-of-trust reputation system, the platform connects clients with skilled workers through a transparent bidding process secured by USDC escrow payments.

The platform features a tiered progression system where workers advance through peer-validated skill assessments, while AI-driven job matching optimizes workforce allocation based on skills, location, and availability. Governance is maintained through a liquid democracy model and a peer court system for efficient dispute resolution.

Beyond job matching, Formicary provides comprehensive career development with upskilling opportunities, gamified progression paths, and DAO membership benefits including shared insurance pools and participation in platform governance.

## Features

- Web3 Wallet Integration
- Dual Dashboard System (Crew & Organizer)
- Skill Attestation & Trust Network
- Job Board with Smart Matching
- Education & Upskilling Platform
- Career Milestone Tracking
- Real-time Earnings Analytics
- Liquid Democracy Governance

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or other Web3 wallet
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/formicary/formicary-app.git
cd formicary-app
```

2. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies (optional)
cd ../server
npm install
```

3. Start the development servers:
```bash
# Start client development server
cd client
npm start

# Start server (in a separate terminal)
cd server
npm start
```

The app will be available at http://localhost:3001

### Docker Deployment

For containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Build individual containers
docker build -t formicary-client ./client
docker build -t formicary-server ./server

# Run containers
docker run -p 3001:3001 formicary-client
docker run -p 3000:3000 formicary-server
```

## Development Stack

- React 18
- TypeScript
- Chakra UI
- Ethers.js & wagmi
- Express.js backend
- PostgreSQL database
- zkSync SSO SDK

## Project Structure

```
formicary-app/
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── common/     # Shared UI components
│   │   │   ├── crew/       # Crew dashboard components
│   │   │   └── organizer/  # Organizer dashboard components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and blockchain services
│   │   ├── utils/          # Utility functions
│   │   └── contracts/      # Smart contract ABIs
│   ├── public/             # Static assets
│   └── package.json        # Dependencies and scripts
├── server/                 # Backend API server
│   ├── src/                # Server source code
│   ├── models/             # Database models
│   └── package.json        # Server dependencies
├── .ai_context.txt         # AI development context and history
└── README.md
```

## Scripts

```bash
# Client scripts
npm start           # Start development server
npm test            # Run tests
npm run build       # Build for production
npm run lint        # Run linter
npm run format      # Format code with Prettier

# Server scripts
npm start           # Start server
npm run dev         # Start server with nodemon
npm run seed        # Seed database with sample data
npm run test        # Run server tests
```

## Development Process
