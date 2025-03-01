import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Define types
export type UserType = 'PRODUCTION_CREW' | 'EVENT_ORGANIZER';

interface UserProfile {
  bio: string;
  skills: string[];
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  walletAddress?: string;
  userTypes: UserType[];
  activeRole?: UserType;
  profile?: UserProfile;
  isProfileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithWallet: () => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  switchRole: (role: UserType) => void;
  handleMockAuth: () => void;
  updateProfile: (data: { username: string; userTypes: UserType[] }) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  isAuthenticated: false,
  loginWithWallet: async () => {},
  loginWithGoogle: async () => {},
  switchRole: () => {},
  handleMockAuth: () => {},
  updateProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Get wagmi hooks
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  // Handle account changes
  useEffect(() => {
    if (address && isConnected && !user?.walletAddress) {
      console.log('Connected wallet detected:', address);
    }
  }, [address, isConnected, user]);

  // Calculate if authenticated
  const isAuthenticated = !!user;

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: 'Demo User',
        username: 'demo_user',
        email: email,
        userTypes: ['PRODUCTION_CREW', 'EVENT_ORGANIZER'],
        activeRole: 'PRODUCTION_CREW',
        profile: {
          bio: 'Experienced production crew member and event organizer',
          skills: ['Audio', 'Lighting', 'Event Management']
        },
        isProfileComplete: true
      };
      
      setUser(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Switch user role
  const switchRole = useCallback((role: UserType) => {
    if (user && user.userTypes.includes(role)) {
      setUser(prev => prev ? { ...prev, activeRole: role } : null);
      
      // Navigate to appropriate dashboard
      if (role === 'PRODUCTION_CREW') {
        navigate('/crew-dashboard');
      } else if (role === 'EVENT_ORGANIZER') {
        navigate('/organizer-dashboard');
      }
    }
  }, [user, navigate]);

  // Login with wallet using wagmi
  const loginWithWallet = async () => {
    setIsLoading(true);
    try {
      // Check if already connected with wagmi
      if (!isConnected) {
        // Connect to wallet using wagmi
        await connectAsync({ connector: injected() });
      }
      
      // Get the connected address
      const walletAddress = address;
      
      if (!walletAddress) {
        throw new Error('Failed to get wallet address');
      }
      
      // Sign a message to prove ownership of the wallet
      const message = `Sign this message to authenticate with Formicary: ${Date.now()}`;
      const signature = await signMessageAsync({ message });
      
      console.log('Wallet authenticated with address:', walletAddress);
      console.log('Signature:', signature);
      
      // In a real app, you would verify this signature on your backend
      // For now, we'll just set mock user data based on the wallet address
      const userData: User = {
        id: '1',
        name: 'Wallet User',
        username: 'wallet_user',
        email: `${walletAddress.substring(0, 8)}@wallet.com`,
        walletAddress: walletAddress,
        userTypes: ['PRODUCTION_CREW'],
        activeRole: 'PRODUCTION_CREW',
        profile: {
          bio: 'Crew member authenticated with wallet',
          skills: ['Video', 'Sound']
        },
        isProfileComplete: true
      };
      
      setUser(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Wallet login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock Google login
  const loginWithGoogle = async (token: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '2',
        name: 'Google User',
        username: 'google_user',
        email: 'google@example.com',
        userTypes: ['EVENT_ORGANIZER'],
        activeRole: 'EVENT_ORGANIZER',
        profile: {
          bio: 'Event organizer authenticated with Google',
          skills: ['Planning', 'Marketing']
        },
        isProfileComplete: true
      };
      
      setUser(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock auth for quick testing
  const handleMockAuth = () => {
    const mockUser: User = {
      id: '3',
      name: 'Mock User',
      username: 'mock_user',
      email: 'mock@example.com',
      userTypes: ['PRODUCTION_CREW', 'EVENT_ORGANIZER'],
      activeRole: 'PRODUCTION_CREW',
      profile: {
        bio: 'Mock user with both roles',
        skills: ['Audio', 'Lighting', 'Event Management']
      },
      isProfileComplete: true
    };
    
    setUser(mockUser);
    navigate('/dashboard');
  };

  // Update profile function
  const updateProfile = async (data: { username: string; userTypes: UserType[] }) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUserData: User = {
        ...user,
        username: data.username,
        userTypes: data.userTypes
      };
      
      setUser(updatedUserData);
    } catch (error) {
      console.error('Update profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated,
        loginWithWallet,
        loginWithGoogle,
        switchRole,
        handleMockAuth,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
