import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { DashboardStats } from './DashboardStats';
import TaskHistory from './TaskHistory';
import { Task } from './TaskHistory';
import { fetchTasks, retryTask, getTaskDetails } from '../../api/tasks';

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: 'Error loading tasks',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    // Set up polling for task updates
    const interval = setInterval(loadTasks, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleViewTask = async (taskId: string) => {
    try {
      const taskDetails = await getTaskDetails(taskId);
      setSelectedTask(taskDetails);
      onOpen();
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load task details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRetryTask = async (taskId: string) => {
    try {
      await retryTask(taskId);
      toast({
        title: 'Task Retry Initiated',
        description: 'The task has been queued for retry',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      loadTasks(); // Refresh the task list
    } catch (error) {
      console.error('Error retrying task:', error);
      toast({
        title: 'Error',
        description: 'Failed to retry task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg" mb={2}>Dashboard</Heading>
        
        <DashboardStats />

        <Box>
          <TaskHistory
            tasks={tasks}
            isLoading={isLoading}
            onViewTask={handleViewTask}
            onRetryTask={handleRetryTask}
          />
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Task Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedTask && (
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <strong>Task ID:</strong> {selectedTask.id}
                  </Box>
                  <Box>
                    <strong>Type:</strong> {selectedTask.type}
                  </Box>
                  <Box>
                    <strong>Status:</strong> {selectedTask.status}
                  </Box>
                  <Box>
                    <strong>Client:</strong> {selectedTask.client}
                  </Box>
                  <Box>
                    <strong>Start Time:</strong>{' '}
                    {new Date(selectedTask.startTime).toLocaleString()}
                  </Box>
                  {selectedTask.endTime && (
                    <Box>
                      <strong>End Time:</strong>{' '}
                      {new Date(selectedTask.endTime).toLocaleString()}
                    </Box>
                  )}
                  <Box>
                    <strong>Reward:</strong> {selectedTask.reward} ETH
                  </Box>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};
