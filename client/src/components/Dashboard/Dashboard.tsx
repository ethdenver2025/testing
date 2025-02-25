import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Button,
  Flex,
  Spacer,
  Switch,
  FormControl,
  FormLabel,
  Badge,
} from '@chakra-ui/react';
import { FiPower } from 'react-icons/fi';
import { useWallet } from '../../hooks/useWallet';
import { WorkerMetrics } from './WorkerMetrics';
import { TaskHistory, Task } from './TaskHistory';

export const Dashboard: React.FC = () => {
  const { account, balance } = useWallet();
  const [isWorkerActive, setIsWorkerActive] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Mock data for demonstration
  const mockTasks: Task[] = [
    {
      id: '0x1234567890abcdef',
      type: 'Data Processing',
      status: 'completed',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(),
      reward: '0.05',
      client: '0xabcdef1234567890',
    },
    {
      id: '0x2345678901bcdef',
      type: 'ML Training',
      status: 'running',
      startTime: new Date(Date.now() - 1800000),
      reward: '0.08',
      client: '0xbcdef1234567890a',
    },
    {
      id: '0x3456789012cdef',
      type: 'Video Processing',
      status: 'failed',
      startTime: new Date(Date.now() - 7200000),
      endTime: new Date(Date.now() - 5400000),
      reward: '0.03',
      client: '0xcdef1234567890ab',
    },
  ];

  const handleViewTask = (taskId: string) => {
    console.log('View task:', taskId);
    // Implement task viewing logic
  };

  const handleRetryTask = (taskId: string) => {
    console.log('Retry task:', taskId);
    // Implement task retry logic
  };

  const toggleWorkerStatus = () => {
    setIsWorkerActive(!isWorkerActive);
    // Implement worker status toggle logic
  };

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Flex align="center" mb={6}>
            <Box>
              <Heading size="lg">Worker Dashboard</Heading>
              <Text color="gray.500" mt={1}>
                Connected as: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
              </Text>
            </Box>
            <Spacer />
            <HStack spacing={4}>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="worker-status" mb="0">
                  Worker Status
                </FormLabel>
                <HStack>
                  <Switch
                    id="worker-status"
                    isChecked={isWorkerActive}
                    onChange={toggleWorkerStatus}
                    colorScheme="green"
                  />
                  <Badge colorScheme={isWorkerActive ? 'green' : 'red'}>
                    {isWorkerActive ? 'Active' : 'Inactive'}
                  </Badge>
                </HStack>
              </FormControl>
            </HStack>
          </Flex>

          {/* Metrics */}
          <WorkerMetrics />

          {/* Task History */}
          <Box>
            <Flex align="center" mb={4}>
              <Heading size="md">Recent Tasks</Heading>
              <Spacer />
              <Button size="sm" colorScheme="blue" variant="outline">
                View All
              </Button>
            </Flex>
            <TaskHistory
              tasks={mockTasks}
              onViewTask={handleViewTask}
              onRetryTask={handleRetryTask}
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Dashboard;
