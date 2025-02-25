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
} from '@chakra-ui/react';

export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  reward: string;
}

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
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

  if (tasks.length === 0) {
    return (
      <Box
        bg={bgColor}
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Text color="gray.500">No tasks available.</Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Task ID</Th>
            <Th>Name</Th>
            <Th>Status</Th>
            <Th>Start Time</Th>
            <Th>End Time</Th>
            <Th>Reward</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task.id}>
              <Td>{task.id.slice(0, 8)}...</Td>
              <Td>{task.name}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </Td>
              <Td>{task.startTime?.toLocaleString() || '-'}</Td>
              <Td>{task.endTime?.toLocaleString() || '-'}</Td>
              <Td>{task.reward} ETH</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TaskList;
