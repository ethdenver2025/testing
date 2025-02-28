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
  FiUserCheck,
} from 'react-icons/fi';

// Mock data for crew members
const mockCrewMembers = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Sound Engineer',
    avatar: '',
    verified: true,
    eventsWorked: 12,
    rating: 4.8,
    attestationStatus: 'pending',
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
  },
];

// Mock data for client organizers
const mockClients = [
  {
    id: 1,
    name: 'Skyline Events',
    contactName: 'Sarah Chen',
    avatar: '',
    eventsHosted: 25,
    rating: 4.7,
    attestationStatus: 'pending',
  },
  {
    id: 2,
    name: 'Summit Productions',
    contactName: 'Michael Torres',
    avatar: '',
    eventsHosted: 18,
    rating: 4.6,
    attestationStatus: 'completed',
  },
  {
    id: 3,
    name: 'Urban Festivals',
    contactName: 'David Kim',
    avatar: '',
    eventsHosted: 7,
    rating: 4.2,
    attestationStatus: 'none',
  },
];

// Mock event data
const mockEvents = [
  { id: 1, name: 'Summer Music Festival 2024', date: '2024-06-15' },
  { id: 2, name: 'Corporate Conference', date: '2024-04-22' },
  { id: 3, name: 'Product Launch Event', date: '2024-05-10' },
];

