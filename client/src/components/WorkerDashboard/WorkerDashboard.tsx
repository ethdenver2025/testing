import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { WalletConnect } from '../shared/WalletConnect';
import { EarningsOverview } from '../earnings/EarningsOverview';
import { useWallet } from '../../hooks/useWallet';

export interface WorkerDashboardProps {
  worker?: {
    name: string;
    reputationScore: number;
    totalEarnings: number;
    jobsCompleted: number;
  };
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ worker }) => {
  const { isConnected } = useWallet();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const mockEarnings = [
    { date: '2025-02-20', amount: 1500, currency: 'USD', jobCount: 3 },
    { date: '2025-02-21', amount: 2000, currency: 'USD', jobCount: 4 },
    { date: '2025-02-22', amount: 2500, currency: 'USD', jobCount: 2 },
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={1}>
          <Heading size="lg">
            {worker ? `${worker.name}'s Dashboard` : 'Worker Dashboard'}
          </Heading>
          <Text color="gray.600">Manage your worker profile and earnings</Text>
        </VStack>
        <WalletConnect />
      </Flex>

      {!isConnected ? (
        <Box
          p={8}
          bg={bgColor}
          borderRadius="lg"
          borderWidth={1}
          borderColor={borderColor}
          textAlign="center"
        >
          <Text fontSize="lg" mb={4}>
            Connect your wallet to view your worker dashboard
          </Text>
        </Box>
      ) : (
        <VStack spacing={8} align="stretch">
          <EarningsOverview data={mockEarnings} />
        </VStack>
      )}
    </Container>
  );
};
