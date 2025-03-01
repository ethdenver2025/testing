import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Flex,
  Icon,
  Badge,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaDollarSign, FaCheck } from 'react-icons/fa';
import CrewMatchingPanel from '../components/events/CrewMatchingPanel';

// Sample event types
const eventTypes = [
  "Film Production",
  "Documentary",
  "Music Video",
  "Commercial",
  "Corporate Video",
  "Live Event",
  "Short Film",
  "Feature Film",
  "Web Series",
  "TV Show"
];

// Sample roles
const sampleRoles = [
  { role: "Camera Operator", crewMemberId: undefined },
  { role: "Sound Engineer", crewMemberId: undefined },
  { role: "Lighting Technician", crewMemberId: undefined },
  { role: "Production Assistant", crewMemberId: undefined },
];

interface CrewMember {
  id: string;
  username: string;
  trustScore: number | null;
  skills: string[];
  topSkill?: {
    name: string;
    rating: number;
  };
  attestationCount: number;
}

export const CreateEvent = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventRoles, setEventRoles] = useState(sampleRoles);
  const toast = useToast();

  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const borderColor = useColorModeValue('gray.700', 'gray.800');

  // Handle crew member selection for a role
  const handleCrewSelected = (crewMember: CrewMember, role: string) => {
    setEventRoles(prevRoles => {
      return prevRoles.map(r => 
        r.role === role ? { ...r, crewMemberId: crewMember.id } : r
      );
    });

    toast({
      title: 'Crew Member Added',
      description: `${crewMember.username} has been assigned to the role of ${role}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleTabChange = (index: number) => {
    // Validate the current tab before allowing to proceed
    if (tabIndex === 0 && index > 0) {
      // Validate event details 
      // This is just a mock validation - in a real app, you'd check all required fields
      const isValid = true;
      
      if (!isValid) {
        toast({
          title: 'Missing information',
          description: 'Please fill in all required fields before proceeding',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    setTabIndex(index);
  };

  const handleCreateEvent = () => {
    setIsSubmitting(true);
    
    // Mock submission
    setTimeout(() => {
      toast({
        title: 'Event Created',
        description: 'Your event has been created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setIsSubmitting(false);
      // Here you would typically redirect to the event page
    }, 2000);
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading size="xl" mb={2} color="white">
        Create New Event
      </Heading>
      <Text color="gray.400" mb={6}>
        Create a new production event and find trusted crew with verified skills
      </Text>

      <Box
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        <Tabs 
          index={tabIndex} 
          onChange={handleTabChange}
          colorScheme="blue"
          variant="enclosed"
        >
          <TabList bg="gray.700" p={2}>
            <Tab 
              _selected={{ color: 'white', bg: 'blue.600' }}
              _hover={{ bg: 'gray.600' }}
            >
              <Icon as={FaCalendarAlt} mr={2} />
              Event Details
            </Tab>
            <Tab 
              _selected={{ color: 'white', bg: 'blue.600' }}
              _hover={{ bg: 'gray.600' }}
            >
              <Icon as={FaUsers} mr={2} />
              Crew Assignment
            </Tab>
            <Tab 
              _selected={{ color: 'white', bg: 'blue.600' }}
              _hover={{ bg: 'gray.600' }}
            >
              <Icon as={FaDollarSign} mr={2} />
              Budget & Rates
            </Tab>
          </TabList>

          <TabPanels>
            {/* Event Details Panel */}
            <TabPanel p={6}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Event Title</FormLabel>
                  <Input
                    placeholder="e.g. Urban Documentary Shoot"
                    bg="gray.700"
                    border="none"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Event Type</FormLabel>
                  <Select 
                    placeholder="Select event type"
                    bg="gray.700"
                    border="none"
                  >
                    {eventTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date Range</FormLabel>
                  <HStack>
                    <Input
                      type="date"
                      bg="gray.700"
                      border="none"
                    />
                    <Text>to</Text>
                    <Input
                      type="date"
                      bg="gray.700"
                      border="none"
                    />
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    placeholder="City or address"
                    bg="gray.700"
                    border="none"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Include details about the project, what to expect, etc."
                    bg="gray.700"
                    border="none"
                    rows={4}
                  />
                </FormControl>

                <Flex justify="flex-end">
                  <Button
                    rightIcon={<FaUsers />}
                    colorScheme="blue"
                    onClick={() => setTabIndex(1)}
                  >
                    Continue to Crew Assignment
                  </Button>
                </Flex>
              </VStack>
            </TabPanel>

            {/* Crew Assignment Panel */}
            <TabPanel p={6}>
              <CrewMatchingPanel 
                onCrewSelected={handleCrewSelected}
                existingRoles={eventRoles}
              />

              <Flex justify="space-between" mt={8}>
                <Button
                  variant="outline"
                  onClick={() => setTabIndex(0)}
                >
                  Back to Event Details
                </Button>
                <Button
                  rightIcon={<FaDollarSign />}
                  colorScheme="blue"
                  onClick={() => setTabIndex(2)}
                >
                  Continue to Budget
                </Button>
              </Flex>
            </TabPanel>

            {/* Budget Panel */}
            <TabPanel p={6}>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>Total Budget</FormLabel>
                  <NumberInput defaultValue={1000} min={0} precision={2}>
                    <NumberInputField
                      bg="gray.700"
                      border="none"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <Divider />

                <Heading size="md">Crew Rates</Heading>
                
                <VStack spacing={3} align="stretch">
                  {eventRoles.map((role, index) => (
                    <Flex
                      key={index}
                      justify="space-between"
                      align="center"
                      p={3}
                      bg="gray.700"
                      borderRadius="md"
                    >
                      <Text>{role.role}</Text>
                      <HStack>
                        {role.crewMemberId && (
                          <Badge colorScheme="green">
                            <Flex align="center">
                              <Icon as={FaCheck} mr={1} />
                              Assigned
                            </Flex>
                          </Badge>
                        )}
                        <NumberInput defaultValue={100} min={0} precision={2} width="120px">
                          <NumberInputField
                            bg="gray.600"
                            border="none"
                          />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <Select 
                          defaultValue="day" 
                          width="100px"
                          bg="gray.600"
                          border="none"
                          size="md"
                        >
                          <option value="hour">per hour</option>
                          <option value="day">per day</option>
                          <option value="project">per project</option>
                        </Select>
                      </HStack>
                    </Flex>
                  ))}
                </VStack>

                <Flex justify="space-between" mt={6}>
                  <Button
                    variant="outline"
                    onClick={() => setTabIndex(1)}
                  >
                    Back to Crew Assignment
                  </Button>
                  <Button
                    colorScheme="green"
                    rightIcon={<FaCheck />}
                    onClick={handleCreateEvent}
                    isLoading={isSubmitting}
                  >
                    Create Event
                  </Button>
                </Flex>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
