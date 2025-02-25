import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  useColorModeValue,
  IconButton,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { FiEye, FiRefreshCcw } from 'react-icons/fi';

export interface Task {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  reward: string;
  client: string;
}

interface TaskHistoryProps {
  tasks: Task[];
  onViewTask?: (taskId: string) => void;
  onRetryTask?: (taskId: string) => void;
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({ 
  tasks, 
  onViewTask, 
  onRetryTask 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

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

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return '-';
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
    >
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Task ID</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Client</Th>
              <Th>Duration</Th>
              <Th>Reward</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tasks.map((task) => (
              <Tr key={task.id}>
                <Td>
                  <Text fontSize="sm" fontFamily="mono">
                    {task.id.slice(0, 8)}...
                  </Text>
                </Td>
                <Td>{task.type}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="sm" fontFamily="mono">
                    {task.client.slice(0, 6)}...{task.client.slice(-4)}
                  </Text>
                </Td>
                <Td>{formatDuration(task.startTime, task.endTime)}</Td>
                <Td>{task.reward} ETH</Td>
                <Td>
                  <Flex gap={2}>
                    <Tooltip label="View Details">
                      <IconButton
                        aria-label="View task details"
                        icon={<FiEye />}
                        size="sm"
                        onClick={() => onViewTask?.(task.id)}
                      />
                    </Tooltip>
                    {task.status === 'failed' && (
                      <Tooltip label="Retry Task">
                        <IconButton
                          aria-label="Retry task"
                          icon={<FiRefreshCcw />}
                          size="sm"
                          colorScheme="blue"
                          onClick={() => onRetryTask?.(task.id)}
                        />
                      </Tooltip>
                    )}
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default TaskHistory;