export const Attestations = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);
  const [attestationType, setAttestationType] = useState('crew'); // 'crew' or 'client'
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [attestationForm, setAttestationForm] = useState({
    entityId: null,
    eventId: '',
    skillRating: '4',
    professionalismRating: '4',
    reliabilityRating: '4',
    communicationRating: '4',
    comments: '',
  });

  // Filter by attestation status
  const pendingCrewAttestations = mockCrewMembers.filter((c) => c.attestationStatus === 'pending');
  const completedCrewAttestations = mockCrewMembers.filter(
    (c) => c.attestationStatus === 'completed'
  );
  const availableCrewToAttest = mockCrewMembers.filter((c) => c.attestationStatus === 'none');

  const pendingClientAttestations = mockClients.filter((c) => c.attestationStatus === 'pending');
  const completedClientAttestations = mockClients.filter(
    (c) => c.attestationStatus === 'completed'
  );
  const availableClientToAttest = mockClients.filter((c) => c.attestationStatus === 'none');

  const openAttestationModal = (entity, type) => {
    setSelectedEntity(entity);
    setAttestationType(type);
    setAttestationForm({
      ...attestationForm,
      entityId: entity.id,
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
      description: `You've successfully attested ${selectedEntity.name}`,
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
        </VStack>
      </CardBody>
      <CardFooter pt={0} justifyContent="flex-end">
        <Button
          variant="solid"
          size="sm"
          onClick={() => openAttestationModal(crew, 'crew')}
          isDisabled={crew.attestationStatus === 'completed'}
        >
          {crew.attestationStatus === 'completed' ? 'Completed' : 'Attest Crew Member'}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderClientCard = (client) => (
    <Card key={client.id} bg="background.tertiary" overflow="hidden">
      <CardHeader pb={0}>
        <Flex align="center" gap={3}>
          <Avatar name={client.name} bg="accent.primary" />
          <Box>
            <Heading size="sm" fontWeight="semibold">
              {client.name}
            </Heading>
            <Text color="text.secondary" fontSize="sm">
              Contact: {client.contactName}
            </Text>
          </Box>
        </Flex>
      </CardHeader>
      <CardBody>
        <VStack align="start" spacing={2}>
          <HStack>
            <Icon as={FiCalendar} color="text.secondary" />
            <Text fontSize="sm">{client.eventsHosted} events hosted</Text>
          </HStack>
          <HStack>
            <Icon as={FiStar} color="status.warning" />
            <Text fontSize="sm">{client.rating} average rating</Text>
          </HStack>
        </VStack>
      </CardBody>
      <CardFooter pt={0} justifyContent="flex-end">
        <Button
          variant="solid"
          size="sm"
          onClick={() => openAttestationModal(client, 'client')}
          isDisabled={client.attestationStatus === 'completed'}
        >
          {client.attestationStatus === 'completed' ? 'Completed' : 'Attest Client'}
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
        Attestations provide a verified record of your working relationships. Completing
        attestations helps build trust and reputation within the industry.
      </Text>

      <Tabs
        variant="enclosed"
        colorScheme="gray"
        mb={8}
        index={activeTab}
        onChange={(index) => setActiveTab(index)}
      >
        <TabList mb={5}>
          <Tab borderRadius="base">Crew Attestations</Tab>
          <Tab borderRadius="base">Client Attestations</Tab>
        </TabList>
        <TabPanels>
          {/* Crew Attestations Panel */}
          <TabPanel p={0}>
            <Tabs variant="enclosed" colorScheme="gray">
              <TabList mb={5}>
                <Tab borderRadius="base">Pending ({pendingCrewAttestations.length})</Tab>
                <Tab borderRadius="base">Completed ({completedCrewAttestations.length})</Tab>
                <Tab borderRadius="base">Available ({availableCrewToAttest.length})</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  {pendingCrewAttestations.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {pendingCrewAttestations.map(renderCrewCard)}
                    </SimpleGrid>
                  ) : (
                    <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                      <Icon as={FiCheckCircle} boxSize={10} color="text.secondary" mb={3} />
                      <Heading size="md" mb={2}>
                        No Pending Crew Attestations
                      </Heading>
                      <Text color="text.secondary">
                        You don't have any pending crew attestations at this time.
                      </Text>
                    </Box>
                  )}
                </TabPanel>
                <TabPanel p={0}>
                  {completedCrewAttestations.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {completedCrewAttestations.map(renderCrewCard)}
                    </SimpleGrid>
                  ) : (
                    <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                      <Icon as={FiAlertCircle} boxSize={10} color="text.secondary" mb={3} />
                      <Heading size="md" mb={2}>
                        No Completed Crew Attestations
                      </Heading>
                      <Text color="text.secondary">
                        You haven't completed any crew attestations yet.
                      </Text>
                    </Box>
                  )}
                </TabPanel>
                <TabPanel p={0}>
                  {availableCrewToAttest.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {availableCrewToAttest.map(renderCrewCard)}
                    </SimpleGrid>
                  ) : (
                    <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                      <Icon as={FiUserCheck} boxSize={10} color="text.secondary" mb={3} />
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
          </TabPanel>

          {/* Client Attestations Panel */}
          <TabPanel p={0}>
            <Tabs variant="enclosed" colorScheme="gray">
              <TabList mb={5}>
                <Tab borderRadius="base">Pending ({pendingClientAttestations.length})</Tab>
                <Tab borderRadius="base">Completed ({completedClientAttestations.length})</Tab>
                <Tab borderRadius="base">Available ({availableClientToAttest.length})</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  {pendingClientAttestations.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {pendingClientAttestations.map(renderClientCard)}
                    </SimpleGrid>
                  ) : (
                    <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                      <Icon as={FiCheckCircle} boxSize={10} color="text.secondary" mb={3} />
                      <Heading size="md" mb={2}>
                        No Pending Client Attestations
                      </Heading>
                      <Text color="text.secondary">
                        You don't have any pending client attestations at this time.
                      </Text>
                    </Box>
                  )}
                </TabPanel>
                <TabPanel p={0}>
                  {completedClientAttestations.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {completedClientAttestations.map(renderClientCard)}
                    </SimpleGrid>
                  ) : (
                    <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                      <Icon as={FiAlertCircle} boxSize={10} color="text.secondary" mb={3} />
                      <Heading size="md" mb={2}>
                        No Completed Client Attestations
                      </Heading>
                      <Text color="text.secondary">
                        You haven't completed any client attestations yet.
                      </Text>
                    </Box>
                  )}
                </TabPanel>
                <TabPanel p={0}>
                  {availableClientToAttest.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
                      {availableClientToAttest.map(renderClientCard)}
                    </SimpleGrid>
                  ) : (
                    <Box p={10} textAlign="center" bg="background.tertiary" borderRadius="md">
                      <Icon as={FiUserCheck} boxSize={10} color="text.secondary" mb={3} />
                      <Heading size="md" mb={2}>
                        No Available Clients
                      </Heading>
                      <Text color="text.secondary">
                        There are no clients available for attestation at this time.
                      </Text>
                    </Box>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Attestation Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="background.secondary">
          <ModalHeader>
            Attest {attestationType === 'crew' ? 'Crew Member' : 'Client'}: {selectedEntity?.name}
          </ModalHeader>
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
                <FormLabel>
                  {attestationType === 'crew' ? 'Technical Skills Rating' : 'Organization Rating'}
                </FormLabel>
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
                  placeholder={`Add any comments about working with this ${attestationType === 'crew' ? 'crew member' : 'client'}`}
                  value={attestationForm.comments}
                  onChange={(e) => handleFormChange('comments', e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={submitAttestation}
              isDisabled={!attestationForm.eventId}
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
