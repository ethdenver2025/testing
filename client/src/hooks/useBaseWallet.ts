import { useState, useCallback } from 'react';
import { ethers } from 'ethers';

interface BaseWalletState {
  address: string | null;
  isConnected: boolean;
  isInitializing: boolean;
  error: string | null;
}

export const useBaseWallet = () => {
  const [state, setState] = useState<BaseWalletState>({
    address: null,
    isConnected: false,
    isInitializing: false,
    error: null,
  });

  // Check if Base Wallet is available
  const isAvailable = typeof window !== 'undefined' && 'ethereum' in window && window.ethereum?.isBase;

  const connect = useCallback(async () => {
    if (!isAvailable) {
      throw new Error('Base Wallet is not available. Please install Base Wallet extension.');
    }

    setState(prev => ({ ...prev, isInitializing: true, error: null }));
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];

      // Switch to Base network if not already on it
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // Base mainnet chainId
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to Base Wallet
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x2105',
              chainName: 'Base',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org']
            }]
          });
        }
      }

      setState({
        address,
        isConnected: true,
        isInitializing: false,
        error: null,
      });
    } catch (error) {
      setState({
        address: null,
        isConnected: false,
        isInitializing: false,
        error: error instanceof Error ? error.message : 'Failed to connect Base Wallet',
      });
      throw error;
    }
  }, [isAvailable]);

  const disconnect = useCallback(async () => {
    setState({
      address: null,
      isConnected: false,
      isInitializing: false,
      error: null,
    });
  }, []);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!state.isConnected || !state.address) {
      throw new Error('Base Wallet not connected');
    }

    try {
      return await window.ethereum.request({
        method: 'personal_sign',
        params: [message, state.address],
      });
    } catch (error) {
      throw new Error('Failed to sign message with Base Wallet');
    }
  }, [state.isConnected, state.address]);

  const sendTransaction = useCallback(async (tx: ethers.providers.TransactionRequest): Promise<any> => {
    if (!state.isConnected || !state.address) {
      throw new Error('Base Wallet not connected');
    }

    try {
      // Create a Web3Provider using Base Wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Send the transaction
      return await signer.sendTransaction(tx);
    } catch (error) {
      throw new Error('Failed to send transaction with Base Wallet');
    }
  }, [state.isConnected, state.address]);

  return {
    ...state,
    isAvailable,
    connect,
    disconnect,
    signMessage,
    sendTransaction,
  };
};
