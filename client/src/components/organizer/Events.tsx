import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  VStack,
  Spinner,
  Card,
  CardBody,
  Badge,
  Progress,
  Tag,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiDownload,
  FiEdit,
  FiFilter,
  FiMapPin,
  FiMoreVertical,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSliders,
  FiTrash2,
  FiUsers,
  FiClipboard,
  FiAlertCircle,
  FiChevronDown,
} from 'react-icons/fi';
import axios from 'axios';
import CreateEventModal from './CreateEventModal';
import ManageEventModal from './ManageEventModal';

// Mock events data
const mockEvents = [
  {
    id: '1',
    title: 'ETHDenver 2025',
    location: 'Denver, CO',
    date: 'Mar 1-3, 2025',
    crewNeeded: 8,
    crewHired: 3,
    status: 'Upcoming',
    roles: ['Camera Operator', 'Sound Engineer', 'Lighting Technician'],
    budget: '$25,000',
    applicants: 15,
    daysLeft: 25
  },
  {
    id: '2',
    title: 'Web3 Summit',
    location: 'Miami, FL',
    date: 'Apr 15-17, 2025',
    crewNeeded: 12,
    crewHired: 5,
    status: 'Upcoming',
    roles: ['Stage Manager', 'Video Director', 'Sound Engineer'],
    budget: '$35,000',
    applicants: 24,
    daysLeft: 35
  },
  {
    id: '3',
    title: 'Blockchain Conference',
    location: 'New York, NY',
    date: 'May 5-7, 2025',
    crewNeeded: 10,
    crewHired: 0,
    status: 'Planning',
    roles: ['Camera Operator', 'Video Editor', 'Lighting Director'],
    budget: '$30,000',
    applicants: 0,
    daysLeft: 65
  },
  {
    id: '4',
    title: 'NFT Summit 2025',
    location: 'Los Angeles, CA',
    date: 'Jun 20-22, 2025',
    crewNeeded: 15,
    crewHired: 0,
    status: 'Planning',
    roles: ['Stage Manager', 'Camera Operator', 'Sound Engineer'],
    budget: '$40,000',
    applicants: 0,
    daysLeft: 85
  }
];

// Mock crew members data
const mockCrewMembers = [
  { id: '1', name: 'Jordan Smith', role: 'Camera Operator', rating: 4.8 },
  { id: '2', name: 'Alex Johnson', role: 'Sound Engineer', rating: 4.9 },
  { id: '3', name: 'Casey Williams', role: 'Lighting Technician', rating: 4.7 },
  { id: '4', name: 'Taylor Brown', role: 'Stage Manager', rating: 4.6 },
  { id: '5', name: 'Morgan Davis', role: 'Video Director', rating: 4.9 },
  { id: '6', name: 'Riley Wilson', role: 'Production Assistant', rating: 4.5 },
  { id: '7', name: 'Jamie Garcia', role: 'Audio Assistant', rating: 4.7 },
  { id: '8', name: 'Avery Martinez', role: 'Camera Assistant', rating: 4.6 }
];

