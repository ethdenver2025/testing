import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  VStack,
  Text,
  Button,
  Flex,
  Spinner,
  Divider,
  Badge,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  CheckboxGroup,
  Stack,
  FormControl,
  FormLabel,
  Textarea,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaSearch, FaStar, FaShieldAlt, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CrewCard from '../components/crew/CrewCard';
import { useAuth } from '../contexts/AuthContext';
import notificationService from '../services/notificationService';

// Mock data for trusted crew members (people who have worked with the organizer before)
const mockTrustedCrew = [
  {
    id: '1',
    name: 'Jane Doe',
    skills: ['Camera Operation', 'Lighting', 'Video Editing'],
    bio: 'Professional camera operator with 5+ years of experience in documentary filmmaking.',
    trustScore: 92,
    attestationCount: 15,
    topRatedSkill: { name: 'Camera Operation', rating: 4.8 },
    events: ['Documentary Film Festival 2024', 'Music Video Production'],
    lastWorked: '2 months ago'
  },
  {
    id: '2',
    name: 'John Smith',
    skills: ['Sound Design', 'Boom Operation', 'Mixing'],
    bio: 'Experienced sound engineer specializing in location audio for film and television.',
    trustScore: 78,
    attestationCount: 8,
    topRatedSkill: { name: 'Boom Operation', rating: 4.5 },
    events: ['Corporate Brand Video', 'Music Video Production'],
    lastWorked: '6 months ago'
  },
  {
    id: '3',
    name: 'Alex Johnson',
    skills: ['Directing', 'Producing', 'Screenwriting'],
    bio: 'Independent filmmaker with a focus on documentary and narrative shorts.',
    trustScore: 85,
    attestationCount: 12,
    topRatedSkill: { name: 'Directing', rating: 4.3 },
    events: ['Documentary Film Festival 2024', 'Short Film Competition'],
    lastWorked: '3 weeks ago'
  },
  {
    id: '4',
    name: 'Sam Wilson',
    skills: ['Production Assistant', 'Set Design', 'Costume'],
    bio: 'Versatile production assistant with experience in indie films and commercials.',
    trustScore: 65,
    attestationCount: 5,
    topRatedSkill: { name: 'Production Assistant', rating: 4.0 },
    events: ['Music Video Production', 'Fashion Brand Campaign'],
    lastWorked: '1 month ago'
  },
  {
    id: '5',
    name: 'Taylor Martinez',
    skills: ['Editing', 'Color Grading', 'VFX'],
    bio: 'Post-production specialist with expertise in color grading and visual effects.',
    trustScore: 88,
    attestationCount: 10,
    topRatedSkill: { name: 'Color Grading', rating: 4.7 },
    events: ['Documentary Film Festival 2024', 'Corporate Brand Video'],
    lastWorked: '5 months ago'
  }
];

// Mock events for notification selection
const mockUpcomingEvents = [
  { id: 'event1', name: 'Music Festival Documentary', date: '2025-04-15', positions: ['Camera Operator', 'Sound Engineer', 'Editor'] },
  { id: 'event2', name: 'Corporate Brand Campaign', date: '2025-03-20', positions: ['Director', 'Lighting Technician', 'Production Assistant'] },
  { id: 'event3', name: 'Short Film Series', date: '2025-05-10', positions: ['Camera Operator', 'Sound Engineer', 'Gaffer', 'Grip'] }
];

