import React from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useWallet, WalletType } from '../../hooks/useWallet';

export const WalletConnect: React.FC = () => {
  const {
    connect,
    disconnect,
    isConnected,
    address,
    walletType,
    isBaseWalletAvailable,
  } = useWallet();
  const toast = useToast();

  const handleConnect = async (type: WalletType) => {
    try {
      await connect(type);
      toast({
        title: 'Wallet Connected',
        description: `Successfully connected ${type === WalletType.Base ? 'Base Wallet' : 'Web3 Wallet'}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast({
        title: 'Wallet Disconnected',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: error instanceof Error ? error.message : 'Failed to disconnect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon width={20} height={20} />}
          colorScheme="blue"
        >
          Connect Wallet
        </MenuButton>
        <MenuList>
          {isBaseWalletAvailable && (
            <MenuItem
              onClick={() => handleConnect(WalletType.Base)}
              icon={
                <Icon viewBox="0 0 24 24" boxSize={5}>
                  <path
                    fill="currentColor"
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  />
                </Icon>
              }
            >
              <HStack>
                <Text>Connect Base Wallet</Text>
                <Text fontSize="sm" color="green.500">
                  (Recommended)
                </Text>
              </HStack>
            </MenuItem>
          )}
          <MenuItem
            onClick={() => handleConnect(WalletType.Standard)}
            icon={
              <Icon viewBox="0 0 24 24" boxSize={5}>
                <path
                  fill="currentColor"
                  d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                />
              </Icon>
            }
          >
            Connect Web3 Wallet
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon width={20} height={20} />}
        variant="outline"
      >
        <HStack spacing={2}>
          <Icon
            viewBox="0 0 24 24"
            boxSize={5}
            color={walletType === WalletType.Base ? 'green.500' : 'blue.500'}
          >
            {walletType === WalletType.Base ? (
              <path
                fill="currentColor"
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              />
            ) : (
              <path
                fill="currentColor"
                d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
              />
            )}
          </Icon>
          <Text>{address ? formatAddress(address) : 'Connected'}</Text>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleDisconnect} color="red.500">
          Disconnect
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
