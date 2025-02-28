// Simple compatibility layer for web3 dependencies
import { createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { mainnet } from 'wagmi/chains';
import { Chain } from 'wagmi';

// Define zkSync Era Sepolia Testnet
export const zkSync: Chain = {
  id: 300,
  name: 'zkSync Era Sepolia',
  network: 'zksync-sepolia',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://sepolia.era.zksync.dev'] },
    public: { http: ['https://sepolia.era.zksync.dev'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://sepolia.explorer.zksync.io' },
  },
  testnet: true,
};

// Create the connector
export const injectedConnector = new InjectedConnector({
  chains: [mainnet, zkSync],
});

// Create a basic wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [injectedConnector],
});