export const TrustedCrewRoster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minTrustScore, setMinTrustScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [trustedCrew, setTrustedCrew] = useState(mockTrustedCrew);
  const [filteredCrew, setFilteredCrew] = useState(mockTrustedCrew);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const borderColor = useColorModeValue('gray.700', 'gray.800');

  useEffect(() => {
    filterCrew();
  }, [searchTerm, minTrustScore]);

  const filterCrew = () => {
    setLoading(true);

    // Apply filters
    let filtered = [...trustedCrew];

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        person =>
          person.name.toLowerCase().includes(term) ||
          person.skills.some(skill => skill.toLowerCase().includes(term)) ||
          (person.bio && person.bio.toLowerCase().includes(term))
      );
    }

    // Trust score filter
    if (minTrustScore > 0) {
      filtered = filtered.filter(person => 
        person.trustScore != null && person.trustScore >= minTrustScore
      );
    }

    setFilteredCrew(filtered);
    setLoading(false);
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCrew(filteredCrew.map(crew => crew.id));
    } else {
      setSelectedCrew([]);
    }
  };

  const handleCrewCheckboxChange = (id: string) => {
    if (selectedCrew.includes(id)) {
      setSelectedCrew(selectedCrew.filter(crewId => crewId !== id));
    } else {
      setSelectedCrew([...selectedCrew, id]);
    }
  };

  const handleNotifyClick = () => {
    if (selectedCrew.length === 0) {
      toast({
        title: "No crew members selected",
        description: "Please select at least one crew member to notify.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Prefill notification message with generic text
    setNotificationMessage(
      `We're excited to invite you to join our upcoming production! Based on our previous collaboration, we'd love to have you on board for this new project.`
    );
    
    onOpen();
  };

  const handleSendNotification = async () => {
    try {
      setLoading(true);
      
      // Call the notification service
      const result = await notificationService.notifyCrew(
        selectedEvent,
        selectedCrew,
        notificationMessage
      );
      
      toast({
        title: "Notifications sent!",
        description: `${selectedCrew.length} crew members have been notified about the opportunity.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Reset selections
      setSelectedCrew([]);
      setSelectedEvent('');
      setNotificationMessage('');
      
      onClose();
    } catch (error) {
      console.error('Error sending notifications:', error);
      toast({
        title: "Notification error",
        description: "There was a problem sending notifications. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2} color="white">
            Trusted Crew Roster
          </Heading>
          <Text color="gray.400">
            Manage and notify crew members who have worked with you on past events
          </Text>
        </Box>

        {/* Controls Section */}
        <Flex 
          p={6} 
          bg={bgColor} 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor={borderColor}
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'stretch', md: 'center' }}
          justify="space-between"
          gap={4}
        >
          <HStack flex="2">
            <InputGroup maxW="400px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by name or skill"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                color="white"
              />
            </InputGroup>
            
            <Select 
              placeholder="Min Trust Score" 
              onChange={(e) => setMinTrustScore(Number(e.target.value))}
              maxW="180px"
              color="white"
            >
              <option value="70">70+</option>
              <option value="80">80+</option>
              <option value="90">90+</option>
            </Select>
          </HStack>
          
          <Button
            leftIcon={<FaBell />}
            colorScheme="green"
            onClick={handleNotifyClick}
            isDisabled={selectedCrew.length === 0}
          >
            Notify Selected ({selectedCrew.length})
          </Button>
        </Flex>

        {/* Selection Controls */}
        <Flex justify="space-between" align="center" px={2}>
          <Checkbox 
            isChecked={selectedCrew.length === filteredCrew.length && filteredCrew.length > 0}
            onChange={handleSelectAllChange}
            colorScheme="green"
            color="white"
          >
            Select All ({filteredCrew.length})
          </Checkbox>
          
          {selectedCrew.length > 0 && (
            <Text color="gray.400" fontSize="sm">
              {selectedCrew.length} crew member{selectedCrew.length !== 1 ? 's' : ''} selected
            </Text>
          )}
        </Flex>

        {/* Crew List */}
        {loading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" color="blue.500" />
          </Flex>
        ) : filteredCrew.length === 0 ? (
          <Box p={10} textAlign="center" color="gray.400">
            <Text>No crew members match your search criteria.</Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredCrew.map((person) => (
              <Box key={person.id} position="relative">
                <Checkbox
                  position="absolute"
                  top={3}
                  right={3}
                  zIndex={1}
                  colorScheme="green"
                  isChecked={selectedCrew.includes(person.id)}
                  onChange={() => handleCrewCheckboxChange(person.id)}
                />
                <Box position="relative">
                  <CrewCard
                    id={person.id}
                    name={person.name}
                    skills={person.skills}
                    bio={person.bio}
                    trustScore={person.trustScore}
                    attestationCount={person.attestationCount}
                    topRatedSkill={person.topRatedSkill}
                  />
                  <HStack 
                    mt={2} 
                    bg={bgColor} 
                    p={2} 
                    borderRadius="md" 
                    justify="space-between"
                    color="gray.300"
                    fontSize="sm"
                  >
                    <Text>Last worked: {person.lastWorked}</Text>
                    <Badge colorScheme="purple">{person.events.length} previous events</Badge>
                  </HStack>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* Notification Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Send Notification to Crew</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Select Event</FormLabel>
                <Select 
                  placeholder="Choose an event" 
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  {mockUpcomingEvents.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({new Date(event.date).toLocaleDateString()})
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Notification Message</FormLabel>
                <Textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter your message to the selected crew members"
                  rows={5}
                />
              </FormControl>

              <Box>
                <Text fontWeight="bold" mb={2}>Selected Crew ({selectedCrew.length})</Text>
                <Box p={3} bg="gray.700" borderRadius="md" maxH="150px" overflowY="auto">
                  {selectedCrew.map(id => {
                    const crew = trustedCrew.find(c => c.id === id);
                    return crew ? (
                      <Text key={id} fontSize="sm" mb={1}>
                        {crew.name} - {crew.topRatedSkill?.name}
                      </Text>
                    ) : null;
                  })}
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleSendNotification}
              isDisabled={!selectedEvent || !notificationMessage || loading}
              leftIcon={<FaBell />}
              isLoading={loading}
              loadingText="Sending..."
            >
              Send Notification
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};
