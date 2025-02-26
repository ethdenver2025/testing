import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isInitializing: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isInitializing: false,
    error: null
  });

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('No Ethereum wallet found. Please install MetaMask.');
    }

    setState(prev => ({ ...prev, isInitializing: true, error: null }));

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        setState({
          address: accounts[0],
          isConnected: true,
          isInitializing: false,
          error: null
        });
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      }));
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    setState({
      address: null,
      isConnected: false,
      isInitializing: false,
      error: null
    });
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const accounts = await provider.listAccounts();
          if (accounts.length > 0) {
            setState({
              address: accounts[0],
              isConnected: true,
              isInitializing: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setState({
            address: accounts[0],
            isConnected: true,
            isInitializing: false,
            error: null
          });
        } else {
          setState({
            address: null,
            isConnected: false,
            isInitializing: false,
            error: null
          });
        }
      });
    }
  }, []);

  return {
    ...state,
    connect,
    disconnect
  };
};