export const Events = () => {
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For event details modal
  const { 
    isOpen: isCreateModalOpen, 
    onOpen: onCreateModalOpen, 
    onClose: onCreateModalClose 
  } = useDisclosure(); // For create event modal
  const {
    isOpen: isManageEventModalOpen,
    onOpen: onManageEventModalOpen,
    onClose: onManageEventModalClose
  } = useDisclosure(); // For manage event modal
  const toast = useToast();
  const [manageEventModalData, setManageEventModalData] = useState<typeof mockEvents[0] | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch events from an API
        // For now, we're using mock data
        
        // Filter events if myEventsOnly is true
        // For demo purposes, we'll filter to just the first 2 events to simulate "My Events"
        const filteredEvents = mockEvents;
        
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Error fetching events',
          description: 'There was a problem loading your events.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  // Handle creating a new event
  const handleCreateEvent = async (eventData: any) => {
    try {
      setLoading(true);
      // In a real app, you would make an API call to create the event
      // For demo purposes, we'll just add it to the local state
      
      const newEvent = {
        id: String(events.length + 1),
        title: eventData.title,
        location: eventData.location,
        date: eventData.startDate + ' - ' + eventData.endDate,
        crewNeeded: eventData.positions.length,
        crewHired: 0,
        status: 'Planning',
        roles: eventData.positions.map((p: any) => p.title),
        budget: eventData.budget,
        applicants: 0,
        daysLeft: 30
      };
      
      // Add the new event to the events list
      setEvents([newEvent, ...events]);
      toast({
        title: 'Event created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error creating event',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const openEventDetails = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    onOpen();
  };

  const handleManageEvent = (event: typeof mockEvents[0]) => {
    setManageEventModalData(event);
    onManageEventModalOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
          <Box>
            <Heading size="lg" mb={2}>Event Management</Heading>
            <Text color="gray.500">
              Organize your events and manage production crews
            </Text>
          </Box>
          
          <HStack spacing={4} mt={{ base: 4, md: 0 }}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search events" />
            </InputGroup>
            
            <Button 
              leftIcon={<FiPlus />} 
              colorScheme="green"
              onClick={onCreateModalOpen}
              minW="140px"
              px={4}
            >
              Create Event
            </Button>
          </HStack>
        </Flex>

        {/* Stats Row */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Events</StatLabel>
                <StatNumber>{events.length}</StatNumber>
                <StatHelpText>2 upcoming, 2 in planning</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Crew Positions</StatLabel>
                <StatNumber>{events.reduce((acc, event) => acc + event.crewNeeded, 0)}</StatNumber>
                <StatHelpText>
                  {events.reduce((acc, event) => acc + event.crewHired, 0)} hired, 
                  {events.reduce((acc, event) => acc + (event.crewNeeded - event.crewHired), 0)} needed
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Applicants</StatLabel>
                <StatNumber>{events.reduce((acc, event) => acc + event.applicants, 0)}</StatNumber>
                <StatHelpText>Across all events</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Tabs variant="enclosed" colorScheme="gray">
          <TabList>
            <Tab borderRadius="base">All Events</Tab>
            <Tab borderRadius="base">Upcoming</Tab>
            <Tab borderRadius="base">Planning</Tab>
            <Tab borderRadius="base">Past</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onViewDetails={() => openEventDetails(event)}
                    onManageEvent={() => handleManageEvent(event)}
                  />
                ))}
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {events
                  .filter(event => event.status === 'Upcoming')
                  .map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onViewDetails={() => openEventDetails(event)}
                      onManageEvent={() => handleManageEvent(event)}
                    />
                  ))
                }
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {events
                  .filter(event => event.status === 'Planning')
                  .map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      onViewDetails={() => openEventDetails(event)}
                      onManageEvent={() => handleManageEvent(event)}
                    />
                  ))
                }
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel px={0}>
              <Box textAlign="center" py={10}>
                <Text>You have no past events.</Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
      
      {/* Event Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedEvent?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <VStack align="stretch" spacing={4}>
                <Badge colorScheme={selectedEvent.status === 'Upcoming' ? 'green' : 'blue'} px={2} py={1} borderRadius="md">
                  {selectedEvent.status}
                </Badge>

                <HStack spacing={4}>
                  <HStack>
                    <FiMapPin />
                    <Text>{selectedEvent.location}</Text>
                  </HStack>
                  <HStack>
                    <FiCalendar />
                    <Text>{selectedEvent.date}</Text>
                  </HStack>
                </HStack>

                <HStack>
                  <FiClock />
                  <Text fontWeight="bold">Days Until Event:</Text>
                  <Text>{selectedEvent.daysLeft} days</Text>
                </HStack>

                <HStack>
                  <FiDollarSign />
                  <Text fontWeight="bold">Budget:</Text>
                  <Text>{selectedEvent.budget}</Text>
                </HStack>

                <Box>
                  <Heading size="sm" mb={2}>Crew Status</Heading>
                  <HStack mb={1}>
                    <Text fontSize="sm">
                      {selectedEvent.crewHired} of {selectedEvent.crewNeeded} positions filled
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      ({Math.round((selectedEvent.crewHired / selectedEvent.crewNeeded) * 100)}%)
                    </Text>
                  </HStack>
                  <Progress 
                    value={(selectedEvent.crewHired / selectedEvent.crewNeeded) * 100} 
                    colorScheme="green"
                    borderRadius="md"
                    mb={4}
                  />
                </Box>
                
                <Divider />
                
                <Box>
                  <Heading size="sm" mb={3}>Crew Positions</Heading>
                  <VStack align="stretch" spacing={2}>
                    {selectedEvent.roles.map((role, index) => (
                      <HStack key={index} justify="space-between">
                        <Text>{role}</Text>
                        <Badge colorScheme={index < selectedEvent.crewHired ? "green" : "gray"}>
                          {index < selectedEvent.crewHired ? "Filled" : "Open"}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
                
                {selectedEvent.crewHired > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Heading size="sm" mb={3}>Hired Crew Members</Heading>
                      <VStack align="stretch" spacing={3}>
                        {mockCrewMembers.slice(0, selectedEvent.crewHired).map((member) => (
                          <HStack key={member.id} justify="space-between">
                            <HStack>
                              <Avatar size="sm" name={member.name} />
                              <Box>
                                <Text fontWeight="medium">{member.name}</Text>
                                <Text fontSize="sm" color="gray.500">{member.role}</Text>
                              </Box>
                            </HStack>
                            <Badge colorScheme="yellow">{member.rating} ★</Badge>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  </>
                )}
                
                {selectedEvent.applicants > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Heading size="sm" mb={2}>Applicants</Heading>
                      <Text>{selectedEvent.applicants} applicants waiting for review</Text>
                      <Button mt={2} size="sm" colorScheme="blue">Review Applicants</Button>
                    </Box>
                  </>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="outline">
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiEdit />}>Edit Event</MenuItem>
                  <MenuItem icon={<FiUsers />}>Manage Crew</MenuItem>
                  <MenuItem icon={<FiClipboard />}>Post Jobs</MenuItem>
                  <MenuItem icon={<FiTrash2 />} color="red.500">Cancel Event</MenuItem>
                </MenuList>
              </Menu>
              <Button colorScheme="green">Dashboard</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Event Modal */}
      <CreateEventModal 
        isOpen={isCreateModalOpen} 
        onClose={onCreateModalClose} 
        onEventCreated={handleCreateEvent} 
      />

      {/* Manage Event Modal */}
      <ManageEventModal 
        isOpen={isManageEventModalOpen} 
        onClose={onManageEventModalClose} 
        event={manageEventModalData} 
      />
    </Container>
  );
};

