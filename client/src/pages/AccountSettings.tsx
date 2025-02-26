import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Heading,
  HStack,
  Badge,
  Switch,
  Card,
  CardBody,
  IconButton,
  Stack,
} from '@chakra-ui/react';
import { useAuth, UserType } from '../contexts/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const AccountSettings = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [isProductionCrew, setIsProductionCrew] = useState(user?.userTypes?.includes('PRODUCTION_CREW') || false);
  const [isEventOrganizer, setIsEventOrganizer] = useState(user?.userTypes?.includes('EVENT_ORGANIZER') || false);
  const [isEmailNotifications, setIsEmailNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setIsProductionCrew(user.userTypes?.includes('PRODUCTION_CREW') || false);
      setIsEventOrganizer(user.userTypes?.includes('EVENT_ORGANIZER') || false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const selectedRoles: UserType[] = [];
    if (isProductionCrew) selectedRoles.push('PRODUCTION_CREW');
    if (isEventOrganizer) selectedRoles.push('EVENT_ORGANIZER');

    if (selectedRoles.length === 0) {
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
        userTypes: selectedRoles,
      });
      toast({
        title: 'Success',
        description: 'Your profile has been updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(user?.activeRole === 'PRODUCTION_CREW' ? '/crew-dashboard' : '/organizer-dashboard');
  };

  const handleProductionCrewToggle = () => {
    setIsProductionCrew(!isProductionCrew);
  };

  const handleEventOrganizerToggle = () => {
    setIsEventOrganizer(!isEventOrganizer);
  };

  return (
    <Box maxW="4xl" mx="auto" mt={8} p={6}>
      <HStack mb={6} spacing={4} align="center">
        <IconButton
          aria-label="Back"
          icon={<FiArrowLeft />}
          variant="ghost"
          onClick={handleBack}
          size="md"
        />
        <Heading>Account Settings</Heading>
      </HStack>
      
      {/* Profile Information */}
      <Card bg="carbon.800" mb={6}>
        <CardBody>
          <Heading size="md" mb={4}>Profile Information</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={6} align="stretch">
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

              <FormControl isRequired>
                <FormLabel>Account Roles</FormLabel>
                <Stack spacing={4}>
                  <HStack justify="space-between" width="full">
                    <Text>Production Crew</Text>
                    <Switch 
                      id="production-crew"
                      isChecked={isProductionCrew}
                      onChange={handleProductionCrewToggle}
                      colorScheme="green"
                      size="lg"
                    />
                  </HStack>
                  <HStack justify="space-between" width="full">
                    <Text>Event Organizer</Text>
                    <Switch 
                      id="event-organizer"
                      isChecked={isEventOrganizer}
                      onChange={handleEventOrganizerToggle}
                      colorScheme="green"
                      size="lg"
                    />
                  </HStack>
                </Stack>
                <Text fontSize="sm" color="whiteAlpha.600" mt={2}>
                  Select at least one role
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Active Role</FormLabel>
                <Badge
                  colorScheme={user?.activeRole === 'PRODUCTION_CREW' ? 'green' : 'green'}
                  p={2}
                  borderRadius="md"
                >
                  {user?.activeRole === 'PRODUCTION_CREW' ? 'Production Crew' : 'Event Organizer'}
                </Badge>
                <Text fontSize="sm" color="whiteAlpha.600" mt={2}>
                  Switch roles using the profile menu in the navigation bar
                </Text>
              </FormControl>

              <FormControl>
                <FormLabel>Wallet Address</FormLabel>
                <Text fontSize="sm" fontFamily="monospace" opacity={0.8}>
                  {user?.address || 'No wallet connected'}
                </Text>
              </FormControl>

              <Button
                type="submit"
                colorScheme="green"
                isLoading={isLoading}
                mt={4}
              >
                Save Changes
              </Button>
            </VStack>
          </form>
        </CardBody>
      </Card>

      {/* Notification Settings */}
      <Card bg="carbon.800" mb={6}>
        <CardBody>
          <Heading size="md" mb={4}>Notification Settings</Heading>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">
              Email Notifications
            </FormLabel>
            <Switch
              colorScheme="green"
              isChecked={isEmailNotifications}
              onChange={(e) => setIsEmailNotifications(e.target.checked)}
            />
          </FormControl>
        </CardBody>
      </Card>
    </Box>
  );
};
