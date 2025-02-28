import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { DashboardNav } from '../components/DashboardNav';
import { Events } from '../components/organizer/Events';
import { CrewDirectory } from './CrewDirectory';
import { TrustedCrewRoster } from './TrustedCrewRoster';
import { Messages } from '../components/organizer/Messages';
import { Analytics } from '../components/organizer/Analytics';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { Attestations } from '../components/organizer/Attestations';

const OrganizerDashboard = () => {
  return (
    <Flex direction="column" h="100vh" bg="background.primary">
      <DashboardNav />
      <Flex flexGrow={1}>
        <DashboardSidebar />
        <Box
          pl={{ base: '64px', md: '64px' }}
          pt="64px"
          flexGrow={1}
          transition="padding-left 0.2s ease"
        >
          <Routes>
            <Route path="/" element={<Events />} />
            <Route path="/crew-directory" element={<CrewDirectory />} />
            <Route path="/trusted-crew" element={<TrustedCrewRoster />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/attestations" element={<Attestations />} />
            <Route path="*" element={<Navigate to="/organizer-dashboard" />} />
          </Routes>
        </Box>
      </Flex>
    </Flex>
  );
};

export { OrganizerDashboard };
