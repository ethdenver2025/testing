import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  Text,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuth();

  const bgColor = 'monokai.900';
  const borderColor = 'monokai.700';
  const hoverBg = 'monokai.800';

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Top Navigation */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        p={4}
        borderBottom="1px solid"
        borderColor={borderColor}
        bg={bgColor}
      >
        <IconButton
          aria-label="Menu"
          icon={<HamburgerIcon />}
          onClick={onOpen}
          variant="ghost"
          color="brand.primary"
          _hover={{ bg: hoverBg }}
        />

        <HStack spacing={4}>
          {user && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<SettingsIcon />}
                variant="ghost"
                color="brand.primary"
                _hover={{ bg: hoverBg }}
              />
              <MenuList bg={bgColor} borderColor={borderColor}>
                <MenuItem
                  onClick={() => {/* Navigate to profile */}}
                  _hover={{ bg: hoverBg }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  _hover={{ bg: hoverBg }}
                  color="brand.error"
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Flex>

      {/* Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bgColor} color="white">
          <DrawerCloseButton color="brand.primary" />
          <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
            <Text color="brand.primary">Formicary</Text>
          </DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch">
              {user && (
                <Box p={4} borderRadius="md" bg={hoverBg}>
                  <VStack align="start" spacing={2}>
                    <Avatar size="sm" name={user.username || undefined} />
                    <Text fontSize="sm" color="brand.secondary">
                      {user.username || 'Anonymous'}
                    </Text>
                    <Text fontSize="xs" color="gray.500" isTruncated maxW="100%">
                      {user.walletAddress}
                    </Text>
                  </VStack>
                </Box>
              )}
              {/* Add navigation items here */}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box as="main" p={6}>
        {children}
      </Box>
    </Box>
  );
};
