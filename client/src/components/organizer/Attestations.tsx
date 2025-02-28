import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
  Flex,
  Badge,
  HStack,
  VStack,
  Icon,
  Divider,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  Select,
} from '@chakra-ui/react';
import {
  FiUser,
  FiStar,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';

// Mock data - would be replaced with API call
const mockCrewMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Sound Engineer',
    avatar: '',
    verified: true,
    eventsWorked: 12,
    rating: 4.8,
    attestationStatus: 'pending', // pending, completed, none
    skills: ['Audio Mixing', 'Live Sound', 'Acoustics'],
  },
  {
    id: 2,
    name: 'Jamie Smith',
    role: 'Lighting Designer',
    avatar: '',
    verified: true,
    eventsWorked: 8,
    rating: 4.9,
    attestationStatus: 'completed',
    skills: ['Stage Lighting', 'DMX', 'Programming'],
  },
  {
    id: 3,
    name: 'Morgan Wilson',
    role: 'Production Manager',
    avatar: '',
    verified: false,
    eventsWorked: 3,
    rating: 4.3,
    attestationStatus: 'none',
    skills: ['Event Management', 'Crew Coordination', 'Scheduling'],
  },
  {
    id: 4,
    name: 'Taylor Reed',
    role: 'Video Technician',
    avatar: '',
    verified: true,
    eventsWorked: 7,
    rating: 4.5,
    attestationStatus: 'pending',
    skills: ['Camera Operation', 'Video Switching', 'Projection'],
  },
  {
    id: 5,
    name: 'Jordan Hayes',
    role: 'Stage Manager',
    avatar: '',
    verified: true,
    eventsWorked: 15,
    rating: 4.7,
    attestationStatus: 'completed',
    skills: ['Stage Direction', 'Cues', 'Artist Relations'],
  },
];

// Mock event data
const mockEvents = [
  { id: 1, name: 'Summer Music Festival 2024', date: '2024-06-15' },
  { id: 2, name: 'Corporate Conference', date: '2024-04-22' },
  { id: 3, name: 'Product Launch Event', date: '2024-05-10' },
  { id: 4, name: 'Annual Charity Gala', date: '2024-07-05' },
];

