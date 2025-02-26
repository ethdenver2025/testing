import { useState, useCallback } from 'react';
import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { metaMaskConnector } from '../config/zkSyncAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export const useZkSyncAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const navigate = useNavigate();
  const toast = useToast();

  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Connect using MetaMask connector
      await connect({ connector: metaMaskConnector });

      // Wait briefly for the address to be available
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!address) {
        throw new Error('Failed to get wallet address');
      }

      return address;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect'));
      console.error('Connection error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [connect, address]);

  const handleDisconnect = useCallback(() => {
    try {
      disconnect();
      // Clear any wagmi-related storage
      localStorage.removeItem('wagmi.wallet');
      localStorage.removeItem('wagmi.connected');
      localStorage.removeItem('wagmi.store');
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  }, [disconnect]);

  return {
    connectWallet,
    handleDisconnect,
    isConnected,
    address,
    isLoading,
    error
  };
};
