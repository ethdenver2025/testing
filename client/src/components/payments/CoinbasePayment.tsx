import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  useToast,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { FiExternalLink, FiShoppingBag, FiCreditCard, FiWifi, FiCheckCircle, FiDollarSign, FiLock } from 'react-icons/fi';
import { OnchainContext } from '../providers/OnchainKitProvider';
import './coinbase-styles.css';

interface CoinbasePaymentProps {
  eventId: string;
  escrow: {
    contractAddress: string;
    funded: number;
    released: number;
  };
  budget: number;
  onFundSuccess: (amount: number) => void;
}

// Define funding method options
const FUNDING_METHODS = [
  { 
    id: 'coinbase',
    name: 'Coinbase',
    description: 'Fund using Coinbase Pay',
    icon: <FiCreditCard size="24px" />,
    color: 'blue.500',
    bgColor: 'blue.50',
  },
  { 
    id: 'wallet',
    name: 'Crypto Wallet',
    description: 'Connect your wallet and transfer funds',
    icon: <FiWifi size="24px" />,
    color: 'purple.500',
    bgColor: 'purple.50',
  },
];

const steps = [
  { title: 'Select Payment', description: 'Choose payment method' },
  { title: 'Process Payment', description: 'Complete payment' },
  { title: 'Confirmation', description: 'Payment confirmed' },
];

const CoinbasePayment: React.FC<CoinbasePaymentProps> = ({
  eventId,
  escrow,
  budget,
  onFundSuccess,
}) => {
  const toast = useToast();
  const { apiKey } = useContext(OnchainContext);
  
  // States
  const [fundingAmount, setFundingAmount] = useState<number>(budget - escrow.funded > 0 ? budget - escrow.funded : 0);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Check if escrow is fully funded
  const isFullyFunded = escrow.funded >= budget;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Handle method selection
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setActiveStep(0);
  };
  
  // Handle funding with Coinbase
  const handleCoinbaseFunding = async () => {
    setIsLoading(true);
    
    try {
      if (!apiKey) {
        toast({
          title: 'API Key Missing',
          description: 'Coinbase API key is not configured',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      // In a real implementation, this would initiate the Coinbase payment flow
      // For now, we'll simulate a successful payment
      setTimeout(() => {
        // Move to success step
        setActiveStep(2);
        
        // Notify parent component of successful funding
        onFundSuccess(fundingAmount);
        
        toast({
          title: 'Payment Successful',
          description: `Successfully funded ${formatCurrency(fundingAmount)}`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'An error occurred during payment processing',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box borderRadius="lg" overflow="hidden" bg="white" color="gray.800">
      <Box p={6} bg="blue.600" color="white">
        <Heading size="md">Fund Escrow Contract</Heading>
        <Text fontSize="sm" mt={1}>Secure payment to fund your event escrow</Text>
      </Box>
      
      <Box p={6}>
        <VStack spacing={6} align="stretch">
          {/* Funding Status */}
          <Box>
            <HStack spacing={4} justify="space-between">
              <Box>
                <Text fontWeight="bold" mb={1}>Escrow Contract</Text>
                <HStack>
                  <Text fontSize="sm" color="gray.500">{escrow.contractAddress.substring(0, 10)}...{escrow.contractAddress.substring(escrow.contractAddress.length - 8)}</Text>
                  <Tooltip label="View on Etherscan">
                    <IconButton
                      aria-label="View on Etherscan"
                      icon={<FiExternalLink />}
                      size="xs"
                      variant="ghost"
                    />
                  </Tooltip>
                </HStack>
              </Box>
              <Badge colorScheme={isFullyFunded ? 'green' : 'orange'} p={2} borderRadius="md">
                {isFullyFunded ? 'Fully Funded' : 'Funding Required'}
              </Badge>
            </HStack>
          </Box>
          
          <Divider />
          
          {/* Funding Stats */}
          <HStack spacing={8} justify="space-between">
            <Stat>
              <StatLabel>Budget</StatLabel>
              <StatNumber>{formatCurrency(budget)}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Funded</StatLabel>
              <StatNumber>{formatCurrency(escrow.funded)}</StatNumber>
              <StatHelpText>{((escrow.funded / budget) * 100).toFixed(0)}%</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Needed</StatLabel>
              <StatNumber>{formatCurrency(Math.max(0, budget - escrow.funded))}</StatNumber>
            </Stat>
          </HStack>
          
          {!isFullyFunded && (
            <>
              <Divider />
              
              {/* Payment Methods */}
              <Box>
                <Text fontWeight="bold" mb={4}>Select Payment Method</Text>
                <HStack spacing={4}>
                  {FUNDING_METHODS.map((method) => (
                    <Card 
                      key={method.id}
                      variant={selectedMethod === method.id ? 'filled' : 'outline'}
                      cursor="pointer"
                      onClick={() => handleMethodSelect(method.id)}
                      flex="1"
                      bg={selectedMethod === method.id ? method.bgColor : 'white'}
                    >
                      <CardBody>
                        <HStack spacing={4}>
                          <Box bg={method.bgColor} p={3} borderRadius="md">
                            {method.icon}
                          </Box>
                          <Box>
                            <Text fontWeight="bold">{method.name}</Text>
                            <Text fontSize="sm" color="gray.600">{method.description}</Text>
                          </Box>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </HStack>
              </Box>
              
              {/* Coinbase Payment Option */}
              {selectedMethod === 'coinbase' && (
                <Box mt={4} p={6} borderWidth="1px" borderRadius="md" borderColor="blue.100" bg="blue.50">
                  <VStack spacing={4}>
                    <Box bg="white" p={4} borderRadius="md" width="100%" textAlign="center">
                      <HStack spacing={2} justify="center" mb={2}>
                        <FiDollarSign />
                        <Text fontWeight="bold">Amount to Fund</Text>
                      </HStack>
                      <Heading size="lg">{formatCurrency(fundingAmount)}</Heading>
                    </Box>
                    
                    <Button
                      leftIcon={<FiLock />}
                      rightIcon={<FiCreditCard />}
                      colorScheme="blue"
                      size="lg"
                      width="100%"
                      onClick={handleCoinbaseFunding}
                      isLoading={isLoading}
                      loadingText="Processing Payment"
                    >
                      Pay with Coinbase
                    </Button>
                    
                    {activeStep === 2 && (
                      <Alert status="success" borderRadius="md">
                        <AlertIcon />
                        <HStack>
                          <FiCheckCircle />
                          <Text>Payment successful! Escrow has been funded.</Text>
                        </HStack>
                      </Alert>
                    )}
                    
                    <Text fontSize="xs" color="gray.600" textAlign="center">
                      Secured by Coinbase. Your payment information is encrypted and secure.
                    </Text>
                  </VStack>
                </Box>
              )}
              
              {/* Wallet Payment Option - Placeholder */}
              {selectedMethod === 'wallet' && (
                <Box mt={4} p={6} borderWidth="1px" borderRadius="md">
                  <VStack spacing={4} align="center">
                    <Text>Connect your wallet to continue</Text>
                    <Button colorScheme="purple">
                      Connect Wallet
                    </Button>
                  </VStack>
                </Box>
              )}
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default CoinbasePayment;
