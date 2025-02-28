import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import { DashboardNav } from '../components/DashboardNav';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { JobBoard } from '../components/crew/JobBoard';
import { Messages } from '../components/crew/Messages';
import { Attestations } from '../components/crew/Attestations';
import { Education } from '../components/crew/Education';
import { Accolades } from '../components/crew/Accolades';

export const CrewDashboard = () => {
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
            <Route path="/" element={<JobBoard />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/attestations" element={<Attestations />} />
            <Route path="/education" element={<Education />} />
            <Route path="/accolades" element={<Accolades />} />
            <Route path="*" element={<Navigate to="/crew-dashboard" />} />
          </Routes>
        </Box>
      </Flex>
    </Flex>
  );
};
