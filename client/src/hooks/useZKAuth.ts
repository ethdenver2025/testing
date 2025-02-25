import { useState, useEffect, useCallback } from 'react';
import ZKSyncAuth from '../services/zkSyncAuth';

interface UseZKAuthReturn {
  isAuthenticated: boolean;
  address: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getSigner: () => Promise<ethers.Signer>;
}

export function useZKAuth(): UseZKAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const auth = ZKSyncAuth.getInstance();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = auth.isAuthenticated();
      setIsAuthenticated(isAuthed);
      if (isAuthed) {
        const addr = await auth.getAddress();
        setAddress(addr);
      }
    };

    checkAuth();
  }, [auth]);

  const login = useCallback(async () => {
    try {
      const { address } = await auth.login();
      setIsAuthenticated(true);
      setAddress(address);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed');
      console.error('Login failed:', error);
      throw error;
    }
  }, [auth]);

  const logout = useCallback(async () => {
    try {
      await auth.logout();
      setIsAuthenticated(false);
      setAddress(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Logout failed');
      console.error('Logout failed:', error);
      throw error;
    }
  }, [auth]);

  const getSigner = useCallback(async () => {
    try {
      return await auth.getSigner();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get signer');
      console.error('Failed to get signer:', error);
      throw error;
    }
  }, [auth]);

  return {
    isAuthenticated,
    address,
    login,
    logout,
    getSigner,
  };
}
