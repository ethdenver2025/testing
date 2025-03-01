import React, { useContext, useState } from 'react';
import { Box, Heading, Text, Button, VStack, Input, FormControl, FormLabel, Spinner, useToast } from '@chakra-ui/react';
import { OnchainContext } from '../providers/OnchainKitProvider';

const TestCoinbasePayment: React.FC = () => {
  const { createCharge, isLoading } = useContext(OnchainContext);
  const [amount, setAmount] = useState<string>('10');
  const [chargeData, setChargeData] = useState<any>(null);
  const toast = useToast();

  const handleCreateCharge = async () => {
    try {
      // Create a charge using our mock function
      const response = await createCharge({
        amount: parseFloat(amount),
        currency: 'USDC',
        description: 'Test payment for Formicary App',
      });

      setChargeData(response);
      
      toast({
        title: 'Payment initiated',
        description: `Created charge ID: ${response.id}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating charge:', error);
      
      toast({
        title: 'Error creating payment',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} maxW="500px" borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white" m="auto" mt={10}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" textAlign="center">Test Coinbase Payment</Heading>
        
        <FormControl>
          <FormLabel>Amount (USDC)</FormLabel>
          <Input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount" 
          />
        </FormControl>
        
        <Button 
          colorScheme="blue" 
          onClick={handleCreateCharge}
          isLoading={isLoading}
          loadingText="Processing"
        >
          Create Payment
        </Button>
        
        {chargeData && (
          <Box p={4} borderWidth={1} borderRadius="md" mt={4}>
            <Heading size="sm" mb={2}>Payment Details:</Heading>
            <Text>ID: {chargeData.id}</Text>
            <Text>Status: {chargeData.status}</Text>
            <Button 
              as="a" 
              href={chargeData.paymentUrl} 
              target="_blank" 
              colorScheme="green" 
              size="sm"
              mt={2}
            >
              Complete Payment
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default TestCoinbasePayment;