interface EventCardProps {
  event: typeof mockEvents[0];
  onViewDetails: () => void;
  onManageEvent: () => void;
}

const EventCard = ({ event, onViewDetails, onManageEvent }: EventCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justifyContent="space-between">
            <Heading size="md">{event.title}</Heading>
            <Menu>
              <MenuButton 
                as={IconButton}
                variant="ghost"
                size="sm"
                icon={<FiMoreVertical />}
                aria-label="Options"
              />
              <MenuList>
                <MenuItem icon={<FiEdit />}>Edit</MenuItem>
                <MenuItem 
                  icon={<FiUsers />} 
                  onClick={onManageEvent}
                >
                  Manage Event
                </MenuItem>
                <MenuItem icon={<FiClipboard />}>Post Jobs</MenuItem>
                <MenuItem icon={<FiTrash2 />} color="red.500">Cancel</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          
          <Badge colorScheme={event.status === 'Upcoming' ? 'green' : 'blue'} alignSelf="flex-start">
            {event.status}
          </Badge>
          
          <VStack align="stretch" spacing={2}>
            <HStack>
              <FiMapPin size={14} />
              <Text fontSize="sm">{event.location}</Text>
            </HStack>
            <HStack>
              <FiCalendar size={14} />
              <Text fontSize="sm">{event.date}</Text>
            </HStack>
            <HStack>
              <FiClock size={14} />
              <Text fontSize="sm">{event.daysLeft} days until event</Text>
            </HStack>
          </VStack>
          
          <Box>
            <HStack mb={1} justify="space-between">
              <Text fontSize="sm">Crew: {event.crewHired}/{event.crewNeeded}</Text>
              <Text fontSize="sm" color="gray.500">
                {Math.round((event.crewHired / event.crewNeeded) * 100)}%
              </Text>
            </HStack>
            <Progress 
              value={(event.crewHired / event.crewNeeded) * 100} 
              colorScheme="green"
              borderRadius="md"
              size="sm"
              mb={2}
            />
          </Box>
          
          {event.applicants > 0 && (
            <HStack>
              <FiUsers size={14} />
              <Text fontSize="sm">{event.applicants} applicants</Text>
            </HStack>
          )}
          <Button 
            onClick={onManageEvent} 
            colorScheme="green" 
            size="sm"
            leftIcon={<FiUsers />}
            mb={2}
            borderRadius="base"
          >
            Manage Event
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};
