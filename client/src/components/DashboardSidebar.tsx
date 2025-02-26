import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Text,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiBriefcase, 
  FiUser, 
  FiMessageSquare, 
  FiCalendar,
  FiPieChart,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isCrewDashboard = user?.activeRole === 'PRODUCTION_CREW';
  const basePath = isCrewDashboard ? '/crew-dashboard' : '/organizer-dashboard';

  const getNavItems = () => {
    if (isCrewDashboard) {
      return [
        { path: '/', icon: FiBriefcase, label: 'Job Board' },
        { path: '/profile', icon: FiUser, label: 'Profile' },
        { path: '/messages', icon: FiMessageSquare, label: 'Messages' },
      ];
    }
    return [
      { path: '/', icon: FiCalendar, label: 'Events' },
      { path: '/profile', icon: FiUser, label: 'Profile' },
      { path: '/messages', icon: FiMessageSquare, label: 'Messages' },
      { path: '/analytics', icon: FiPieChart, label: 'Analytics' },
    ];
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === basePath || location.pathname === basePath + '/';
    }
    return location.pathname === basePath + path;
  };

  return (
    <Box
      position="fixed"
      left={0}
      top="64px"
      h="calc(100vh - 64px)"
      w="64px"
      bg="carbon.800"
      borderRight="1px"
      borderColor="carbon.700"
    >
      <VStack spacing={2} py={4}>
        {getNavItems().map(({ path, icon, label }) => (
          <Tooltip key={path} label={label} placement="right">
            <Box w="full">
              <Flex
                as={Link}
                to={path === '/' ? basePath : basePath + path}
                w="full"
                h="40px"
                align="center"
                justify="center"
                color={isActive(path) ? 'green.500' : 'gray.400'}
                _hover={{
                  color: 'green.500',
                  bg: 'carbon.700',
                }}
                transition="all 0.2s"
              >
                <Icon as={icon} boxSize="20px" />
              </Flex>
            </Box>
          </Tooltip>
        ))}
      </VStack>
    </Box>
  );
};
