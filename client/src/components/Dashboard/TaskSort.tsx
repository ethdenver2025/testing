import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Icon,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiChevronDown, FiClock, FiDollarSign, FiActivity } from 'react-icons/fi';

export type SortOption = {
  id: string;
  label: string;
  icon: React.ComponentType;
};

export type SortDirection = 'asc' | 'desc';

export interface TaskSortProps {
  currentSort: string;
  direction: SortDirection;
  onSortChange: (sortId: string) => void;
  onDirectionChange: (direction: SortDirection) => void;
}

const sortOptions: SortOption[] = [
  { id: 'time', label: 'Time', icon: FiClock },
  { id: 'reward', label: 'Reward', icon: FiDollarSign },
  { id: 'status', label: 'Status', icon: FiActivity },
];

export const TaskSort: React.FC<TaskSortProps> = ({
  currentSort,
  direction,
  onSortChange,
  onDirectionChange,
}) => {
  const menuBg = useColorModeValue('monokai.700', 'monokai.800');
  const menuHoverBg = useColorModeValue('monokai.600', 'monokai.700');
  const textColor = useColorModeValue('gray.200', 'gray.300');

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.id === currentSort);
    return option ? option.label : 'Sort by';
  };

  const toggleDirection = () => {
    onDirectionChange(direction === 'asc' ? 'desc' : 'asc');
  };

  return (
    <HStack spacing={2}>
      <Text fontSize="sm" color={textColor}>Sort:</Text>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<FiChevronDown />}
          size="sm"
          variant="ghost"
          bg={menuBg}
          _hover={{ bg: menuHoverBg }}
          _active={{ bg: menuHoverBg }}
        >
          <HStack>
            {currentSort && (
              <Icon
                as={sortOptions.find(opt => opt.id === currentSort)?.icon}
                mr={2}
              />
            )}
            <Text>{getCurrentSortLabel()}</Text>
          </HStack>
        </MenuButton>
        <MenuList bg={menuBg} borderColor={menuHoverBg}>
          {sortOptions.map((option) => (
            <MenuItem
              key={option.id}
              onClick={() => onSortChange(option.id)}
              bg={menuBg}
              _hover={{ bg: menuHoverBg }}
              icon={<Icon as={option.icon} />}
            >
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Button
        size="sm"
        variant="ghost"
        onClick={toggleDirection}
        bg={menuBg}
        _hover={{ bg: menuHoverBg }}
        _active={{ bg: menuHoverBg }}
      >
        {direction === 'asc' ? '↑' : '↓'}
      </Button>
    </HStack>
  );
};
