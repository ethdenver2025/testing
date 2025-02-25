import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletService } from '../services/wallet';
import { useBaseWallet } from './useBaseWallet';

export enum WalletType {
  Standard = 'STANDARD',
  Base = 'BASE'
}

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isInitializing: boolean;
  error: string | null;
  walletType: WalletType | null;
}

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isInitializing: false,
    error: null,
    walletType: null
  });

  const walletService = WalletService.getInstance();
  const baseWallet = useBaseWallet();

  const connect = useCallback(async (type: WalletType = WalletType.Standard) => {
    setState(prev => ({ ...prev, isInitializing: true, error: null }));
    try {
      if (type === WalletType.Base) {
        await baseWallet.connect();
        setState({
          address: baseWallet.address,
          isConnected: true,
          isInitializing: false,
          error: null,
          walletType: WalletType.Base
        });
      } else {
        await walletService.initialize();
        const address = await walletService.getAddress();
        setState({
          address,
          isConnected: true,
          isInitializing: false,
          error: null,
          walletType: WalletType.Standard
        });
      }
    } catch (error) {
      setState({
        address: null,
        isConnected: false,
        isInitializing: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
        walletType: null
      });
    }
  }, [baseWallet]);

  const disconnect = useCallback(async () => {
    if (state.walletType === WalletType.Base) {
      await baseWallet.disconnect();
    }
    setState({
      address: null,
      isConnected: false,
      isInitializing: false,
      error: null,
      walletType: null
    });
  }, [state.walletType, baseWallet]);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (state.walletType === WalletType.Base) {
      return await baseWallet.signMessage(message);
    }
    if (!walletService.isInitialized()) {
      throw new Error('Wallet not connected');
    }
    return await walletService.signMessage(message);
  }, [state.walletType, baseWallet]);

  const sendTransaction = useCallback(async (tx: ethers.providers.TransactionRequest) => {
    if (state.walletType === WalletType.Base) {
      return await baseWallet.sendTransaction(tx);
    }
    if (!walletService.isInitialized()) {
      throw new Error('Wallet not connected');
    }
    return await walletService.sendTransaction(tx);
  }, [state.walletType, baseWallet]);

  // Listen for account changes
  useEffect(() => {
    if (state.walletType === WalletType.Standard && typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (state.isConnected) {
          const address = accounts[0];
          setState(prev => ({ ...prev, address }));
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [state.isConnected, state.walletType, disconnect]);

  return {
    address: state.address,
    isConnected: state.isConnected,
    isInitializing: state.isInitializing,
    error: state.error,
    walletType: state.walletType,
    connect,
    disconnect,
    signMessage,
    sendTransaction,
    // Helper method to check if Base wallet is available
    isBaseWalletAvailable: baseWallet.isAvailable
  };
};
