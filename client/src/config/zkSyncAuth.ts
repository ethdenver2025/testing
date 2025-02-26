import { WalletProvider } from 'zksync-sso';
import { zksyncSepoliaTestnet } from 'viem/chains';
import { createConfig } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { injected } from 'wagmi/connectors';

// Create MetaMask connector
export const metaMaskConnector = injected({
  target: 'metaMask',
  shimDisconnect: true,
});

// Create wagmi config with zkSync Sepolia testnet
export const wagmiConfig = createConfig({
  chains: [zksyncSepoliaTestnet],
  connectors: [metaMaskConnector],
  client: ({ chain }) =>
    createPublicClient({
      chain,
      transport: http(process.env.REACT_APP_RPC_URL || 'https://sepolia.era.zksync.dev'),
    }),
});

// Function to initiate SSO connection with error handling
export const connectWithZkSync = async () => {
  try {
    // Connect with zkSync SSO
    await WalletProvider.connect();
    return true;
  } catch (error) {
    console.error('zkSync connection error:', error);
    throw error;
  }
};
