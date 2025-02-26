import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  Badge,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorMode,
  Switch,
  useDisclosure,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Select,
} from '@chakra-ui/react';
import { FiSave, FiArrowLeft, FiMoon, FiSun, FiCopy, FiPlus } from 'react-icons/fi';
import { useAuth, UserType } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Profile } from '../components/crew/Profile';
import { TrustProfile } from '../components/crew/TrustProfile';

export const AccountSettings = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [username, setUsername] = useState(user?.username || '');
  const [isProductionCrew, setIsProductionCrew] = useState(user?.userTypes?.includes('PRODUCTION_CREW') || false);
  const [isEventOrganizer, setIsEventOrganizer] = useState(user?.userTypes?.includes('EVENT_ORGANIZER') || false);
  const [isEmailNotifications, setIsEmailNotifications] = useState(false);
  const [isPushNotifications, setIsPushNotifications] = useState(false);
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('Current user:', user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        username,
        userTypes: user?.userTypes || []
      });
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    onClose();
    toast({
      title: 'Account Deleted',
      description: 'Your account has been successfully deleted.',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleConnectWallet = () => {
    // TODO: Implement wallet connection
    toast({
      title: 'Connecting Wallet',
      description: 'Please approve the connection in your wallet.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDisconnectWallet = () => {
    // TODO: Implement wallet disconnection
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCopyAddress = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
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
            <Tab>Trust Profile</Tab>
            <Tab>Preferences</Tab>
            <Tab>Security</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Card>
                <CardHeader>
                  <Heading size="md">Profile Information</Heading>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <Stack spacing={6}>
                      <FormControl>
                        <FormLabel>Username</FormLabel>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your username"
                        />
                      </FormControl>

                      <Box>
                        <Text mb={2} fontWeight="medium">Email</Text>
                        {user?.email && (
                          <HStack>
                            <Text>{user.email}</Text>
                            <Badge colorScheme="green">Verified</Badge>
                          </HStack>
                        )}
                      </Box>

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

                      <Divider />

                      {user?.address && (
                        <Box>
                          <FormLabel>Wallet Address</FormLabel>
                          <Text fontSize="sm" fontFamily="monospace">
                            {truncateAddress(user.address)}
                          </Text>
                          <IconButton
                            aria-label="Copy address"
                            icon={<FiCopy />}
                            size="sm"
                            variant="ghost"
                            onClick={handleCopyAddress}
                          />
                        </Box>
                      )}

                      <Button
                        type="submit"
                        colorScheme="blue"
                        leftIcon={<FiSave />}
                        isLoading={isLoading}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  </form>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel>
              <Profile />
            </TabPanel>

            <TabPanel>
              {user && user.id ? (
                <TrustProfile userId={user.id} />
              ) : (
                <Card>
                  <CardBody>
                    <Text>Your trust profile will be available once you've connected your wallet or received attestations.</Text>
                  </CardBody>
                </Card>
              )}
            </TabPanel>

            <TabPanel>
              <Card>
                <CardBody>
                  <Stack spacing={6}>
                    <Box>
                      <Text mb={2} fontWeight="medium">Theme</Text>
                      <HStack>
                        <IconButton
                          aria-label="Toggle color mode"
                          icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                          onClick={toggleColorMode}
                          colorScheme="green"
                        />
                        <Text>{colorMode === 'light' ? 'Light Mode' : 'Dark Mode'}</Text>
                      </HStack>
                    </Box>

                    <Box>
                      <Text mb={2} fontWeight="medium">Language</Text>
                      <Select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        maxW="200px"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </Select>
                    </Box>

                    <Box>
                      <Text mb={2} fontWeight="medium">Notifications</Text>
                      <VStack align="stretch" spacing={3}>
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

                        <FormControl display="flex" alignItems="center">
                          <Switch
                            id="push-notifications"
                            isChecked={isPushNotifications}
                            onChange={(e) => setIsPushNotifications(e.target.checked)}
                            colorScheme="green"
                          />
                          <FormLabel htmlFor="push-notifications" mb="0" ml={2}>
                            Push Notifications
                          </FormLabel>
                        </FormControl>
                      </VStack>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </TabPanel>

            <TabPanel>
              <Card>
                <CardBody>
                  <Stack spacing={6}>
                    <Box>
                      <Text mb={2} fontWeight="medium">Session Management</Text>
                      <Button colorScheme="red" variant="ghost">Sign Out from All Devices</Button>
                    </Box>

                    <Divider />

                    <Box>
                      <Text color="red.500" fontWeight="medium" mb={2}>Danger Zone</Text>
                      <Text color="gray.500" fontSize="sm" mb={4}>
                        Once you delete your account, there is no going back. Please be certain.
                      </Text>
                      <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={onOpen}
                      >
                        Delete Account
                      </Button>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? This action cannot be undone. All your data will be permanently deleted.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                  Delete Account
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Container>
  );
};
