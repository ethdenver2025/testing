import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Login } from './pages/Login';
import { ProfileSetup } from './pages/ProfileSetup';
import { CrewDashboard } from './pages/CrewDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { AccountSettings } from './pages/AccountSettings';
import { Profile } from './components/crew/Profile';
import { Dashboard } from './pages/Dashboard';
import { theme } from './theme';
import { wagmiConfig } from './config/zkSyncAuth';
import { AuthProvider } from './contexts/AuthContext';

// Create a client for React Query
const queryClient = new QueryClient();

// Use environment variable for Google Client ID with a fallback for development
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '108617364308-977cu4qgir8f8i4qt4r189hl6i31e41l.apps.googleusercontent.com';

const App: React.FC = () => {
  if (!GOOGLE_CLIENT_ID) {
    console.error('Google Client ID is not set in environment variables');
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme={theme}>
            <Router>
              <AuthProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/profile-setup" element={<ProfileSetup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/crew-dashboard/*" element={<CrewDashboard />} />
                  <Route path="/organizer-dashboard/*" element={<OrganizerDashboard />} />
                  <Route path="/account-settings" element={<AccountSettings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Login />} />
                </Routes>
              </AuthProvider>
            </Router>
          </ChakraProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
