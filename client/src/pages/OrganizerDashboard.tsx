import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import { DashboardNav } from '../components/DashboardNav';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Events } from '../components/organizer/Events';
import { Profile } from '../components/organizer/Profile';
import { Messages } from '../components/organizer/Messages';
import { Analytics } from '../components/organizer/Analytics';

export const OrganizerDashboard = () => {
  return (
    <Box minH="100vh" bg="carbon.900">
      <DashboardNav />
      <DashboardSidebar />
      <Box pl="64px" pt="64px">
        <Routes>
          <Route path="/organizer-dashboard/profile" element={<Profile />} />
          <Route path="/organizer-dashboard/messages" element={<Messages />} />
          <Route path="/organizer-dashboard/analytics" element={<Analytics />} />
          <Route path="/organizer-dashboard" element={<Events />} />
        </Routes>
      </Box>
    </Box>
  );
};
