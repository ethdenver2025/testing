import React, { useState } from 'react';
import { Box, VStack, Icon, Text, Flex, Tooltip, IconButton } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiBriefcase,
  FiMessageSquare,
  FiCalendar,
  FiPieChart,
  FiUsers,
  FiStar,
  FiFolder,
  FiChevronRight,
  FiChevronLeft,
  FiCheckSquare,
  FiThumbsUp,
  FiAward,
  FiBookOpen,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export const DashboardSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const isCrewDashboard = user?.activeRole === 'PRODUCTION_CREW';
  const basePath = isCrewDashboard ? '/crew-dashboard' : '/organizer-dashboard';

  const getNavItems = () => {
    if (isCrewDashboard) {
      return [
        { path: '/', icon: FiBriefcase, label: 'Job Board' },
        { path: '/messages', icon: FiMessageSquare, label: 'Messages' },
        { path: '/attestations', icon: FiCheckSquare, label: 'Attestations' },
        { path: '/education', icon: FiBookOpen, label: 'Education' },
        { path: '/accolades', icon: FiAward, label: 'Accolades' },
      ];
    }
    return [
      { path: '/', icon: FiCalendar, label: 'Events' },
      { path: '/crew-directory', icon: FiUsers, label: 'Directory' },
      { path: '/trusted-crew', icon: FiStar, label: 'Trusted Crew' },
      { path: '/messages', icon: FiMessageSquare, label: 'Messages' },
      { path: '/attestations', icon: FiThumbsUp, label: 'Attestations' },
      { path: '/analytics', icon: FiPieChart, label: 'Analytics' },
    ];
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === basePath || location.pathname === basePath + '/';
    }
    return location.pathname === basePath + path;
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Box
      position="fixed"
      left={0}
      top="64px"
      h="calc(100vh - 64px)"
      w={isExpanded ? '200px' : '64px'}
      bg="background.secondary"
      transition="width 0.2s ease"
      zIndex={99}
      display="flex"
      flexDirection="column"
    >
      <VStack spacing={2} py={4} align="start" flexGrow={1} width="100%">
        {getNavItems().map(({ path, icon, label }) => (
          <Tooltip key={path} label={label} placement="right" isDisabled={isExpanded}>
            <Flex
              as={Link}
              to={path === '/' ? basePath : basePath + path}
              w={isExpanded ? '90%' : '80%'}
              h="40px"
              align="center"
              justify={isExpanded ? 'flex-start' : 'center'}
              color={isActive(path) ? 'accent.primary' : 'text.secondary'}
              _hover={{
                color: 'accent.hover',
                bg: 'background.tertiary',
              }}
              transition="all 0.2s"
              borderRadius="md"
              mx="auto"
              px={isExpanded ? 4 : 0}
            >
              <Icon as={icon} boxSize="20px" />
              {isExpanded && (
                <Text ml={3} fontWeight="medium">
                  {label}
                </Text>
              )}
            </Flex>
          </Tooltip>
        ))}
      </VStack>

      {/* Toggle button at bottom */}
      <Flex width="100%" justify="center" py={4} borderTop="1px solid" borderColor="border.subtle">
        <IconButton
          aria-label="Toggle sidebar"
          icon={isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
        />
      </Flex>
    </Box>
  );
};
