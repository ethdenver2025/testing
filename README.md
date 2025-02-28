# Formicary App

[![Build Status](https://img.shields.io/github/actions/workflow/status/ethdenver2025/testing/build.yml?branch=main)](https://github.com/ethdenver2025/testing/actions)
[![License](https://img.shields.io/github/license/ethdenver2025/testing)](https://github.com/ethdenver2025/testing/blob/main/LICENSE)
[![Release](https://img.shields.io/github/v/release/ethdenver2025/testing)](https://github.com/ethdenver2025/testing/releases)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/ethdenver2025/testing/pulls)

A decentralized platform for managing and executing tasks in a distributed worker network.

## Features

- Web3 Wallet Integration with zkSync SSO
- Smart Wallet Authentication
- Worker Dashboard for Task Management
- Organization Management Interface
- Real-time Earnings Tracking
- Performance Analytics
- Multi-role Support (Crew and Organizers)

## Tech Stack

- **Frontend**: React, TypeScript, Chakra UI
- **Blockchain**: Ethereum, zkSync
- **Authentication**: zkSync SSO, Web3 Wallets
- **State Management**: React Context, React Query
- **Wallet Connection**: wagmi v2, viem v2
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask or other Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ethdenver2025/testing.git
cd testing
```

2. Install dependencies:
```bash
cd client
npm install
```

3. Set up environment variables by creating a `.env` file based on `.env.example`.

4. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Development

### Code Structure

- `/client` - Frontend React application
  - `/src/components` - Reusable UI components
  - `/src/contexts` - React context providers
  - `/src/hooks` - Custom React hooks
  - `/src/pages` - Page components
  - `/src/config` - Configuration files

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on the GitHub repository.
