import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Heading,
  Card,
  CardBody,
  Stack,
  Switch,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useAuth, UserType } from '../contexts/AuthContext';

export const ProfileSetup = () => {
  const { updateProfile, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [isProduction, setIsProduction] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: 'Error',
        description: 'Username is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const roles: UserType[] = [];
    if (isProduction) roles.push('PRODUCTION_CREW');
    if (isOrganizer) roles.push('EVENT_ORGANIZER');

    if (!isProduction && !isOrganizer) {
      toast({
        title: 'Error',
        description: 'Please select at least one role',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile({
        username: username.trim(),
        userTypes: roles
      });
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to set up profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={16} p={6}>
      <Card bg="carbon.800">
        <CardBody>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" mb={2}>Welcome to Formicary</Heading>
              <Text fontSize="md" color="whiteAlpha.700">
                Let's set up your profile
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    minLength={3}
                    maxLength={30}
                    pattern="[a-zA-Z0-9_-]+"
                    title="Only letters, numbers, underscores, and hyphens allowed"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Account Roles</FormLabel>
                  <Stack spacing={4}>
                    <HStack justify="space-between" width="full">
                      <Text>Production Crew</Text>
                      <Switch 
                        id="production-crew"
                        isChecked={isProduction}
                        onChange={() => setIsProduction(!isProduction)}
                        colorScheme="green"
                        size="lg"
                      />
                    </HStack>
                    <HStack justify="space-between" width="full">
                      <Text>Event Organizer</Text>
                      <Switch 
                        id="event-organizer"
                        isChecked={isOrganizer}
                        onChange={() => setIsOrganizer(!isOrganizer)}
                        colorScheme="green"
                        size="lg"
                      />
                    </HStack>
                  </Stack>
                  <Text fontSize="sm" color="whiteAlpha.600" mt={2}>
                    Select at least one role to continue.
                  </Text>
                </FormControl>

                <HStack spacing={4} width="full">
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                  >
                    Complete Setup
                  </Button>
                  <Button
                    colorScheme="red"
                    variant="ghost"
                    size="lg"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </HStack>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};
