import React, { useState } from 'react';
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
  Tooltip,
} from '@chakra-ui/react';
import { FiEye, FiRefreshCcw } from 'react-icons/fi';
import { format } from 'date-fns';
import { TaskFilter } from './TaskFilter';

export interface Task {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  client: string;
  startTime: Date;
  endTime?: Date;
  reward: string;
}

interface TaskHistoryProps {
  tasks: Task[];
  onViewTask: (taskId: string) => void;
  onRetryTask: (taskId: string) => void;
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({
  tasks,
  onViewTask,
  onRetryTask
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const bgColor = useColorModeValue('monokai.800', 'monokai.900');
  const borderColor = useColorModeValue('monokai.700', 'monokai.600');
  const textColor = useColorModeValue('gray.200', 'gray.300');

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'brand.success';
      case 'failed':
        return 'brand.error';
      case 'running':
        return 'brand.info';
      case 'pending':
        return 'brand.warning';
      default:
        return 'gray.500';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={4}
    >
      <TaskFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      <Box overflowX="auto">
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr>
              <Th color={textColor}>Task ID</Th>
              <Th color={textColor}>Type</Th>
              <Th color={textColor}>Status</Th>
              <Th color={textColor}>Client</Th>
              <Th color={textColor}>Duration</Th>
              <Th color={textColor}>Reward</Th>
              <Th color={textColor}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredTasks.map((task) => (
              <Tr key={task.id}>
                <Td>
                  <Text fontSize="sm" fontFamily="mono">
                    {task.id}
                  </Text>
                </Td>
                <Td>{task.type}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(task.status)}>
                    {task.status}
                  </Badge>
                </Td>
                <Td>{task.client}</Td>
                <Td>{formatDuration(task.startTime, task.endTime)}</Td>
                <Td>{task.reward}</Td>
                <Td>
                  <Tooltip label="View Details">
                    <IconButton
                      aria-label="View task details"
                      icon={<FiEye />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => onViewTask(task.id)}
                      mr={2}
                    />
                  </Tooltip>
                  {task.status === 'failed' && (
                    <Tooltip label="Retry Task">
                      <IconButton
                        aria-label="Retry task"
                        icon={<FiRefreshCcw />}
                        size="sm"
                        variant="ghost"
                        colorScheme="green"
                        onClick={() => onRetryTask(task.id)}
                      />
                    </Tooltip>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {filteredTasks.length === 0 && (
          <Text textAlign="center" py={4} color={textColor}>
            No tasks found matching the current filters
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default TaskHistory;
