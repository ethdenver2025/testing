import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Progress,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiDollarSign } from 'react-icons/fi';

// Simple component that doesn't rely on any complex dependencies
const PaymentsStandalone = () => {
  const bgColor = useColorModeValue('background.primary', 'background.primary');
  const borderColor = useColorModeValue('border.subtle', 'border.subtle');

  return (
    <Box>
      <Heading as="h1" size="lg" mb={4}>Payments Dashboard</Heading>
      
      <Text mb={4} color="text.secondary">
        Manage your event payments and escrow contracts in one place.
      </Text>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
        <Stat p={4} border="1px solid" borderColor={borderColor} rounded="md" bg={bgColor}>
          <StatLabel>Total Budget</StatLabel>
          <StatNumber color="accent.primary">$25,000</StatNumber>
          <StatHelpText>All Events</StatHelpText>
        </Stat>
        
        <Stat p={4} border="1px solid" borderColor={borderColor} rounded="md" bg={bgColor}>
          <StatLabel>Funds Committed</StatLabel>
          <StatNumber color="accent.primary">$15,000</StatNumber>
          <StatHelpText>60% of total budget</StatHelpText>
          <Progress value={60} colorScheme="blue" size="sm" mt={2} />
        </Stat>
        
        <Stat p={4} border="1px solid" borderColor={borderColor} rounded="md" bg={bgColor}>
          <StatLabel>Funds Released</StatLabel>
          <StatNumber color="accent.primary">$5,000</StatNumber>
          <StatHelpText>33% of committed funds</StatHelpText>
          <Progress value={33} colorScheme="green" size="sm" mt={2} />
        </Stat>
      </SimpleGrid>
      
      <Box p={4} border="1px solid" borderColor={borderColor} rounded="md" bg={bgColor} mb={6}>
        <Flex justify="space-between" align="center" mb={3}>
          <Heading as="h2" size="md">Coinbase Payment Portal</Heading>
          <Button leftIcon={<FiDollarSign />} colorScheme="blue" size="sm">Connect Wallet</Button>
        </Flex>
        
        <Text mb={3} fontSize="sm" color="text.secondary">
          Fund your event escrow account using Coinbase's secure payment system.
        </Text>
        
        <Center p={4} border="1px dashed" borderColor={borderColor} rounded="md" bg="background.secondary">
          <VStack spacing={2}>
            <Text fontSize="md" fontWeight="medium">Secure Payment Processing</Text>
            <Text fontSize="sm" color="text.secondary" textAlign="center">
              Connect your wallet to access the payment interface.
            </Text>
          </VStack>
        </Center>
      </Box>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Box p={4} border="1px solid" borderColor={borderColor} rounded="md" bg={bgColor}>
          <Heading as="h3" size="md" mb={3}>Recent Transactions</Heading>
          
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" p={2} bg="background.secondary" rounded="md">
              <Text fontSize="sm">ETHDenver Hackathon</Text>
              <Text fontSize="sm" fontWeight="medium" color="green.500">+$5,000</Text>
            </Flex>
            <Flex justify="space-between" p={2} bg="background.secondary" rounded="md">
              <Text fontSize="sm">Crew Payment - John D.</Text>
              <Text fontSize="sm" fontWeight="medium" color="red.500">-$1,200</Text>
            </Flex>
            <Flex justify="space-between" p={2} bg="background.secondary" rounded="md">
              <Text fontSize="sm">Venue Deposit</Text>
              <Text fontSize="sm" fontWeight="medium" color="red.500">-$2,000</Text>
            </Flex>
          </VStack>
        </Box>
        
        <Box p={4} border="1px solid" borderColor={borderColor} rounded="md" bg={bgColor}>
          <Heading as="h3" size="md" mb={3}>Payment Schedule</Heading>
          
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between" p={2} bg="background.secondary" rounded="md">
              <Text fontSize="sm">Venue Final Payment</Text>
              <Text fontSize="sm">Due: Mar 15, 2025</Text>
            </Flex>
            <Flex justify="space-between" p={2} bg="background.secondary" rounded="md">
              <Text fontSize="sm">Catering Deposit</Text>
              <Text fontSize="sm">Due: Mar 20, 2025</Text>
            </Flex>
            <Flex justify="space-between" p={2} bg="background.secondary" rounded="md">
              <Text fontSize="sm">Crew Final Payment</Text>
              <Text fontSize="sm">Due: Mar 31, 2025</Text>
            </Flex>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default PaymentsStandalone;
