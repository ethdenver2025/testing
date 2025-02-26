import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import { DashboardNav } from '../components/DashboardNav';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { JobBoard } from '../components/crew/JobBoard';
import { Profile } from '../components/crew/Profile';
import { Messages } from '../components/crew/Messages';

export const CrewDashboard = () => {
  return (
    <Box minH="100vh" bg="carbon.900">
      <DashboardNav />
      <DashboardSidebar />
      <Box pl="64px" pt="64px">
        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/" element={<JobBoard />} />
        </Routes>
      </Box>
    </Box>
  );
};
