import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiSettings, FiLogOut, FiMonitor, FiUsers } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export const DashboardNav = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getInitials = (username: string) => {
    return username
      .split('_')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDashboardPath = () => {
    if (!user?.activeRole) return '/';
    return user.activeRole === 'PRODUCTION_CREW' ? '/crew-dashboard' : '/organizer-dashboard';
  };

  return (
    <Box
      bg="carbon.800"
      px={4}
      position="fixed"
      top={0}
      left={0}
      right={0}
      borderBottom={1}
      borderStyle="solid"
      borderColor="carbon.700"
      zIndex={100}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <HStack spacing={8} alignItems="center">
          <Text
            fontSize="lg"
            fontWeight="medium"
            letterSpacing="wide"
            cursor="pointer"
            onClick={() => navigate(getDashboardPath())}
          >
            Formicary
          </Text>
        </HStack>

        <Menu>
          <MenuButton
            as={Box}
            rounded="full"
            cursor="pointer"
          >
            <Avatar
              size="sm"
              name={user?.username}
              bg="carbon.600"
              color="whiteAlpha.900"
              fontWeight="light"
            >
              {user?.username ? getInitials(user.username) : ''}
            </Avatar>
          </MenuButton>
          <MenuList>
            <Text px="3" py="2" fontSize="sm" color="whiteAlpha.700" fontWeight="light">
              {user?.username}
            </Text>
            <MenuDivider />
            
            {user?.userTypes?.length > 1 && (
              <>
                <MenuItem
                  icon={user.activeRole === 'PRODUCTION_CREW' ? <FiUsers /> : <FiMonitor />}
                  onClick={() => switchRole(user.activeRole === 'PRODUCTION_CREW' ? 'EVENT_ORGANIZER' : 'PRODUCTION_CREW')}
                  fontWeight="light"
                >
                  Switch to {user.activeRole === 'PRODUCTION_CREW' ? 'Event Organizer' : 'Production Crew'}
                </MenuItem>
                <MenuDivider />
              </>
            )}
            
            <MenuItem
              icon={<FiSettings />}
              onClick={() => navigate('/account-settings')}
              fontWeight="light"
            >
              Account Settings
            </MenuItem>
            <MenuItem
              icon={<FiLogOut />}
              onClick={handleLogout}
              fontWeight="light"
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};
