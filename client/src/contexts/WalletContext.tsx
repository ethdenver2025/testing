import React, { createContext, useContext, useState, useCallback } from 'react';
import { useBaseWallet } from '../hooks/useBaseWallet';

interface WalletContextType {
  account: string | null;
  balance: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { account, balance, connect: baseConnect, disconnect: baseDisconnect } = useBaseWallet();

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await baseConnect();
    } finally {
      setIsConnecting(false);
    }
  }, [baseConnect]);

  const value = {
    account,
    balance,
    connect,
    disconnect: baseDisconnect,
    isConnecting
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
