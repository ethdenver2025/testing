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
  HStack,
  Flex,
} from '@chakra-ui/react';
import { FiEye, FiRefreshCcw } from 'react-icons/fi';
import { format } from 'date-fns';
import { TaskFilter } from './TaskFilter';
import { TaskSort, SortDirection } from './TaskSort';
import { TaskLoadingState } from './TaskLoadingState';

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
  isLoading?: boolean;
  onViewTask: (taskId: string) => void;
  onRetryTask: (taskId: string) => void;
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({
  tasks,
  isLoading = false,
  onViewTask,
  onRetryTask
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'time':
          comparison = a.startTime.getTime() - b.startTime.getTime();
          break;
        case 'reward':
          comparison = parseFloat(a.reward) - parseFloat(b.reward);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
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

  const sortedTasks = sortTasks(filteredTasks);

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return '-';
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return <TaskLoadingState />;
  }

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={4}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <TaskFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
        />
        <TaskSort
          currentSort={sortField}
          direction={sortDirection}
          onSortChange={setSortField}
          onDirectionChange={setSortDirection}
        />
      </Flex>

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
            {sortedTasks.map((task) => (
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
                  <HStack spacing={2}>
                    <Tooltip label="View Details">
                      <IconButton
                        aria-label="View task details"
                        icon={<FiEye />}
                        size="sm"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => onViewTask(task.id)}
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
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        {sortedTasks.length === 0 && (
          <Text textAlign="center" py={4} color={textColor}>
            No tasks found matching the current filters
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default TaskHistory;
