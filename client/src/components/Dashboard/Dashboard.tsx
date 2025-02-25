import React from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  SimpleGrid,
  Container,
  Flex,
} from '@chakra-ui/react';
import { useWallet } from '../../hooks/useWallet';

interface DashboardProps {
  // Add any specific props here
}

export const Dashboard: React.FC<DashboardProps> = () => {
  const { account, balance } = useWallet();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Worker Dashboard</Heading>
      
      {/* Overview Stats */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Stat
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel>Available Balance</StatLabel>
          <StatNumber>{balance ? `${Number(balance).toFixed(4)} ETH` : '0.0000 ETH'}</StatNumber>
          <StatHelpText>Your current earnings</StatHelpText>
        </Stat>

        <Stat
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel>Active Tasks</StatLabel>
          <StatNumber>0</StatNumber>
          <StatHelpText>Currently running</StatHelpText>
        </Stat>

        <Stat
          p={4}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <StatLabel>Completed Tasks</StatLabel>
          <StatNumber>0</StatNumber>
          <StatHelpText>Last 24 hours</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Main Content Grid */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        {/* Tasks Section */}
        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4}>Recent Tasks</Heading>
          <Text color="gray.500">No recent tasks found.</Text>
        </Box>

        {/* Worker Info Section */}
        <Box
          bg={bgColor}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4}>Worker Information</Heading>
          <Flex direction="column" gap={2}>
            <Text>
              <strong>Address:</strong>{' '}
              {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
            </Text>
            <Text>
              <strong>Status:</strong> Online
            </Text>
            <Text>
              <strong>Uptime:</strong> 0h 0m
            </Text>
          </Flex>
        </Box>
      </Grid>
    </Container>
  );
};

export default Dashboard;
