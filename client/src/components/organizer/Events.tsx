import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Button, 
  VStack, 
  HStack, 
  Badge, 
  Input, 
  InputGroup, 
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tabs, 
  TabList, 
  Tab, 
  TabPanels, 
  TabPanel,
  Flex,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Avatar,
  AvatarGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  Tag
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiDollarSign,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiClipboard,
  FiChevronDown
} from 'react-icons/fi';

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
  { id: '1', name: 'Alex Johnson', role: 'Camera Operator', rating: 4.8 },
  { id: '2', name: 'Sam Lee', role: 'Sound Engineer', rating: 4.9 },
  { id: '3', name: 'Taylor Smith', role: 'Lighting Technician', rating: 4.7 },
  { id: '4', name: 'Jordan Patel', role: 'Stage Manager', rating: 4.5 },
];

export const Events = () => {
  const [events, setEvents] = useState(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openEventDetails = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
          <Box>
            <Heading size="lg" mb={2}>Event Management</Heading>
            <Text color="gray.500">Organize your events and manage production crews</Text>
          </Box>
          
          <HStack spacing={4} mt={{ base: 4, md: 0 }}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search events" />
            </InputGroup>
            
            <Button leftIcon={<FiPlus />} colorScheme="green">
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

        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>All Events</Tab>
            <Tab>Upcoming</Tab>
            <Tab>Planning</Tab>
            <Tab>Past</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {events.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onViewDetails={() => openEventDetails(event)}
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
    </Container>
  );
};

interface EventCardProps {
  event: typeof mockEvents[0];
  onViewDetails: () => void;
}

const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Card 
      border="1px" 
      borderColor={cardBorder} 
      bg={cardBg}
      boxShadow="sm"
      _hover={{ 
        boxShadow: 'md',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }}
      transition="all 0.2s ease-in-out"
    >
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
                <MenuItem icon={<FiUsers />}>Manage Crew</MenuItem>
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
          
          <Button onClick={onViewDetails} colorScheme="green" size="sm">
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};
