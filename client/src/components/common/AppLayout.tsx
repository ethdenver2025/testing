import React from 'react';
import { Box } from '@chakra-ui/react';
import AppNavbar from './AppNavbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" bg="gray.900">
      <AppNavbar />
      <Box as="main" pt={2} pb={8}>
        {children}
      </Box>
    </Box>
  );
};