export const Attestations = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [attestationForm, setAttestationForm] = useState({
    crewId: null,
    eventId: '',
    skillRating: '4',
    professionalismRating: '4',
    reliabilityRating: '4',
    communicationRating: '4',
    comments: '',
  });

  // Filter crew by attestation status
  const pendingAttestations = mockCrewMembers.filter((c) => c.attestationStatus === 'pending');
  const completedAttestations = mockCrewMembers.filter((c) => c.attestationStatus === 'completed');
  const availableToAttest = mockCrewMembers.filter((c) => c.attestationStatus === 'none');

  const openAttestationModal = (crew) => {
    setSelectedCrew(crew);
    setAttestationForm({
      ...attestationForm,
      crewId: crew.id,
    });
    onOpen();
  };

  const handleFormChange = (field, value) => {
    setAttestationForm({
      ...attestationForm,
      [field]: value,
    });
  };

  const submitAttestation = () => {
    // Would typically make an API call here
    toast({
      title: 'Attestation submitted',
      description: `You've successfully attested ${selectedCrew.name}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  const renderCrewCard = (crew) => (
    <Card key={crew.id} bg="background.tertiary" overflow="hidden">
      <CardHeader pb={0}>
        <Flex align="center" gap={3}>
          <Avatar name={crew.name} bg="accent.secondary" />
          <Box>
            <Heading size="sm" fontWeight="semibold">
              {crew.name}
            </Heading>
            <Text color="text.secondary" fontSize="sm">
              {crew.role}
            </Text>
          </Box>
          {crew.verified && (
            <Badge colorScheme="blue" ml="auto">
              Verified
            </Badge>
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack align="start" spacing={2}>
          <HStack>
            <Icon as={FiBriefcase} color="text.secondary" />
            <Text fontSize="sm">{crew.eventsWorked} events worked</Text>
          </HStack>
          <HStack>
            <Icon as={FiStar} color="status.warning" />
            <Text fontSize="sm">{crew.rating} average rating</Text>
          </HStack>
          <Divider my={1} />
          <Text fontSize="sm" fontWeight="medium">
            Skills:
          </Text>
          <HStack flexWrap="wrap" spacing={1}>
            {crew.skills.map((skill, i) => (
              <Badge key={i} variant="subtle" colorScheme="gray" fontSize="xs">
                {skill}
              </Badge>
            ))}
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter pt={0} justifyContent="flex-end">
        <Button
          variant="solid"
          size="sm"
          borderRadius="base"
          onClick={() => openAttestationModal(crew)}
          isDisabled={crew.attestationStatus === 'completed'}
        >
          {crew.attestationStatus === 'completed' ? 'Completed' : 'Attest Crew Member'}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Box p={5}>
      <Heading size="lg" mb={5}>
        Attestations
      </Heading>
      <Text mb={6} color="text.secondary">
        Attestations provide a verified record of your experience working with crew members.
        Completing attestations helps crew members build their reputation in the industry.
      </Text>

      <Tabs variant="enclosed" colorScheme="gray" mb={8}>
        <TabList mb={5}>
          <Tab borderRadius="base">Pending ({pendingAttestations.length})</Tab>
          <Tab borderRadius="base">Completed ({completedAttestations.length})</Tab>
          <Tab borderRadius="base">Available ({availableToAttest.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel p={0}>
            {pendingAttestations.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                {pendingAttestations.map(renderCrewCard)}
              </SimpleGrid>
            ) : (
              <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                <Icon as={FiCheckCircle} boxSize={10} color="text.secondary" mb={3} />
                <Heading size="md" mb={2}>
                  No Pending Attestations
                </Heading>
                <Text color="text.secondary">
                  You don't have any pending crew attestations at this time.
                </Text>
              </Box>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {completedAttestations.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                {completedAttestations.map(renderCrewCard)}
              </SimpleGrid>
            ) : (
              <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                <Icon as={FiAlertCircle} boxSize={10} color="text.secondary" mb={3} />
                <Heading size="md" mb={2}>
                  No Completed Attestations
                </Heading>
                <Text color="text.secondary">You haven't completed any crew attestations yet.</Text>
              </Box>
            )}
          </TabPanel>
          <TabPanel p={0}>
            {availableToAttest.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                {availableToAttest.map(renderCrewCard)}
              </SimpleGrid>
            ) : (
              <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                <Icon as={FiAlertCircle} boxSize={10} color="text.secondary" mb={3} />
                <Heading size="md" mb={2}>
                  No Available Crew Members
                </Heading>
                <Text color="text.secondary">
                  There are no crew members available for attestation at this time.
                </Text>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Attestation Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="background.secondary">
          <ModalHeader>Attest Crew Member: {selectedCrew?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5} align="stretch">
              <FormControl isRequired>
                <FormLabel>Select Event</FormLabel>
                <Select
                  placeholder="Select event worked together"
                  value={attestationForm.eventId}
                  onChange={(e) => handleFormChange('eventId', e.target.value)}
                >
                  {mockEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({new Date(event.date).toLocaleDateString()})
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Technical Skills Rating</FormLabel>
                <RadioGroup
                  value={attestationForm.skillRating}
                  onChange={(value) => handleFormChange('skillRating', value)}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="1">1</Radio>
                    <Radio value="2">2</Radio>
                    <Radio value="3">3</Radio>
                    <Radio value="4">4</Radio>
                    <Radio value="5">5</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Professionalism Rating</FormLabel>
                <RadioGroup
                  value={attestationForm.professionalismRating}
                  onChange={(value) => handleFormChange('professionalismRating', value)}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="1">1</Radio>
                    <Radio value="2">2</Radio>
                    <Radio value="3">3</Radio>
                    <Radio value="4">4</Radio>
                    <Radio value="5">5</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Reliability Rating</FormLabel>
                <RadioGroup
                  value={attestationForm.reliabilityRating}
                  onChange={(value) => handleFormChange('reliabilityRating', value)}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="1">1</Radio>
                    <Radio value="2">2</Radio>
                    <Radio value="3">3</Radio>
                    <Radio value="4">4</Radio>
                    <Radio value="5">5</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Communication Rating</FormLabel>
                <RadioGroup
                  value={attestationForm.communicationRating}
                  onChange={(value) => handleFormChange('communicationRating', value)}
                >
                  <Stack direction="row" spacing={4}>
                    <Radio value="1">1</Radio>
                    <Radio value="2">2</Radio>
                    <Radio value="3">3</Radio>
                    <Radio value="4">4</Radio>
                    <Radio value="5">5</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Comments</FormLabel>
                <Textarea
                  placeholder="Add any comments about working with this crew member"
                  value={attestationForm.comments}
                  onChange={(e) => handleFormChange('comments', e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} borderRadius="base">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={submitAttestation}
              isDisabled={!attestationForm.eventId}
              borderRadius="base"
            >
              Submit Attestation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Attestations;
