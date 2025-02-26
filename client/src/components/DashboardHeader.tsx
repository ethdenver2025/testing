import React from 'react';
import { Box, Flex, HStack, Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const DashboardHeader = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isCrewDashboard = user?.activeRole === 'PRODUCTION_CREW';
  const basePath = isCrewDashboard ? '/crew-dashboard' : '/organizer-dashboard';

  const getNavItems = () => {
    if (isCrewDashboard) {
      return [
        { path: '/', label: 'Job Board' },
        { path: '/profile', label: 'Profile' },
        { path: '/messages', label: 'Messages' },
      ];
    }
    return [
      { path: '/', label: 'Events' },
      { path: '/profile', label: 'Profile' },
      { path: '/messages', label: 'Messages' },
      { path: '/analytics', label: 'Analytics' },
    ];
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === basePath || location.pathname === basePath + '/';
    }
    return location.pathname === basePath + path;
  };

  return (
    <Box bg="carbon.800" borderBottom="1px" borderColor="carbon.700">
      <Flex px={8} h={14} alignItems="center">
        <HStack spacing={4}>
          {getNavItems().map(({ path, label }) => (
            <Button
              key={path}
              as={Link}
              to={path === '/' ? basePath : basePath + path}
              variant="ghost"
              colorScheme="green"
              size="sm"
              isActive={isActive(path)}
              _active={{
                bg: 'green.500',
                color: 'white',
              }}
            >
              {label}
            </Button>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};
