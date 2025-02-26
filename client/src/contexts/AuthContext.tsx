import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import { useZkSyncAuth } from '../hooks/useZkSyncAuth';
import { TokenResponse } from '@react-oauth/google';

export type UserType = 'PRODUCTION_CREW' | 'EVENT_ORGANIZER';

interface User {
  address?: string;
  username: string;
  email?: string;
  userTypes: UserType[];
  activeRole?: UserType;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  loginWithWallet: () => Promise<void>;
  loginWithGoogle: (response: TokenResponse) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: { username: string; userTypes: UserType[] }) => Promise<void>;
  switchRole: (role: UserType) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { connectWallet, handleDisconnect, isConnected, address } = useZkSyncAuth();

  const loginWithWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const walletAddress = await connectWallet();
      
      if (!walletAddress) {
        throw new Error('Failed to connect wallet');
      }

      // Initialize user with wallet address
      setUser({
        address: walletAddress,
        username: '',
        userTypes: []
      });

      // Redirect to profile setup if no username
      navigate('/profile-setup');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to login');
      setError(error);
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [connectWallet, navigate, toast]);

  const loginWithGoogle = useCallback(async (response: TokenResponse) => {
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Verify token with backend
      // For now, just use the access token to get user info
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to get user info from Google');
      }

      const userInfo = await userInfoResponse.json();
      console.log('Google user info:', userInfo); // Debug log

      // Initialize user with Google info
      setUser({
        username: userInfo.name || '',
        email: userInfo.email,
        userTypes: []
      });

      // Redirect to profile setup if no username
      navigate('/profile-setup');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get Google user info');
      setError(error);
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  const logout = useCallback(() => {
    handleDisconnect();
    setUser(null);
    navigate('/');
  }, [handleDisconnect, navigate]);

  const updateProfile = useCallback(async (profile: { username: string; userTypes: UserType[] }) => {
    if (!user) throw new Error('No user logged in');
    
    // Keep the current active role if it's still in userTypes, otherwise use the first role
    const updatedUser = {
      ...user,
      username: profile.username,
      userTypes: profile.userTypes,
      activeRole: profile.userTypes.includes(user.activeRole || '') 
        ? user.activeRole 
        : profile.userTypes[0]
    };
    
    setUser(updatedUser);

    // Navigate to the appropriate dashboard based on active role
    const dashboardPath = updatedUser.activeRole === 'PRODUCTION_CREW' ? '/crew-dashboard' : '/organizer-dashboard';
    navigate(dashboardPath);
  }, [user, navigate]);

  const switchRole = useCallback((role: UserType) => {
    if (!user) return;
    if (!user.userTypes.includes(role)) return;

    setUser(prev => prev ? { ...prev, activeRole: role } : null);

    // Navigate to the appropriate dashboard
    const dashboardPath = role === 'PRODUCTION_CREW' ? '/crew-dashboard' : '/organizer-dashboard';
    navigate(dashboardPath);
  }, [user, navigate]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      loginWithWallet,
      loginWithGoogle,
      logout,
      updateProfile,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
