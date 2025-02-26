import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Grid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Mock data for development
  const mockStats = {
    totalEarnings: '1,234.56',
    activeJobs: '3',
    completedJobs: '12',
    reputation: '4.8'
  };

  // Don't render anything while checking auth status
  if (!user || !user.isProfileComplete) {
    return null;
  }

  return (
    <Box minH="100vh" bg="carbon.900">
      {/* Header/Navigation */}
      <Box bg="carbon.800" py={4} px={6} borderBottom="1px" borderColor="carbon.700">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Heading size="md" color="carbon.100">Formicary</Heading>
            
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant="ghost"
                color="carbon.100"
                _hover={{ bg: 'carbon.700' }}
              >
                <HStack spacing={2}>
                  <Avatar size="sm" name={user.username} />
                  <Text>{user.username}</Text>
                </HStack>
              </MenuButton>
              <MenuList bg="carbon.800" borderColor="carbon.700">
                <MenuItem 
                  onClick={handleLogout}
                  _hover={{ bg: 'carbon.700' }}
                  color="carbon.100"
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Welcome Section */}
          <Box bg="carbon.800" p={6} borderRadius="lg">
            <VStack align="start" spacing={4}>
              <Heading size="lg" color="carbon.100">
                Welcome back, {user.username}!
              </Heading>
              <Text color="carbon.300">
                {user.authMethod === 'wallet' 
                  ? `Connected with wallet: ${user.address?.slice(0, 6)}...${user.address?.slice(-4)}`
                  : `Signed in with Google: ${user.email}`
                }
              </Text>
              {user.bio && (
                <>
                  <Divider borderColor="carbon.700" />
                  <Text color="carbon.300">{user.bio}</Text>
                </>
              )}
            </VStack>
          </Box>

          {/* Stats Grid */}
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            <Box bg="carbon.800" p={6} borderRadius="lg">
              <Stat>
                <StatLabel color="carbon.300">Total Earnings</StatLabel>
                <StatNumber color="green.400" fontSize="2xl">${mockStats.totalEarnings}</StatNumber>
                <StatHelpText color="carbon.400">All time earnings</StatHelpText>
              </Stat>
            </Box>

            <Box bg="carbon.800" p={6} borderRadius="lg">
              <Stat>
                <StatLabel color="carbon.300">Active Jobs</StatLabel>
                <StatNumber color="blue.400" fontSize="2xl">{mockStats.activeJobs}</StatNumber>
                <StatHelpText color="carbon.400">Currently in progress</StatHelpText>
              </Stat>
            </Box>

            <Box bg="carbon.800" p={6} borderRadius="lg">
              <Stat>
                <StatLabel color="carbon.300">Completed Jobs</StatLabel>
                <StatNumber color="purple.400" fontSize="2xl">{mockStats.completedJobs}</StatNumber>
                <StatHelpText color="carbon.400">Successfully delivered</StatHelpText>
              </Stat>
            </Box>

            <Box bg="carbon.800" p={6} borderRadius="lg">
              <Stat>
                <StatLabel color="carbon.300">Reputation</StatLabel>
                <StatNumber color="yellow.400" fontSize="2xl">{mockStats.reputation}</StatNumber>
                <StatHelpText color="carbon.400">Average rating</StatHelpText>
              </Stat>
            </Box>
          </Grid>

          {/* Recent Activity */}
          <Box bg="carbon.800" p={6} borderRadius="lg">
            <VStack align="start" spacing={4}>
              <Heading size="md" color="carbon.100">Recent Activity</Heading>
              <Text color="carbon.300">No recent activity to display.</Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};
