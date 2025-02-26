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
import { Dashboard } from './pages/Dashboard';
import { theme } from './theme';
import { wagmiConfig } from './config/zkSyncAuth';
import { AuthProvider } from './contexts/AuthContext';

// Create a client for React Query
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
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
                <Route path="/" element={<Login />} />
              </Routes>
            </AuthProvider>
          </Router>
        </ChakraProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
