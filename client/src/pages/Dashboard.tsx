import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  Button, 
  SimpleGrid, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Card, 
  CardBody
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If user has both roles, show role selection
    if (user.userTypes?.includes('PRODUCTION_CREW') && user.userTypes?.includes('EVENT_ORGANIZER')) {
      return;
    }

    // If user has only one role, redirect to that dashboard
    if (user.userTypes?.includes('PRODUCTION_CREW')) {
      navigate('/crew-dashboard');
    } else if (user.userTypes?.includes('EVENT_ORGANIZER')) {
      navigate('/organizer-dashboard');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Only show role selection if user has both roles
  if (user.userTypes?.includes('PRODUCTION_CREW') && user.userTypes?.includes('EVENT_ORGANIZER')) {
    return (
      <Box maxW="md" mx="auto" mt={16} p={6}>
        <VStack spacing={8} align="stretch">
          <Box textAlign="center">
            <Heading size="lg" mb={2}>Select Dashboard</Heading>
            <Text fontSize="md" color="gray.500">
              Choose which role you want to use
            </Text>
          </Box>
          <VStack spacing={4}>
            <Button 
              onClick={() => navigate('/crew-dashboard')}
              colorScheme="blue"
              size="lg"
              width="100%"
            >
              Production Crew Dashboard
            </Button>
            <Button 
              onClick={() => navigate('/organizer-dashboard')}
              colorScheme="green"
              size="lg"
              width="100%"
            >
              Event Organizer Dashboard
            </Button>
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Demo dashboard with mock data
  return (
    <Box p={5}>
      <Heading mb={6}>Welcome to Formicary!</Heading>
      
      <Text fontSize="lg" mb={6}>
        This is a simplified dashboard for demonstration purposes.
      </Text>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mb={10}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Events</StatLabel>
              <StatNumber>28</StatNumber>
              <StatHelpText>Feb 1 - Feb 28</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Trusted Crew</StatLabel>
              <StatNumber>48</StatNumber>
              <StatHelpText>+15% from last month</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Attestations</StatLabel>
              <StatNumber>124</StatNumber>
              <StatHelpText>+24% from last month</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={10}>
        <VStack align="start" spacing={4}>
          <Heading size="md">Quick Actions</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/create-event')}>
            Create New Event
          </Button>
          <Button colorScheme="teal" onClick={() => navigate('/trusted-crew')}>
            View Trusted Crew
          </Button>
          <Button colorScheme="purple" onClick={() => navigate('/crew-directory')}>
            Browse Crew Directory
          </Button>
        </VStack>
        
        <VStack align="start" spacing={4}>
          <Heading size="md">Account</Heading>
          <Button colorScheme="gray" onClick={() => navigate('/profile-setup')}>
            Update Profile
          </Button>
          <Button colorScheme="gray" onClick={() => navigate('/account-settings')}>
            Account Settings
          </Button>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};
