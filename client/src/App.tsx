import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';

// Import context providers
import { AuthProvider } from './contexts/AuthContext';
import OnchainKitProvider from './components/providers/OnchainKitProvider';

// Import pages
import { CrewDirectory } from './pages/CrewDirectory';
import { CrewProfile } from './pages/CrewProfile';
import { CreateEvent } from './pages/CreateEvent';
import { TrustedCrewRoster } from './pages/TrustedCrewRoster';
import { OrganizerDashboard } from './pages/OrganizerDashboard';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { ProfileSetup } from './pages/ProfileSetup';
import { CrewDashboard } from './pages/CrewDashboard';
import { AccountSettings } from './pages/AccountSettings';
import { LandingPage } from './pages/LandingPage';

// Import components
import { AppLayout } from './components/common/AppLayout';
import TestCoinbasePayment from './components/payments/TestCoinbasePayment';
import ErrorBoundary from './components/common/ErrorBoundary';
import SimpleTest from './components/test/SimpleTest';

// Import context
import { useAuth } from './contexts/AuthContext';

// Define theme with color mode config
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

// The Coinbase API key 
const coinbaseApiKey = "organizations/0b8a9fc9-65b5-48af-9b6f-c9f1e169a93e/apiKeys/362f2d6f-a23c-408c-81f6-6de651a04ecc";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AuthProvider>
          <OnchainKitProvider apiKey={coinbaseApiKey}>
            <AppRoutes />
          </OnchainKitProvider>
        </AuthProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
};

// Separate component for routes that needs access to AuthContext
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Box minH="100vh">
      <Router>
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

          <Route path="/test-payment" element={
            <ErrorBoundary>
              <TestCoinbasePayment />
            </ErrorBoundary>
          } />
          
          <Route path="/simple-test" element={<SimpleTest />} />
    
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default App;
