import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If user has both roles, show role selection
    if (user.userTypes.includes('PRODUCTION_CREW') && user.userTypes.includes('EVENT_ORGANIZER')) {
      return;
    }

    // If user has only one role, redirect to that dashboard
    if (user.userTypes.includes('PRODUCTION_CREW')) {
      navigate('/crew-dashboard');
    } else if (user.userTypes.includes('EVENT_ORGANIZER')) {
      navigate('/organizer-dashboard');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Only show role selection if user has both roles
  if (user.userTypes.includes('PRODUCTION_CREW') && user.userTypes.includes('EVENT_ORGANIZER')) {
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
              size="lg"
              colorScheme="green"
              width="full"
              onClick={() => navigate('/crew-dashboard')}
            >
              Production Crew Dashboard
            </Button>
            <Button
              size="lg"
              colorScheme="green"
              width="full"
              onClick={() => navigate('/organizer-dashboard')}
            >
              Event Organizer Dashboard
            </Button>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return null;
};
