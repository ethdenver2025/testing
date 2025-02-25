import React, { useState } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Icon,
  HStack,
  Divider,
  Badge,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { FiUser, FiServer, FiShield, FiChevronDown, FiSettings, FiLogOut } from 'react-icons/fi';
import { useWallet } from '../../hooks/useWallet';

type DashboardType = 'worker' | 'client' | 'admin';

interface DashboardOption {
  id: DashboardType;
  label: string;
  icon: typeof FiUser;
  description: string;
  badge?: string;
  badgeColor?: string;
}

export const MetaDashboard: React.FC = () => {
  const { account, balance, disconnect } = useWallet();
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardType>('worker');
  
  const bgColor = useColorModeValue('monokai.800', 'monokai.900');
  const borderColor = useColorModeValue('monokai.700', 'monokai.600');
  const hoverBg = useColorModeValue('monokai.700', 'monokai.800');

  const dashboardOptions: DashboardOption[] = [
    {
      id: 'worker',
      label: 'Worker Dashboard',
      icon: FiServer,
      description: 'Manage your worker node and view task history',
      badge: 'Active',
      badgeColor: 'brand.success',
    },
    {
      id: 'client',
      label: 'Client Dashboard',
      icon: FiUser,
      description: 'Submit and monitor your tasks',
      badge: 'New',
      badgeColor: 'brand.info',
    },
    {
      id: 'admin',
      label: 'Admin Dashboard',
      icon: FiShield,
      description: 'System monitoring and configuration',
    },
  ];

  const handleDashboardSelect = (type: DashboardType) => {
    setSelectedDashboard(type);
    // You can add navigation logic here
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Header */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        py={4}
        px={8}
        bg={bgColor}
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="lg">Formicary</Heading>
        
        <HStack spacing={4}>
          <Text>{balance ? `${Number(balance).toFixed(4)} ETH` : '0.0000 ETH'}</Text>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FiChevronDown />}
              variant="ghost"
            >
              <HStack>
                <Avatar size="sm" name={account?.slice(0, 6)} />
                <Text>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}</Text>
              </HStack>
            </MenuButton>
            <MenuList>
              <MenuItem icon={<Icon as={FiSettings} />}>Settings</MenuItem>
              <MenuItem icon={<Icon as={FiLogOut} />} onClick={disconnect}>
                Disconnect
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      {/* Main Content */}
      <Box maxW="container.xl" mx="auto" py={8} px={4}>
        <VStack spacing={6} align="stretch">
          <Heading size="md">Select Dashboard</Heading>
          
          <Flex wrap="wrap" gap={4}>
            {dashboardOptions.map((option) => (
              <Box
                key={option.id}
                p={6}
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="lg"
                cursor="pointer"
                onClick={() => handleDashboardSelect(option.id)}
                _hover={{ bg: hoverBg }}
                flex="1"
                minW="300px"
                position="relative"
                opacity={selectedDashboard === option.id ? 1 : 0.7}
              >
                <Flex align="center" mb={3}>
                  <Icon as={option.icon} boxSize={6} color="brand.primary" />
                  <Heading size="md" ml={3}>
                    {option.label}
                  </Heading>
                  {option.badge && (
                    <Badge
                      ml={2}
                      colorScheme={option.badgeColor}
                      variant="subtle"
                      fontSize="sm"
                    >
                      {option.badge}
                    </Badge>
                  )}
                </Flex>
                <Text color="gray.500">{option.description}</Text>
                {selectedDashboard === option.id && (
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    height="3px"
                    bg="brand.primary"
                    borderBottomRadius="lg"
                  />
                )}
              </Box>
            ))}
          </Flex>

          <Divider />

          {/* Dashboard Content */}
          <Box>
            {/* This is where we'll render the selected dashboard component */}
            {/* For now, we'll just show a placeholder */}
            <Box p={6} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <Text fontSize="lg" fontWeight="medium">
                {selectedDashboard.charAt(0).toUpperCase() + selectedDashboard.slice(1)} Dashboard
              </Text>
              <Text color="gray.500" mt={2}>
                Selected dashboard content will be rendered here
              </Text>
            </Box>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default MetaDashboard;
