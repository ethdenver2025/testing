// This file provides compatibility helpers for working with various web3 libraries

import { createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet } from 'wagmi/chains';
import { zkSyncSepoliaTestnet } from '../config/chainConfig';

// Create a connector
export const injectedConnector = new InjectedConnector({
  chains: [mainnet, zkSyncSepoliaTestnet],
  options: {
    name: 'MetaMask',
    shimDisconnect: true,
  },
});

// Create a wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [injectedConnector],
});
