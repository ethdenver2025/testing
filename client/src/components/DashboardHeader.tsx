import React from 'react';
import { Box, Flex, HStack, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useColorModeValue } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormicaryLogo from './FormicaryLogo';

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
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} py={2} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Link to={basePath}>
            <FormicaryLogo width="32px" height="32px" />
          </Link>
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
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
        </HStack>
      </Flex>
    </Box>
  );
};
