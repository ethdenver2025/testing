// Simple compatibility layer for web3 dependencies
import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Create a client configuration that can be used by wagmi
export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});
