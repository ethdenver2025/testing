import React from 'react';
import {
  HStack,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface TaskFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
}

export const TaskFilter: React.FC<TaskFilterProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}) => {
  const inputBg = useColorModeValue('monokai.700', 'monokai.800');
  const inputHoverBg = useColorModeValue('monokai.600', 'monokai.700');
  const iconColor = useColorModeValue('gray.400', 'gray.500');

  return (
    <HStack spacing={4} mb={4} width="full">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <FiSearch color={iconColor} />
        </InputLeftElement>
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          size="sm"
          bg={inputBg}
          border="none"
          _hover={{ bg: inputHoverBg }}
          _focus={{ boxShadow: 'none', bg: inputHoverBg }}
        />
      </InputGroup>

      <InputGroup maxW="200px">
        <InputLeftElement pointerEvents="none">
          <FiFilter color={iconColor} />
        </InputLeftElement>
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          size="sm"
          bg={inputBg}
          border="none"
          pl={10}
          _hover={{ bg: inputHoverBg }}
          _focus={{ boxShadow: 'none', bg: inputHoverBg }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </Select>
      </InputGroup>

      <InputGroup maxW="200px">
        <InputLeftElement pointerEvents="none">
          <FiFilter color={iconColor} />
        </InputLeftElement>
        <Select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          size="sm"
          bg={inputBg}
          border="none"
          pl={10}
          _hover={{ bg: inputHoverBg }}
          _focus={{ boxShadow: 'none', bg: inputHoverBg }}
        >
          <option value="all">All Types</option>
          <option value="storage">Storage</option>
          <option value="processing">Processing</option>
          <option value="verification">Verification</option>
          <option value="computation">Computation</option>
        </Select>
      </InputGroup>
    </HStack>
  );
};

export default TaskFilter;
