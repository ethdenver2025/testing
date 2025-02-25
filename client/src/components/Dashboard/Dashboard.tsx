import React, { useState, useEffect } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import { FiPower } from 'react-icons/fi';
import { useWallet } from '../../hooks/useWallet';
import { WorkerMetrics } from './WorkerMetrics';
import { TaskHistory, Task } from './TaskHistory';
import { DashboardStats } from './DashboardStats';

export const Dashboard: React.FC = () => {
  const { account, balance } = useWallet();
  const [isWorkerActive, setIsWorkerActive] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  useEffect(() => {
    // Simulated data loading
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        // Replace this with actual API call
        const mockTasks: Task[] = [
          {
            id: '1',
            type: 'Storage',
            status: 'completed',
            client: '0x1234...5678',
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(),
            reward: '0.5',
          },
          {
            id: '2',
            type: 'Processing',
            status: 'running',
            client: '0x8765...4321',
            startTime: new Date(Date.now() - 1800000),
            reward: '0.3',
          },
          {
            id: '3',
            type: 'Verification',
            status: 'failed',
            client: '0x9876...1234',
            startTime: new Date(Date.now() - 7200000),
            endTime: new Date(Date.now() - 3600000),
            reward: '0.4',
          },
        ];

        setTimeout(() => {
          setTasks(mockTasks);
          setIsLoading(false);
        }, 1000); // Simulate network delay
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast({
          title: 'Error loading tasks',
          description: 'Please try again later',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [toast]);

  const handleViewTask = (taskId: string) => {
    // Implement task view logic
    console.log('Viewing task:', taskId);
  };

  const handleRetryTask = (taskId: string) => {
    // Implement task retry logic
    console.log('Retrying task:', taskId);
    toast({
      title: 'Retrying task',
      description: `Task ${taskId} has been queued for retry`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
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

          {/* Dashboard Stats */}
          <DashboardStats />

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
              tasks={tasks}
              isLoading={isLoading}
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
