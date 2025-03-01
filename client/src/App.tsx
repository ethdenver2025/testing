import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import configs and web3 utilities
import { wagmiConfig } from './utils/web3CompatLayer';

// Import context providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import OnchainKitProvider from './components/providers/OnchainKitProvider';

// Import pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { ProfileSetup } from './pages/ProfileSetup';
import { CrewDashboard } from './pages/CrewDashboard';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { AccountSettings } from './pages/AccountSettings';
import { CrewProfile } from './pages/CrewProfile';
import { CreateEvent } from './pages/CreateEvent';
import ManageEvent from './pages/ManageEvent';  
import CrewDirectory from './pages/CrewDirectory';
import TrustedCrew from './pages/TrustedCrew';
import Attestations from './pages/Attestations';
import Payments from './pages/Payments';
import PaymentsStandalone from './pages/PaymentsStandalone';
import Messages from './pages/Messages';
import Home from './pages/Home';
import Register from './pages/Register';
import Analytics from './pages/Analytics';
import PaymentProcessing from './pages/PaymentProcessing';
import TestPayment from './components/payments/TestPayment';
import SimpleTest from './components/payments/SimpleTest';

// Import components
import { AppLayout } from './components/common/AppLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Heading, Text, Center, Spinner, VStack, Button } from '@chakra-ui/react';

// Define theme with color mode config
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

// Coinbase API key (to be replaced with your own key in production)
const coinbaseApiKey = process.env.REACT_APP_COINBASE_API_KEY || "organizations/0b8a9fc9-65b5-48af-9b6f-c9f1e169a93e/apiKeys/362f2d6f-a23c-408c-81f6-6de651a04ecc";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={<Box p={5}>Something went wrong</Box>}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Router>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <ErrorBoundary fallback={<Box p={5}>Error loading web3 components</Box>}>
                  <OnchainKitProvider apiKey={coinbaseApiKey}>
                    <AppRoutes />
                  </OnchainKitProvider>
                </ErrorBoundary>
              </AuthProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </Router>
      </ChakraProvider>
    </ErrorBoundary>
  );
};

// Separate component for routes that needs access to AuthContext
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Box minH="100vh" p={4}>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />

        <Route path="/profile-setup" element={
          isAuthenticated ? <ProfileSetup /> : <Navigate to="/login" />
        } />

        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
        } />

        <Route path="/crew-dashboard/*" element={
          isAuthenticated ? <CrewDashboard /> : <Navigate to="/login" />
        } />

        <Route path="/organizer-dashboard/*" element={
          isAuthenticated ? <OrganizerDashboard /> : <Navigate to="/login" />
        } />

        <Route path="/account-settings" element={
          isAuthenticated ? 
          <AppLayout>
            <AccountSettings />
          </AppLayout> 
          : <Navigate to="/login" />
        } />
  
        <Route path="/crew/:id" element={
          isAuthenticated ? 
          <AppLayout>
            <CrewProfile />
          </AppLayout> 
          : <Navigate to="/login" />
        } />
  
        <Route path="/create-event" element={
          isAuthenticated ? 
          <AppLayout>
            <CreateEvent />
          </AppLayout> 
          : <Navigate to="/login" />
        } />
        
        <Route path="/events/:id" element={
          isAuthenticated ? 
          <AppLayout>
            <ManageEvent />
          </AppLayout> 
          : <Navigate to="/login" />
        } />
        
        <Route path="/organizer-dashboard/trusted-crew" element={
          isAuthenticated ? 
          <AppLayout>
            <TrustedCrew />
          </AppLayout> 
          : <Navigate to="/login" />
        } />
        
        <Route path="/organizer-dashboard/payments" element={
          isAuthenticated ? 
          <AppLayout>
            <Payments />
          </AppLayout> 
          : <Navigate to="/login" />
        } />
        
        <Route path="/payments" element={
          <AppLayout>
            <Payments />
          </AppLayout> 
        } />
        
        <Route path="/payments-page" element={
          <AppLayout>
            <Payments />
          </AppLayout> 
        } />
        
        <Route path="/dashboard/payments" element={
          <AppLayout>
            <Payments />
          </AppLayout> 
        } />
        
        <Route path="/organizer-dashboard/messages" element={
          isAuthenticated ? 
          <AppLayout>
            <Messages />
          </AppLayout> 
          : <Navigate to="/login" />
        } />
        
        <Route path="/emergency-payments" element={
          <AppLayout>
            <iframe src="emergency-payments.html" frameBorder="0" width="100%" height="100%"></iframe>
          </AppLayout> 
        } />
        
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Box>
  );
};

export default App;
