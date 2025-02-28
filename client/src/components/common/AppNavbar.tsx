import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge,
  HStack,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { FaUsers, FaCalendarAlt, FaWallet, FaUserCircle, FaCertificate } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import TrustBadge from '../crew/TrustBadge';

export default function AppNavbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('gray.800', 'gray.900')}
        color={useColorModeValue('white', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4, md: 6 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.700', 'gray.900')}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <Button
            onClick={onToggle}
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          >
            {isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
          </Button>
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Link
            as={RouterLink}
            to={'/dashboard'}
            textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
            fontFamily={'heading'}
            color={useColorModeValue('white', 'white')}
            _hover={{
              textDecoration: 'none',
            }}
          >
            <Text fontSize="xl" fontWeight="bold">
              Formicary<Text as="span" color="blue.400">.app</Text>
            </Text>
          </Link>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav currentPath={location.pathname} />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {user ? (
            <HStack spacing={4}>
              {user.trustScore && (
                <Box display={{ base: 'none', md: 'block' }}>
                  <TrustBadge
                    trustScore={user.trustScore}
                    size="sm"
                    showLabel={true}
                  />
                </Box>
              )}
              
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    name={user.username || undefined}
                    src={user.avatarUrl || undefined}
                    bg="blue.500"
                  />
                </MenuButton>
                <MenuList bg="gray.800" borderColor="gray.700">
                  <MenuItem as={RouterLink} to="/profile" bg="gray.800" _hover={{ bg: 'gray.700' }}>
                    <HStack>
                      <Icon as={FaUserCircle} />
                      <Text>Profile</Text>
                    </HStack>
                  </MenuItem>
                  
                  {user.trustScore && (
                    <MenuItem as={RouterLink} to={`/crew/${user.id}`} bg="gray.800" _hover={{ bg: 'gray.700' }}>
                      <HStack>
                        <Icon as={FaCertificate} />
                        <Text>Trust Profile</Text>
                        <Badge colorScheme="blue" ml={1}>
                          {Math.round(user.trustScore)}
                        </Badge>
                      </HStack>
                    </MenuItem>
                  )}
                  
                  <MenuItem as={RouterLink} to="/account-settings" bg="gray.800" _hover={{ bg: 'gray.700' }}>
                    <HStack>
                      <Icon as={FaWallet} />
                      <Text>Wallet & Settings</Text>
                    </HStack>
                  </MenuItem>
                  
                  <MenuDivider />
                  
                  <MenuItem 
                    onClick={logout} 
                    bg="gray.800" 
                    _hover={{ bg: 'gray.700' }}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          ) : (
            <Button
              as={RouterLink}
              to={'/login'}
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'blue.500'}
              _hover={{
                bg: 'blue.600',
              }}
            >
              Sign In
            </Button>
          )}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ currentPath }: { currentPath: string }) => {
  const linkColor = useColorModeValue('white', 'gray.200');
  const linkHoverColor = useColorModeValue('blue.400', 'blue.300');
  const popoverContentBgColor = useColorModeValue('gray.800', 'gray.900');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <Link
                as={RouterLink}
                p={2}
                to={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={currentPath === navItem.href ? 'blue.400' : linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                <HStack spacing={1}>
                  {navItem.icon && <Icon as={navItem.icon} />}
                  <Text>{navItem.label}</Text>
                </HStack>
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={popoverContentBgColor}
                p={4}
                rounded={'xl'}
                minW={'sm'}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel, isNew }: NavItem) => {
  return (
    <Link
      as={RouterLink}
      to={href ?? '#'}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('gray.700', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <HStack>
            <Text
              transition={'all .3s ease'}
              _groupHover={{ color: 'blue.400' }}
              fontWeight={500}
            >
              {label}
            </Text>
            {isNew && (
              <Badge colorScheme="green" fontSize="xs">
                NEW
              </Badge>
            )}
          </HStack>
          <Text fontSize={'sm'} color="gray.400">{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'blue.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('gray.800', 'gray.900')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href, icon }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={RouterLink}
        to={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <HStack>
          {icon && <Icon as={icon} />}
          <Text
            fontWeight={600}
            color={useColorModeValue('white', 'gray.200')}
          >
            {label}
          </Text>
        </HStack>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.700', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link
                key={child.label}
                py={2}
                as={RouterLink}
                to={child.href ?? '#'}
              >
                <HStack>
                  <Text color="gray.200">{child.label}</Text>
                  {child.isNew && (
                    <Badge colorScheme="green" fontSize="xs">
                      NEW
                    </Badge>
                  )}
                </HStack>
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  icon?: React.ComponentType<any>;
  isNew?: boolean;
}

const NAV_ITEMS: Array<NavItem> = [
  // Dashboard, Crew, Events, and Attestations links have been removed from the header as requested
];

const useBreakpointValue = (values: any) => {
  // This is a simplified version for the example
  return values.md;
};
