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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useAuth, UserType } from '../contexts/AuthContext';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../components/crew/Profile';

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
    navigate(-1);
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
        />
        <Heading size="lg">Account Settings</Heading>
      </HStack>

      <Tabs variant="enclosed" colorScheme="green">
        <TabList>
          <Tab>Account Information</Tab>
          <Tab>Profile Settings</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <CardBody>
                <Stack spacing={6}>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                        />
                      </FormControl>

                      <Box>
                        <Text mb={2} fontWeight="medium">Roles</Text>
                        <HStack spacing={4}>
                          <FormControl display="flex" alignItems="center">
                            <Switch
                              id="production-crew"
                              isChecked={isProductionCrew}
                              onChange={handleProductionCrewToggle}
                              colorScheme="green"
                            />
                            <FormLabel htmlFor="production-crew" mb="0" ml={2}>
                              Production Crew
                            </FormLabel>
                          </FormControl>

                          <FormControl display="flex" alignItems="center">
                            <Switch
                              id="event-organizer"
                              isChecked={isEventOrganizer}
                              onChange={handleEventOrganizerToggle}
                              colorScheme="green"
                            />
                            <FormLabel htmlFor="event-organizer" mb="0" ml={2}>
                              Event Organizer
                            </FormLabel>
                          </FormControl>
                        </HStack>
                      </Box>

                      <Box>
                        <Text mb={2} fontWeight="medium">Notifications</Text>
                        <FormControl display="flex" alignItems="center">
                          <Switch
                            id="email-notifications"
                            isChecked={isEmailNotifications}
                            onChange={(e) => setIsEmailNotifications(e.target.checked)}
                            colorScheme="green"
                          />
                          <FormLabel htmlFor="email-notifications" mb="0" ml={2}>
                            Email Notifications
                          </FormLabel>
                        </FormControl>
                      </Box>

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
                </Stack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Profile />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
