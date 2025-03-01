import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  HStack,
  VStack,
  Divider,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  TagLabel,
  Icon,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  SimpleGrid,
  CheckboxGroup,
  Checkbox,
  TagCloseButton,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Avatar
} from '@chakra-ui/react';
import { 
  FiCalendar, 
  FiMapPin, 
  FiDollarSign, 
  FiUsers, 
  FiTrash2, 
  FiEdit, 
  FiSend, 
  FiPlus, 
  FiX,
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiLock,
  FiUnlock
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import CoinbasePayment from '../components/payments/CoinbasePayment';
import eventManagementService from '../services/eventManagementService';

// Component for managing a single event
const ManageEvent: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  
  // State variables
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrewForRemoval, setSelectedCrewForRemoval] = useState<any>(null);
  const [selectedPositionForRemoval, setSelectedPositionForRemoval] = useState<any>(null);
  const [selectedCallTime, setSelectedCallTime] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [fundAmount, setFundAmount] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelling, setCancelling] = useState<boolean>(false);
  
  // Modal disclosures
  const { 
    isOpen: isCancelModalOpen, 
    onOpen: onCancelModalOpen, 
    onClose: onCancelModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isRemoveCrewModalOpen, 
    onOpen: onRemoveCrewModalOpen, 
    onClose: onRemoveCrewModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isFundEscrowModalOpen, 
    onOpen: onFundEscrowModalOpen, 
    onClose: onFundEscrowModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isReleaseEscrowModalOpen, 
    onOpen: onReleaseEscrowModalOpen, 
    onClose: onReleaseEscrowModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isEditCallTimeModalOpen, 
    onOpen: onEditCallTimeModalOpen, 
    onClose: onEditCallTimeModalClose 
  } = useDisclosure();

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        // In a real app, we would call the API to get event details
        // const response = await eventManagementService.getEventDetails(eventId);
        // For demo purposes, we'll use some dummy data
        const mockEvent = {
          id: eventId,
          name: "Music Festival 2025",
          description: "A 3-day music festival featuring top artists",
          location: "Central Park, New York, NY",
          startDate: "2025-06-15T10:00:00",
          endDate: "2025-06-18T22:00:00",
          organizer: {
            id: "org123",
            name: "Event Productions Inc.",
            logo: "https://via.placeholder.com/100"
          },
          status: "scheduled", // scheduled, in-progress, completed, cancelled
          escrow: {
            contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
            funded: 35000,
            released: 5000
          },
          budget: 75000,
          positions: [
            {
              id: "pos1",
              title: "Sound Engineer",
              description: "Manage sound equipment and audio quality",
              payRate: 350,
              requiredSkills: ["Audio Engineering", "Live Sound", "Acoustics"],
              assignedCrew: [
                {
                  id: "crew1",
                  name: "John Smith",
                  avatar: "https://bit.ly/dan-abramov",
                  skills: ["Audio Engineering", "Live Sound", "Acoustics"]
                }
              ]
            },
            {
              id: "pos2",
              title: "Lighting Technician",
              description: "Manage lighting equipment and visual effects",
              payRate: 300,
              requiredSkills: ["Lighting Design", "DMX", "Visual Effects"],
              assignedCrew: [
                {
                  id: "crew2",
                  name: "Jane Doe",
                  avatar: "https://bit.ly/sage-adebayo",
                  skills: ["Lighting Design", "DMX", "Visual Effects"]
                }
              ]
            }
          ],
          callTimes: [
            {
              id: "call1",
              date: "2025-06-14T08:00:00",
              location: "Main Stage",
              description: "Setup and sound check",
              departments: ["Audio", "Lighting", "Video"]
            },
            {
              id: "call2",
              date: "2025-06-15T07:00:00",
              location: "Entrance Gate",
              description: "Prepare for doors open",
              departments: ["Security", "Ticketing"]
            }
          ]
        };
        
        setEvent(mockEvent);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch event details. Please try again later.");
        setLoading(false);
        console.error(err);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  // Render loading state
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex direction="column" align="center" justify="center" h="50vh">
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          <Text mt={4}>Loading event details...</Text>
        </Flex>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button colorScheme="blue" onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  // Render if event not found
  if (!event) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="warning" borderRadius="md" mb={4}>
          <AlertIcon />
          <AlertTitle mr={2}>Event Not Found</AlertTitle>
          <AlertDescription>The event you are looking for does not exist or has been deleted.</AlertDescription>
        </Alert>
        <Button colorScheme="blue" onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </Container>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'in_progress':
        return 'green';
      case 'completed':
        return 'purple';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Handle event cancellation
  const handleCancelEvent = async () => {
    if (!eventId || !cancelReason.trim()) return;
    
    try {
      setCancelling(true);
      
      await eventManagementService.cancelEvent(
        eventId,
        cancelReason
      );
      
      // Update local state
      setEvent({
        ...event,
        status: 'cancelled',
        cancellationReason: cancelReason
      });
      
      // Show success message
      toast({
        title: "Event cancelled",
        description: "The event has been cancelled and all crew members have been notified.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Close the modal
      onCancelModalClose();
    } catch (err) {
      console.error('Error cancelling event:', err);
      
      // Show error message
      toast({
        title: "Cancellation failed",
        description: "There was a problem cancelling the event. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      {/* Event header with basic info and actions */}
      <Box
        bg={bgColor}
        p={6}
        borderRadius="lg"
        boxShadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        mb={6}
      >
        <Flex justify="space-between" align="flex-start" wrap="wrap">
          <Box>
            <HStack spacing={4} mb={2}>
              <Heading as="h1" size="xl">{event.name}</Heading>
              <Badge colorScheme={getStatusColor(event.status)} fontSize="md" px={2} py={1}>
                {event.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </HStack>
            
            <Text fontSize="lg" color="gray.600" mb={4}>
              {event.description}
            </Text>
            
            <HStack spacing={6} mt={4}>
              <HStack>
                <Icon as={FiCalendar} color="blue.500" />
                <Text>{formatDate(event.startDate)} - {formatDate(event.endDate)}</Text>
              </HStack>
              
              <HStack>
                <Icon as={FiMapPin} color="red.500" />
                <Text>{event.location}</Text>
              </HStack>
              
              <HStack>
                <Icon as={FiDollarSign} color="green.500" />
                <Text>${event.budget.toLocaleString()}</Text>
              </HStack>
            </HStack>
          </Box>
          
          <HStack spacing={3} mt={{ base: 4, md: 0 }}>
            {event.status !== 'cancelled' && (
              <>
                <Button 
                  leftIcon={<FiEdit />} 
                  colorScheme="blue" 
                  variant="outline"
                  onClick={() => navigate(`/edit-event/${eventId}`)}
                >
                  Edit Details
                </Button>
                
                <Button 
                  leftIcon={<FiTrash2 />} 
                  colorScheme="red" 
                  variant="outline"
                  onClick={onCancelModalOpen}
                >
                  Cancel Event
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Main content tabs */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Crew</Tab>
          <Tab>Call Times</Tab>
          <Tab>Payments</Tab>
        </TabList>

        <TabPanels>
          {/* Overview Panel */}
          <TabPanel>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Heading as="h3" size="md" mb={4}>
                Event Overview
              </Heading>
              
              <Divider mb={6} />
              
              <VStack align="stretch" spacing={6}>
                <Box>
                  <Heading as="h4" size="sm" mb={2}>
                    Description
                  </Heading>
                  <Text>{event.description}</Text>
                </Box>
                
                <Box>
                  <Heading as="h4" size="sm" mb={2}>
                    Event Timeline
                  </Heading>
                  <HStack spacing={4}>
                    <Box p={4} borderWidth="1px" borderRadius="md" flex="1">
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">START DATE</Text>
                      <Text fontSize="md">{formatDate(event.startDate)}</Text>
                    </Box>
                    <Box p={4} borderWidth="1px" borderRadius="md" flex="1">
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">END DATE</Text>
                      <Text fontSize="md">{formatDate(event.endDate)}</Text>
                    </Box>
                  </HStack>
                </Box>
                
                <Box>
                  <Heading as="h4" size="sm" mb={2}>
                    Location Details
                  </Heading>
                  <Text>{event.location}</Text>
                </Box>
                
                <Box>
                  <Heading as="h4" size="sm" mb={2}>
                    Budget Information
                  </Heading>
                  <HStack spacing={4}>
                    <Box p={4} borderWidth="1px" borderRadius="md" flex="1">
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">TOTAL BUDGET</Text>
                      <Text fontSize="xl" fontWeight="bold">${event.budget.toLocaleString()}</Text>
                    </Box>
                    <Box p={4} borderWidth="1px" borderRadius="md" flex="1">
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">ESCROW FUNDED</Text>
                      <Text fontSize="xl" fontWeight="bold" color={event.escrow.funded === event.budget ? 'green.500' : 'orange.500'}>
                        ${event.escrow.funded.toLocaleString()} 
                        <Text as="span" fontSize="md" fontWeight="normal" color="gray.500">
                          / ${event.budget.toLocaleString()}
                        </Text>
                      </Text>
                    </Box>
                    <Box p={4} borderWidth="1px" borderRadius="md" flex="1">
                      <Text fontWeight="bold" color="gray.500" fontSize="sm">RELEASED TO CREW</Text>
                      <Text fontSize="xl" fontWeight="bold" color="blue.500">
                        ${event.escrow.released.toLocaleString()}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>
          </TabPanel>

          {/* Crew Panel */}
          <TabPanel>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Heading as="h3" size="md">
                  Crew Positions
                </Heading>
                
                <Button 
                  leftIcon={<FiUsers />} 
                  colorScheme="blue" 
                  size="sm"
                  onClick={() => navigate('/crew-directory')}
                >
                  Find Crew
                </Button>
              </Flex>
              
              <Divider mb={6} />
              
              <Accordion allowToggle defaultIndex={[0]}>
                {event.positions.map((position: any, index: number) => (
                  <AccordionItem key={position.id} mb={4}>
                    <h2>
                      <AccordionButton py={4}>
                        <Box flex="1" textAlign="left">
                          <Flex align="center">
                            <Text fontWeight="bold">{position.title}</Text>
                            <Badge 
                              ml={2} 
                              colorScheme={position.isRequired ? "red" : "gray"}
                              fontSize="xs"
                            >
                              {position.isRequired ? "REQUIRED" : "OPTIONAL"}
                            </Badge>
                            <Badge 
                              ml={2} 
                              colorScheme="blue"
                              fontSize="xs"
                            >
                              {position.assignedCrew.length} / {position.quantity} FILLED
                            </Badge>
                          </Flex>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <VStack align="stretch" spacing={4}>
                        <Box>
                          <Text fontWeight="bold" mb={1}>Description:</Text>
                          <Text>{position.description}</Text>
                        </Box>
                        
                        <Box>
                          <Text fontWeight="bold" mb={1}>Pay Rate:</Text>
                          <Text>${position.payRate}/day</Text>
                        </Box>
                        
                        <Box>
                          <Text fontWeight="bold" mb={1}>Required Skills:</Text>
                          <Flex wrap="wrap" gap={2}>
                            {position.skills.map((skill: string) => (
                              <Badge key={skill} colorScheme="teal" px={2} py={1}>
                                {skill}
                              </Badge>
                            ))}
                          </Flex>
                        </Box>
                        
                        <Divider />
                        
                        <Box>
                          <Flex justify="space-between" align="center" mb={2}>
                            <Text fontWeight="bold">Assigned Crew:</Text>
                            <Button
                              size="xs"
                              leftIcon={<FiPlus />}
                              colorScheme="green"
                              variant="outline"
                              isDisabled={position.assignedCrew.length >= position.quantity || event.status === 'cancelled'}
                              onClick={() => navigate(`/crew-directory?positionId=${position.id}&eventId=${eventId}`)}
                            >
                              Add Crew
                            </Button>
                          </Flex>
                          
                          {position.assignedCrew.length > 0 ? (
                            <Table size="sm" variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>Name</Th>
                                  <Th>Trust Score</Th>
                                  <Th>Skills</Th>
                                  <Th isNumeric>Actions</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {position.assignedCrew.map((crew: any) => (
                                  <Tr key={crew.id}>
                                    <Td fontWeight="medium">{crew.name}</Td>
                                    <Td>
                                      <Badge colorScheme={crew.trustScore > 80 ? "green" : crew.trustScore > 60 ? "yellow" : "orange"}>
                                        {crew.trustScore}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Flex wrap="wrap" gap={1}>
                                        {crew.skills.slice(0, 2).map((skill: string) => (
                                          <Badge key={skill} colorScheme="blue" variant="outline" fontSize="xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                        {crew.skills.length > 2 && (
                                          <Tooltip label={crew.skills.slice(2).join(", ")}>
                                            <Badge colorScheme="gray" fontSize="xs">+{crew.skills.length - 2}</Badge>
                                          </Tooltip>
                                        )}
                                      </Flex>
                                    </Td>
                                    <Td isNumeric>
                                      <Button
                                        size="xs"
                                        colorScheme="red"
                                        variant="ghost"
                                        leftIcon={<FiX />}
                                        isDisabled={event.status === 'cancelled'}
                                        onClick={() => {
                                          setSelectedCrewForRemoval(crew);
                                          setSelectedPositionForRemoval(position);
                                          onRemoveCrewModalOpen();
                                        }}
                                      >
                                        Remove
                                      </Button>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          ) : (
                            <Alert status="info" size="sm">
                              <AlertIcon />
                              <Text fontSize="sm">No crew members assigned to this position yet.</Text>
                            </Alert>
                          )}
                        </Box>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Box>
          </TabPanel>

          {/* Call Times Panel */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Flex justify="space-between" align="center">
                <Heading size="md">Call Times</Heading>
                <Button 
                  leftIcon={<FiPlus />} 
                  colorScheme="green" 
                  size="sm"
                  onClick={() => {
                    setSelectedCallTime(null);
                    onEditCallTimeModalOpen();
                  }}
                >
                  Add Call Time
                </Button>
              </Flex>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {event.callTimes.map((callTime: any) => (
                  <Box 
                    key={callTime.id} 
                    borderWidth="1px" 
                    borderRadius="lg" 
                    p={4}
                    shadow="sm"
                  >
                    <VStack align="stretch" spacing={3}>
                      <Flex justify="space-between">
                        <Text fontWeight="bold">
                          {new Date(callTime.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Text>
                        <HStack>
                          <IconButton
                            aria-label="Edit call time"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCallTime(callTime);
                              onEditCallTimeModalOpen();
                            }}
                          />
                          <IconButton
                            aria-label="Delete call time"
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                          />
                        </HStack>
                      </Flex>
                      
                      <Text fontWeight="bold">
                        {new Date(callTime.date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}
                      </Text>
                      
                      <HStack>
                        <FiMapPin />
                        <Text>{callTime.location}</Text>
                      </HStack>
                      
                      <Text fontSize="sm" color="gray.600">
                        {callTime.description}
                      </Text>
                      
                      <Flex gap={2} wrap="wrap">
                        {callTime.departments.map((dept: string) => (
                          <Tag 
                            key={dept} 
                            size="sm" 
                            colorScheme="purple" 
                            mt={1}
                          >
                            {dept}
                          </Tag>
                        ))}
                      </Flex>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </TabPanel>

          {/* Payments Panel */}
          <TabPanel>
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Payments & Escrow</Heading>
              
              <Box borderWidth="1px" borderRadius="lg" p={5} shadow="sm">
                <VStack align="stretch" spacing={4}>
                  <Heading size="sm">Escrow Status</Heading>
                  
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Stat>
                      <StatLabel>Total Budget</StatLabel>
                      <StatNumber>${event.budget.toLocaleString()}</StatNumber>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Funded</StatLabel>
                      <StatNumber>${event.escrow.funded.toLocaleString()}</StatNumber>
                      <StatHelpText>
                        {Math.round((event.escrow.funded / event.budget) * 100)}% of budget
                      </StatHelpText>
                    </Stat>
                    
                    <Stat>
                      <StatLabel>Released</StatLabel>
                      <StatNumber>${event.escrow.released.toLocaleString()}</StatNumber>
                      <StatHelpText>
                        {Math.round((event.escrow.released / event.escrow.funded) * 100 || 0)}% of funded
                      </StatHelpText>
                    </Stat>
                  </SimpleGrid>
                  
                  <Progress
                    value={(event.escrow.funded / event.budget) * 100}
                    colorScheme="green"
                    size="sm"
                    borderRadius="full"
                    mb={4}
                  />
                  
                  {/* Coinbase Payment Component */}
                  <CoinbasePayment 
                    eventId={eventId || ''}
                    escrow={event.escrow}
                    budget={event.budget}
                    onFundSuccess={(amount) => {
                      // In a real implementation, we would refresh the event data
                      // For now, we'll just update the state directly
                      setEvent({
                        ...event,
                        escrow: {
                          ...event.escrow,
                          funded: event.escrow.funded + amount
                        }
                      });
                      
                      toast({
                        title: "Funding successful",
                        description: `Successfully added $${amount.toLocaleString()} to escrow`,
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                      });
                    }}
                  />
                </VStack>
              </Box>
              
              {/* Crew Payment Section */}
              {event.positions.some((position: any) => position.assignedCrew.length > 0) && (
                <Box borderWidth="1px" borderRadius="lg" p={5} shadow="sm" mt={4}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="sm">Crew Payments</Heading>
                    
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Crew Member</Th>
                          <Th>Position</Th>
                          <Th isNumeric>Pay Rate</Th>
                          <Th isNumeric>Days</Th>
                          <Th isNumeric>Total</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {event.positions.flatMap((position: any) =>
                          position.assignedCrew.map((crew: any, index: number) => {
                            // Calculate payment info
                            const start = new Date(event.startDate);
                            const end = new Date(event.endDate);
                            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
                            const total = position.payRate * days;
                            // For demo purposes, assume first crew member is paid
                            const isPaid = index === 0;
                            
                            return (
                              <Tr key={`${position.id}-${crew.id}`}>
                                <Td>
                                  <HStack>
                                    <Avatar size="sm" name={crew.name} src={crew.avatar} />
                                    <Text>{crew.name}</Text>
                                  </HStack>
                                </Td>
                                <Td>{position.title}</Td>
                                <Td isNumeric>${position.payRate}/day</Td>
                                <Td isNumeric>{days}</Td>
                                <Td isNumeric>${total}</Td>
                                <Td>
                                  <Badge
                                    colorScheme={isPaid ? "green" : "yellow"}
                                  >
                                    {isPaid ? "Paid" : "Pending"}
                                  </Badge>
                                </Td>
                              </Tr>
                            );
                          })
                        )}
                      </Tbody>
                    </Table>
                    
                    {/* Add a button to release funds to crew */}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                      <Button 
                        leftIcon={<FiUnlock />} 
                        colorScheme="blue"
                        onClick={onReleaseEscrowModalOpen}
                        isDisabled={
                          event.status === 'cancelled' || 
                          event.escrow.funded <= 0 || 
                          event.escrow.funded <= event.escrow.released
                        }
                        size="md"
                      >
                        Release Funds to Crew
                      </Button>
                    </Box>
                  </VStack>
                </Box>
              )}
              
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      
      {/* Modals will be added here in the next steps */}
      
      {/* Cancel Event Modal */}
      <Modal isOpen={isCancelModalOpen} onClose={onCancelModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>This action cannot be undone!</AlertTitle>
                <AlertDescription>
                  Cancelling this event will notify all crew members and release any remaining escrow funds.
                </AlertDescription>
              </Box>
            </Alert>
            
            <FormControl isRequired>
              <FormLabel>Reason for Cancellation</FormLabel>
              <Textarea 
                placeholder="Please provide a reason for cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCancelModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleCancelEvent}
              isLoading={cancelling}
              loadingText="Cancelling..."
              isDisabled={!cancelReason.trim()}
            >
              Confirm Cancellation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Crew Member Modal */}
      <Modal isOpen={isRemoveCrewModalOpen} onClose={onRemoveCrewModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove Crew Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCrewForRemoval && selectedPositionForRemoval && (
              <>
                <Alert status="warning" mb={4}>
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Confirm Removal</AlertTitle>
                    <AlertDescription>
                      Are you sure you want to remove {selectedCrewForRemoval.name} from the {selectedPositionForRemoval.title} position?
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <Text>
                  This crew member will be notified that they have been removed from this position.
                  If they have already been paid, the funds will not be recovered.
                </Text>
              </>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRemoveCrewModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="red" 
              onClick={async () => {
                if (!selectedCrewForRemoval || !selectedPositionForRemoval) return;
                
                try {
                  setLoading(true);
                  
                  await eventManagementService.removeCrewMember(
                    eventId || '',
                    selectedPositionForRemoval.id,
                    selectedCrewForRemoval.id
                  );
                  
                  // Update local state
                  setEvent({
                    ...event,
                    positions: event.positions.map((position: any) => {
                      if (position.id === selectedPositionForRemoval.id) {
                        return {
                          ...position,
                          assignedCrew: position.assignedCrew.filter(
                            (crew: any) => crew.id !== selectedCrewForRemoval.id
                          )
                        };
                      }
                      return position;
                    })
                  });
                  
                  toast({
                    title: "Crew member removed",
                    description: `${selectedCrewForRemoval.name} has been removed from the ${selectedPositionForRemoval.title} position.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  
                  onRemoveCrewModalClose();
                } catch (err) {
                  console.error('Error removing crew member:', err);
                  toast({
                    title: "Removal failed",
                    description: "There was a problem removing the crew member. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } finally {
                  setLoading(false);
                  setSelectedCrewForRemoval(null);
                  setSelectedPositionForRemoval(null);
                }
              }}
              isLoading={loading}
              loadingText="Removing..."
            >
              Remove
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Fund Escrow Modal */}
      <Modal isOpen={isFundEscrowModalOpen} onClose={onFundEscrowModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fund Escrow</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2}>Event Budget: ${event.budget.toLocaleString()}</Text>
                <Text mb={2}>Current Escrow Balance: ${event.escrow.funded.toLocaleString()}</Text>
                <Text mb={4}>Amount Needed: ${(event.budget - event.escrow.funded).toLocaleString()}</Text>
              </Box>
              
              <FormControl isRequired>
                <FormLabel>Amount to Fund (USD)</FormLabel>
                <Input 
                  type="number"
                  placeholder="Enter amount"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                />
              </FormControl>
              
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Escrow Information</AlertTitle>
                  <AlertDescription>
                    Funds will be held in an escrow contract until the event is completed 
                    and will be released to crew members upon your approval.
                    <Text mt={2}>Escrow Contract: {event.escrow.contractAddress}</Text>
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFundEscrowModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              leftIcon={<FiDollarSign />}
              onClick={async () => {
                if (!fundAmount || parseFloat(fundAmount) <= 0) return;
                
                try {
                  setPaymentLoading(true);
                  
                  await eventManagementService.fundEscrow(
                    eventId || '',
                    fundAmount
                  );
                  
                  // Update local state
                  const newFundedAmount = event.escrow.funded + parseFloat(fundAmount);
                  setEvent({
                    ...event,
                    escrow: {
                      ...event.escrow,
                      funded: newFundedAmount
                    }
                  });
                  
                  toast({
                    title: "Escrow funded",
                    description: `$${parseFloat(fundAmount).toLocaleString()} has been added to the escrow.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  
                  setFundAmount('');
                  onFundEscrowModalClose();
                } catch (err) {
                  console.error('Error funding escrow:', err);
                  toast({
                    title: "Funding failed",
                    description: "There was a problem funding the escrow. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } finally {
                  setPaymentLoading(false);
                }
              }}
              isLoading={paymentLoading}
              loadingText="Processing..."
              isDisabled={!fundAmount || parseFloat(fundAmount) <= 0}
            >
              Fund Escrow
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Release Escrow Modal */}
      <Modal isOpen={isReleaseEscrowModalOpen} onClose={onReleaseEscrowModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Release Funds to Crew</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <AlertTitle>Release Payment</AlertTitle>
                  <AlertDescription>
                    This will release funds from escrow to pay crew members for their work. 
                    You can choose to pay all crew members or select specific ones.
                  </AlertDescription>
                </Box>
              </Alert>
              
              <Box>
                <Text mb={2}>Current Escrow Balance: ${event.escrow.funded.toLocaleString()}</Text>
                <Text mb={2}>Already Released: ${event.escrow.released.toLocaleString()}</Text>
                <Text mb={4}>Available to Release: ${(event.escrow.funded - event.escrow.released).toLocaleString()}</Text>
              </Box>
              
              <Box borderWidth="1px" borderRadius="md" p={4}>
                <Text fontWeight="bold" mb={2}>Select Crew Members to Pay:</Text>
                
                <CheckboxGroup colorScheme="green">
                  <VStack align="stretch" spacing={2}>
                    {event.positions.flatMap((position: any) => 
                      position.assignedCrew.map((crew: any) => {
                        // For demo purposes, assume first crew member is paid, others are pending
                        const isPaid = crew.id === 'crew1';
                        if (isPaid) return null;
                        
                        // Calculate payment amount
                        const start = new Date(event.startDate);
                        const end = new Date(event.endDate);
                        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
                        const totalPay = position.payRate * days;
                        
                        return (
                          <Checkbox key={`${position.id}-${crew.id}`} value={crew.id}>
                            <Flex justify="space-between" width="100%">
                              <Text>{crew.name} ({position.title})</Text>
                              <Text fontWeight="bold">${totalPay}</Text>
                            </Flex>
                          </Checkbox>
                        );
                      })
                    ).filter(Boolean)}
                  </VStack>
                </CheckboxGroup>
                
                {event.positions.every((position: any) => 
                  position.assignedCrew.every((crew: any) => crew.id === 'crew1')
                ) && (
                  <Text color="gray.500" fontSize="sm" mt={2}>
                    All crew members have already been paid.
                  </Text>
                )}
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onReleaseEscrowModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<FiUnlock />}
              onClick={async () => {
                try {
                  setPaymentLoading(true);
                  
                  // For demo purposes, assume releasing all funds
                  const amountToRelease = event.escrow.funded - event.escrow.released;
                  
                  await eventManagementService.releaseEscrow(
                    eventId || ''
                  );
                  
                  // Update local state
                  setEvent({
                    ...event,
                    escrow: {
                      ...event.escrow,
                      released: event.escrow.funded
                    }
                  });
                  
                  toast({
                    title: "Funds released",
                    description: `$${amountToRelease.toLocaleString()} has been released to crew members.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  
                  onReleaseEscrowModalClose();
                } catch (err) {
                  console.error('Error releasing funds:', err);
                  toast({
                    title: "Release failed",
                    description: "There was a problem releasing funds. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } finally {
                  setPaymentLoading(false);
                }
              }}
              isLoading={paymentLoading}
              loadingText="Processing..."
              isDisabled={event.escrow.funded <= event.escrow.released}
            >
              Release Funds
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Edit Call Time Modal */}
      <Modal isOpen={isEditCallTimeModalOpen} onClose={onEditCallTimeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedCallTime ? 'Edit Call Time' : 'Add Call Time'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Date & Time</FormLabel>
                <Input 
                  type="datetime-local" 
                  defaultValue={selectedCallTime ? new Date(selectedCallTime.date).toISOString().slice(0, 16) : ''}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input 
                  placeholder="Enter meeting location"
                  defaultValue={selectedCallTime?.location || ''}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  placeholder="Enter details about this call time"
                  defaultValue={selectedCallTime?.description || ''}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Departments</FormLabel>
                <Select placeholder="Select department">
                  <option value="All Crew">All Crew</option>
                  <option value="Camera">Camera</option>
                  <option value="Sound">Sound</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Production Assistant">Production Assistant</option>
                  <option value="Art Department">Art Department</option>
                </Select>
                <Flex wrap="wrap" mt={2} gap={2}>
                  {selectedCallTime?.departments.map((dept: string) => (
                    <Tag key={dept} size="md" colorScheme="purple" borderRadius="full">
                      <TagLabel>{dept}</TagLabel>
                      <TagCloseButton />
                    </Tag>
                  )) || [
                    <Tag key="demo" size="md" colorScheme="purple" borderRadius="full">
                      <TagLabel>All Crew</TagLabel>
                      <TagCloseButton />
                    </Tag>
                  ]}
                </Flex>
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditCallTimeModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue"
              onClick={async () => {
                try {
                  setLoading(true);
                  
                  // For demo purposes, assume call time is updated
                  // In a real implementation, you would collect form data and use it here
                  const updatedCallTimes = [...event.callTimes];
                  
                  if (selectedCallTime) {
                    // Update existing call time
                    const index = updatedCallTimes.findIndex(ct => ct.id === selectedCallTime.id);
                    if (index !== -1) {
                      updatedCallTimes[index] = {
                        ...selectedCallTime,
                        // Demo update
                        description: selectedCallTime.description + " (Updated)"
                      };
                    }
                  } else {
                    // Add new call time
                    const newCallTime = {
                      id: 'call' + (updatedCallTimes.length + 1),
                      date: new Date().toISOString(),
                      location: 'New Location',
                      description: 'New call time',
                      departments: ['All Crew']
                    };
                    updatedCallTimes.push(newCallTime);
                  }
                  
                  await eventManagementService.updateCallTimes(
                    eventId || '',
                    updatedCallTimes
                  );
                  
                  // Update local state
                  setEvent({
                    ...event,
                    callTimes: updatedCallTimes
                  });
                  
                  toast({
                    title: selectedCallTime ? "Call time updated" : "Call time added",
                    description: selectedCallTime 
                      ? "The call time has been updated successfully." 
                      : "A new call time has been added to the event.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  
                  onEditCallTimeModalClose();
                } catch (err) {
                  console.error('Error updating call time:', err);
                  toast({
                    title: "Update failed",
                    description: "There was a problem updating the call time. Please try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                } finally {
                  setLoading(false);
                  setSelectedCallTime(null);
                }
              }}
              isLoading={loading}
              loadingText={selectedCallTime ? "Updating..." : "Adding..."}
            >
              {selectedCallTime ? 'Update' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default ManageEvent;
