// This file provides compatibility helpers for working with viem/wagmi

import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { createPublicClient, custom } from 'viem';

// Create the wagmi config
export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

// Helper function to check if window.ethereum is available
export const isMetaMaskAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Helper to get the current chain ID using viem
export const getCurrentChainId = async (): Promise<number | null> => {
  if (!isMetaMaskAvailable()) {
    return null;
  }
  
  try {
    // Create a public client with window.ethereum
    if (typeof window !== 'undefined' && window.ethereum) {
      const publicClient = createPublicClient({
        transport: custom(window.ethereum)
      });
      
      // Get the chain ID
      const chainId = await publicClient.request({ method: 'eth_chainId' });
      return parseInt(chainId, 16);
    }
    return null;
  } catch (error) {
    console.error('Error getting chain ID:', error);
    return null;
  }
};

// Format address for display
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Format amount with currency symbol
export const formatAmount = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};
