import React from 'react';
import {
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';

interface TaskFilterProps {
  onFilterChange: (filters: TaskFilters) => void;
}

export interface TaskFilters {
  status: string;
  type: string;
  search: string;
  sortBy: string;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<TaskFilters>({
    status: 'all',
    type: 'all',
    search: '',
    sortBy: 'newest',
  });

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <HStack spacing={4} mb={4} wrap="wrap">
      <InputGroup maxW="300px">
        <InputLeftElement pointerEvents="none">
          <FiSearch color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </InputGroup>

      <Select
        maxW="200px"
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="running">Running</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </Select>

      <Select
        maxW="200px"
        value={filters.type}
        onChange={(e) => handleFilterChange('type', e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="Data Processing">Data Processing</option>
        <option value="ML Training">ML Training</option>
        <option value="Video Processing">Video Processing</option>
      </Select>

      <Select
        maxW="200px"
        value={filters.sortBy}
        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="reward-high">Highest Reward</option>
        <option value="reward-low">Lowest Reward</option>
      </Select>
    </HStack>
  );
};

export default TaskFilter;
