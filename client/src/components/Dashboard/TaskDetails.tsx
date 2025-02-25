import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Box,
  Progress,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { Task } from './TaskHistory';

interface TaskDetailsProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ task, isOpen, onClose }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (!task) return null;

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'running':
        return 'blue';
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getProgress = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'running':
        return 60;
      case 'completed':
        return 100;
      case 'failed':
        return 30;
      default:
        return 0;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Task Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontSize="sm" color="gray.500">Task ID</Text>
              <Text fontFamily="mono">{task.id}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">Status</Text>
              <HStack>
                <Badge colorScheme={getStatusColor(task.status)}>{task.status}</Badge>
                <Progress
                  value={getProgress(task.status)}
                  size="sm"
                  colorScheme={getStatusColor(task.status)}
                  width="100%"
                />
              </HStack>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">Type</Text>
              <Text>{task.type}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">Client</Text>
              <Text fontFamily="mono">{task.client}</Text>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500">Reward</Text>
              <Text>{task.reward} ETH</Text>
            </Box>

            <Divider borderColor={borderColor} />

            <Box>
              <Text fontSize="sm" color="gray.500">Start Time</Text>
              <Text>{task.startTime.toLocaleString()}</Text>
            </Box>

            {task.endTime && (
              <Box>
                <Text fontSize="sm" color="gray.500">End Time</Text>
                <Text>{task.endTime.toLocaleString()}</Text>
              </Box>
            )}

            {/* Add more task details as needed */}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetails;
