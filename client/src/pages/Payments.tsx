import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  SimpleGrid,
  useToast,
  Alert,
  AlertIcon,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import { FiDollarSign, FiUnlock, FiExternalLink } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import CoinbasePayment from '../components/payments/CoinbasePayment';

// Mock service for payments
const paymentService = {
  getPaymentSummary: async () => {
    // Simulating API call
    return {
      totalBudget: 25000,
      totalFunded: 15000,
      totalReleased: 5000,
      events: [
        {
          id: '1',
          name: 'Music Festival 2025',
          budget: 10000,
          escrow: { funded: 8000, released: 3000 },
          startDate: '2025-04-15T00:00:00Z',
          endDate: '2025-04-18T00:00:00Z',
        },
        {
          id: '2',
          name: 'Corporate Conference',
          budget: 15000,
          escrow: { funded: 7000, released: 2000 },
          startDate: '2025-05-20T00:00:00Z',
          endDate: '2025-05-22T00:00:00Z',
        }
      ],
      transactions: [
        { id: '1', eventId: '1', amount: 5000, type: 'deposit', date: '2025-02-15T10:30:00Z', status: 'completed' },
        { id: '2', eventId: '1', amount: 3000, type: 'deposit', date: '2025-02-20T14:45:00Z', status: 'completed' },
        { id: '3', eventId: '1', amount: 2000, type: 'withdrawal', date: '2025-03-01T09:15:00Z', status: 'completed' },
        { id: '4', eventId: '1', amount: 1000, type: 'withdrawal', date: '2025-03-01T09:20:00Z', status: 'completed' },
        { id: '5', eventId: '2', amount: 7000, type: 'deposit', date: '2025-02-25T16:30:00Z', status: 'completed' },
        { id: '6', eventId: '2', amount: 2000, type: 'withdrawal', date: '2025-03-01T10:00:00Z', status: 'completed' },
      ]
    };
  },
  fundEvent: async (eventId: string, amount: number) => {
    // Simulating API call
    return { success: true };
  },
  releasePayments: async (eventId: string) => {
    // Simulating API call
    return { success: true };
  }
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const Payments: React.FC = () => {
  const toast = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [fundAmount, setFundAmount] = useState<string>('');
  
  const { 
    isOpen: isFundModalOpen, 
    onOpen: onFundModalOpen, 
    onClose: onFundModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isReleaseModalOpen, 
    onOpen: onReleaseModalOpen, 
    onClose: onReleaseModalClose 
  } = useDisclosure();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        const data = await paymentService.getPaymentSummary();
        setPaymentData(data);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        toast({
          title: 'Error fetching payment data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, [toast]);

  const handleFundEvent = async () => {
    if (!selectedEvent || !fundAmount) return;
    
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount greater than zero',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      await paymentService.fundEvent(selectedEvent.id, amount);
      
      // Update local state
      const updatedEvents = paymentData.events.map((event: any) => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            escrow: {
              ...event.escrow,
              funded: event.escrow.funded + amount
            }
          };
        }
        return event;
      });
      
      setPaymentData({
        ...paymentData,
        totalFunded: paymentData.totalFunded + amount,
        events: updatedEvents
      });
      
      toast({
        title: 'Funding successful',
        description: `Successfully added $${amount.toLocaleString()} to escrow`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setFundAmount('');
      onFundModalClose();
    } catch (error) {
      console.error('Error funding event:', error);
      toast({
        title: 'Error funding event',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReleasePayments = async () => {
    if (!selectedEvent) return;
    
    try {
      await paymentService.releasePayments(selectedEvent.id);
      
      // Update local state
      const updatedEvents = paymentData.events.map((event: any) => {
        if (event.id === selectedEvent.id) {
          return {
            ...event,
            escrow: {
              ...event.escrow,
              released: event.escrow.funded
            }
          };
        }
        return event;
      });
      
      setPaymentData({
        ...paymentData,
        totalReleased: paymentData.totalReleased + (selectedEvent.escrow.funded - selectedEvent.escrow.released),
        events: updatedEvents
      });
      
      toast({
        title: 'Payments released',
        description: `Successfully released payments to crew`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onReleaseModalClose();
    } catch (error) {
      console.error('Error releasing payments:', error);
      toast({
        title: 'Error releasing payments',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box p={5}>
        <Text>Loading payment data...</Text>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={6}>Payments Dashboard</Heading>
      
      {/* Overview */}
      <Box borderWidth="1px" borderRadius="lg" p={5} shadow="sm" mb={6}>
        <Heading size="md" mb={4}>Financial Overview</Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Stat>
            <StatLabel>Total Budget</StatLabel>
            <StatNumber>${paymentData.totalBudget.toLocaleString()}</StatNumber>
          </Stat>
          
          <Stat>
            <StatLabel>Total Funded</StatLabel>
            <StatNumber>${paymentData.totalFunded.toLocaleString()}</StatNumber>
            <StatHelpText>
              {Math.round((paymentData.totalFunded / paymentData.totalBudget) * 100)}% of budget
            </StatHelpText>
          </Stat>
          
          <Stat>
            <StatLabel>Total Released</StatLabel>
            <StatNumber>${paymentData.totalReleased.toLocaleString()}</StatNumber>
            <StatHelpText>
              {Math.round((paymentData.totalReleased / paymentData.totalFunded) * 100)}% of funded
            </StatHelpText>
          </Stat>
        </SimpleGrid>
        
        <Progress
          value={(paymentData.totalFunded / paymentData.totalBudget) * 100}
          colorScheme="green"
          size="sm"
          borderRadius="full"
          mt={4}
        />
      </Box>
      
      {/* Events */}
      <Box borderWidth="1px" borderRadius="lg" p={5} shadow="sm" mb={6}>
        <Heading size="md" mb={4}>Event Funding</Heading>
        
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Event</Th>
              <Th>Date</Th>
              <Th isNumeric>Budget</Th>
              <Th isNumeric>Funded</Th>
              <Th isNumeric>Released</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paymentData.events.map((event: any) => (
              <Tr key={event.id}>
                <Td fontWeight="medium">{event.name}</Td>
                <Td>{formatDate(event.startDate)}</Td>
                <Td isNumeric>${event.budget.toLocaleString()}</Td>
                <Td isNumeric>
                  ${event.escrow.funded.toLocaleString()}
                  <Text as="span" fontSize="sm" color="gray.500">
                    ({Math.round((event.escrow.funded / event.budget) * 100)}%)
                  </Text>
                </Td>
                <Td isNumeric>
                  ${event.escrow.released.toLocaleString()}
                  <Text as="span" fontSize="sm" color="gray.500">
                    ({Math.round((event.escrow.released / event.escrow.funded || 1) * 100)}%)
                  </Text>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      leftIcon={<FiDollarSign />}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => {
                        setSelectedEvent(event);
                        onFundModalOpen();
                      }}
                    >
                      Fund
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiUnlock />}
                      colorScheme="green"
                      variant="outline"
                      isDisabled={event.escrow.funded <= event.escrow.released}
                      onClick={() => {
                        setSelectedEvent(event);
                        onReleaseModalOpen();
                      }}
                    >
                      Release
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      
      {/* Transaction History */}
      <Box borderWidth="1px" borderRadius="lg" p={5} shadow="sm">
        <Heading size="md" mb={4}>Transaction History</Heading>
        
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Event</Th>
              <Th>Type</Th>
              <Th isNumeric>Amount</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paymentData.transactions.map((transaction: any) => {
              const eventName = paymentData.events.find((e: any) => e.id === transaction.eventId)?.name || 'Unknown Event';
              return (
                <Tr key={transaction.id}>
                  <Td>{formatDate(transaction.date)}</Td>
                  <Td>{eventName}</Td>
                  <Td>
                    <Badge
                      colorScheme={transaction.type === 'deposit' ? 'green' : 'blue'}
                    >
                      {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </Badge>
                  </Td>
                  <Td isNumeric>${transaction.amount.toLocaleString()}</Td>
                  <Td>
                    <Badge
                      colorScheme={transaction.status === 'completed' ? 'green' : 'yellow'}
                    >
                      {transaction.status}
                    </Badge>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      
      {/* Fund Event Modal */}
      <Modal isOpen={isFundModalOpen} onClose={onFundModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fund Event Escrow</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <VStack align="stretch" spacing={4}>
                <Text fontWeight="bold">{selectedEvent.name}</Text>
                
                <FormControl>
                  <FormLabel>Amount to Fund (USD)</FormLabel>
                  <Input
                    placeholder="Enter amount"
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                  />
                </FormControl>
                
                <Alert status="info">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Current funding: ${selectedEvent.escrow.funded.toLocaleString()} of ${selectedEvent.budget.toLocaleString()}
                  </Text>
                </Alert>
                
                <Divider my={2} />
                
                <Text fontWeight="bold">Payment Options:</Text>
                <CoinbasePayment 
                  eventId={selectedEvent.id} 
                  escrow={selectedEvent.escrow}
                  budget={selectedEvent.budget}
                  onFundSuccess={(amount) => {
                    console.log('Funding success with amount:', amount);
                    
                    // Update local state
                    const updatedEvents = paymentData.events.map((event: any) => {
                      if (event.id === selectedEvent.id) {
                        return {
                          ...event,
                          escrow: {
                            ...event.escrow,
                            funded: event.escrow.funded + amount
                          }
                        };
                      }
                      return event;
                    });
                    
                    setPaymentData({
                      ...paymentData,
                      totalFunded: paymentData.totalFunded + amount,
                      events: updatedEvents
                    });
                    
                    onFundModalClose();
                  }}
                />
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFundModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleFundEvent}>
              Fund Escrow
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
      {/* Release Payments Modal */}
      <Modal isOpen={isReleaseModalOpen} onClose={onReleaseModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Release Payments to Crew</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <VStack align="stretch" spacing={4}>
                <Text fontWeight="bold">{selectedEvent.name}</Text>
                
                <Alert status="info">
                  <AlertIcon />
                  <VStack align="stretch" spacing={1} w="100%">
                    <Text>Available funds: ${(selectedEvent.escrow.funded - selectedEvent.escrow.released).toLocaleString()}</Text>
                    <Text fontSize="sm">This will release all available funds to crew members.</Text>
                  </VStack>
                </Alert>
                
                <Box p={3} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">Payment Details:</Text>
                  <Text>Total to Release: ${(selectedEvent.escrow.funded - selectedEvent.escrow.released).toLocaleString()}</Text>
                  <Text fontSize="sm" color="gray.600">Funds will be automatically distributed to crew members based on their agreed rates.</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onReleaseModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green" 
              onClick={handleReleasePayments}
              leftIcon={<FiUnlock />}
            >
              Release Payments
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Payments;
