import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, ChakraProvider } from '@chakra-ui/react';

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

// Import components
import { AppLayout } from './components/common/AppLayout';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <Box>
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

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Box>
  );
};

export default App;
