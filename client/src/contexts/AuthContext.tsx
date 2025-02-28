import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Demo User',
    username: 'demo_user',
    email: 'demo@example.com',
    walletAddress: '0x1234...5678',
    userTypes: ['PRODUCTION_CREW', 'EVENT_ORGANIZER'],
    activeRole: 'PRODUCTION_CREW',
    profile: {
      bio: 'Experienced production crew member and event organizer',
      skills: ['Audio', 'Lighting', 'Event Management']
    },
    isProfileComplete: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  // Mock wallet login
  const loginWithWallet = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const userData: User = {
        id: '1',
        name: 'Wallet User',
        username: 'wallet_user',
        email: 'wallet@example.com',
        walletAddress: '0x1234...5678',
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
        handleMockAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
