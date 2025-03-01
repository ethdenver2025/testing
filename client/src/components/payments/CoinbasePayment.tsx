import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Tooltip,
  Divider,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  Image,
  Flex,
  Spinner,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { FiExternalLink, FiShoppingBag, FiCreditCard, FiWifi, FiCheckCircle, FiDollarSign, FiLock } from 'react-icons/fi';
import { OnchainContext } from '../providers/OnchainKitProvider';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
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

const CoinbasePayment: React.FC<CoinbasePaymentProps> = ({
  eventId,
  escrow,
  budget,
  onFundSuccess,
}) => {
  console.log('CoinbasePayment component initialized with:', { eventId, escrow, budget });
  
  const toast = useToast();
  const { apiKey, createCharge, isLoading: apiLoading, walletClient } = useContext(OnchainContext);
  
  // Use wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  
  console.log('Wallet connection status:', { address, isConnected });
  console.log('OnchainContext:', { apiKey, walletClient });
  
  // States
  const [fundingAmount, setFundingAmount] = useState<number>(budget - escrow.funded > 0 ? budget - escrow.funded : 0);
  const [selectedMethod, setSelectedMethod] = useState<string | null>("coinbase");
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { isOpen: isPaymentModalOpen, onOpen: onPaymentModalOpen, onClose: onPaymentModalClose } = useDisclosure();
  
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
    setActiveStep(1);
  };
  
  // Handle funding with Coinbase
  const handleCoinbaseFunding = async () => {
    if (!isConnected || !address) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to continue',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (fundingAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid funding amount',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    setActiveStep(2);

    try {
      console.log(`Funding escrow ${escrow.contractAddress} with $${fundingAmount}`);
      
      // Create the charge with actual blockchain parameters
      const charge = await createCharge({
        amount: fundingAmount / 1000, // Convert to ETH amount for demo (1000 USD = 1 ETH for simplicity)
        from: address,
        to: escrow.contractAddress || '0x8a71...3e9f', // Use the escrow address if available
        metadata: {
          eventId,
          purpose: 'event funding'
        }
      });

      // Set payment URL to Etherscan transaction view
      setPaymentUrl(charge.hosted_url);
      
      // Open payment modal to show transaction details
      onPaymentModalOpen();
      
      // Notify the parent component about the successful funding
      onFundSuccess(fundingAmount);
      
      // Success toast
      toast({
        title: 'Transaction initiated',
        description: `Transaction hash: ${charge.id.substring(0, 8)}...`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error('Error funding event:', error);
      
      toast({
        title: 'Funding failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setActiveStep(1);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Connect wallet function
  const connectWallet = () => {
    try {
      // Connect using the injected connector (MetaMask)
      connect({ connector: injected() });
      
      // Show success toast but only if no errors
      setTimeout(() => {
        if (isConnected) {
          toast({
            title: "Wallet connected",
            description: "Your wallet has been connected successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      }, 500);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    try {
      disconnect();
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
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

              <Box>
                <Stat textAlign="right">
                  <StatLabel>Funding Progress</StatLabel>
                  <StatNumber>{Math.round((escrow.funded / budget) * 100)}%</StatNumber>
                  <StatHelpText>
                    {formatCurrency(escrow.funded)} of {formatCurrency(budget)}
                  </StatHelpText>
                </Stat>
              </Box>
            </HStack>

            <Progress
              value={(escrow.funded / budget) * 100}
              colorScheme="green"
              size="sm"
              borderRadius="full"
              mt={2}
            />
          </Box>

          <Divider />

          {isFullyFunded ? (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Escrow Fully Funded</Text>
                <Text fontSize="sm">The escrow contract has been fully funded.</Text>
              </Box>
            </Alert>
          ) : (
            <>
              {/* Wallet Connection */}
              {!isConnected && (
                <Box mb={4}>
                  <Alert status="info" borderRadius="md" mb={3}>
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">Connect Your Wallet</Text>
                      <Text fontSize="sm">Connect your wallet to continue with payments</Text>
                    </Box>
                  </Alert>
                  <Button
                    colorScheme="blue"
                    width="full"
                    onClick={connectWallet}
                    leftIcon={<FiWifi />}
                  >
                    Connect Wallet
                  </Button>
                </Box>
              )}

              {/* Wallet Disconnection */}
              {isConnected && (
                <Box mb={4}>
                  <Alert status="info" borderRadius="md" mb={3}>
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">Connected Wallet</Text>
                      <Text fontSize="sm">Your wallet is connected: {address}</Text>
                    </Box>
                  </Alert>
                  <Button
                    colorScheme="red"
                    width="full"
                    onClick={disconnectWallet}
                    leftIcon={<FiLock />}
                  >
                    Disconnect Wallet
                  </Button>
                </Box>
              )}

              {/* Payment Method Selection */}
              {isConnected && (
                <>
                  <Box>
                    <Text fontWeight="bold" mb={3}>Select Payment Method</Text>

                    <Card
                      variant="outline"
                      cursor="pointer"
                      onClick={() => handleMethodSelect('coinbase')}
                      bg={selectedMethod === 'coinbase' ? 'blue.50' : 'white'}
                      borderColor={selectedMethod === 'coinbase' ? 'blue.500' : 'gray.200'}
                      _hover={{ borderColor: 'blue.300' }}
                      transition="all 0.2s"
                    >
                      <CardBody>
                        <Flex align="center" justify="space-between">
                          <HStack>
                            <Image
                              src="https://cryptologos.cc/logos/coinbase-coin-coinbase-logo.png"
                              boxSize="40px"
                              alt="Coinbase Logo"
                            />
                            <Box>
                              <Text fontWeight="bold">Coinbase</Text>
                              <Text fontSize="sm" color="gray.500">Pay with crypto or credit card</Text>
                            </Box>
                          </HStack>
                          {selectedMethod === 'coinbase' && <FiCheckCircle color="green" />}
                        </Flex>
                      </CardBody>
                    </Card>
                  </Box>

                  {/* Payment Details */}
                  {selectedMethod && (
                    <Box>
                      <Text fontWeight="bold" mb={3}>Payment Details</Text>

                      <FormControl>
                        <FormLabel>Amount to Fund (USD)</FormLabel>
                        <Input
                          type="number"
                          value={fundingAmount}
                          onChange={(e) => setFundingAmount(Number(e.target.value))}
                          min={1}
                          max={budget - escrow.funded}
                        />
                      </FormControl>

                      <Button
                        colorScheme="blue"
                        size="lg"
                        width="full"
                        mt={4}
                        leftIcon={<FiCreditCard />}
                        onClick={handleCoinbaseFunding}
                        isLoading={isLoading || apiLoading}
                        loadingText="Processing"
                        disabled={fundingAmount <= 0 || fundingAmount > budget - escrow.funded}
                      >
                        Pay {formatCurrency(fundingAmount)}
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </VStack>
      </Box>

      {/* Payment Modal */}
      <Modal isOpen={isPaymentModalOpen} onClose={onPaymentModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Complete Your Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {paymentUrl ? (
              <VStack spacing={4}>
                <Text>Please complete your payment through Coinbase Commerce:</Text>
                <Box as="iframe" src={paymentUrl} width="100%" height="400px" />
              </VStack>
            ) : (
              <VStack spacing={4} justify="center" height="200px">
                <Spinner size="xl" />
                <Text>Preparing payment portal...</Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onPaymentModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CoinbasePayment;
